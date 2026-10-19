import type { ExtensionAPI, ExtensionCommandContext } from "@earendil-works/pi-coding-agent";
import {
  ANTIGRAVITY_IMAGE_API,
  ANTIGRAVITY_IMAGE_MODELS,
  generateAntigravityImages,
} from "./image/native.js";

// Namespace import: Oh My Pi rewrites this specifier onto bundled pi-ai, which
// does not export registerApiProvider. A static named import fails plugin load.
import * as piAiCompat from "@earendil-works/pi-ai/compat";
import {
  getApiKey,
  loginAntigravity,
  refreshAntigravityToken,
} from "./auth/index.js";
import { DEFAULT_ENDPOINT, defaultUserAgent, parseApiKey } from "./client/index.js";
import { getLastDiagnostics, runWithDiagnostics } from "./diagnostics/index.js";
import { generateAntigravityImage, parseImageCommandArgs } from "./image/index.js";
import { executeAntigravitySearch, parseSearchCommandArgs } from "./search/index.js";
import {
  applyAntigravityCatalog,
  discoverAntigravityModels,
  getCurrentAntigravityCatalog,
  PROVIDER_ID,
  PROVIDER_NAME,
  refreshAntigravityModels,
  resolvedCatalog,
} from "./models/index.js";
import { ANTIGRAVITY_API, streamAntigravity } from "./stream/index.js";
import {
  fetchAccountUsage,
  formatModelsList,
  formatUsageSummary,
  resolveApiKeyFromContext,
} from "./usage/index.js";
import { redactSecrets } from "./utils/index.js";

/**
 * Pi's interactive `notify` writes into the chat transcript. `console.log` in that
 * mode prints to the raw terminal and paints over the TUI. Use one channel only.
 */
function emitCommandOutput(
  ctx: ExtensionCommandContext,
  text: string,
  type: "info" | "warning" | "error" = "info",
): void {
  if (ctx.hasUI) {
    ctx.ui.notify(text, type);
    return;
  }
  if (type === "warning" || type === "error") console.error(text);
  else console.log(text);
}

async function withUsage(
  ctx: ExtensionCommandContext,
  fn: (usage: Awaited<ReturnType<typeof fetchAccountUsage>>) => string,
): Promise<void> {
  try {
    const apiKey = await resolveApiKeyFromContext(ctx);
    if (!apiKey) {
      emitCommandOutput(
        ctx,
        "No Antigravity credentials. Run /login agy first.",
        "warning",
      );
      return;
    }
    if (ctx.hasUI) ctx.ui.notify("Fetching Antigravity usage…", "info");
    const usage = await runWithDiagnostics(() => fetchAccountUsage(apiKey));
    emitCommandOutput(ctx, fn(usage));
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    emitCommandOutput(ctx, `Antigravity usage failed: ${redactSecrets(msg)}`, "warning");
  }
}

type CompatApiProviderRegistrar = (provider: {
  api: typeof ANTIGRAVITY_API;
  stream: typeof streamAntigravity;
  streamSimple: typeof streamAntigravity;
}) => void;

type CompatImagesProviderRegistrar = (provider: {
  api: typeof ANTIGRAVITY_IMAGE_API;
  generateImages: typeof generateAntigravityImages;
}) => void;

/**
 * Pi dispatches custom APIs through the compat registry. Oh My Pi does not
 * export `registerApiProvider` and registers the stream inside `registerProvider`.
 */
function registerCompatApiProvider(): void {
  const register = (piAiCompat as { registerApiProvider?: CompatApiProviderRegistrar })
    .registerApiProvider;
  if (typeof register === "function") {
    register({
      api: ANTIGRAVITY_API,
      stream: streamAntigravity,
      streamSimple: streamAntigravity,
    });
  }
  const registerImages = (
    piAiCompat as unknown as {
      registerImagesApiProvider?: CompatImagesProviderRegistrar;
    }
  ).registerImagesApiProvider;
  if (typeof registerImages === "function") {
    registerImages({
      api: ANTIGRAVITY_IMAGE_API,
      generateImages: generateAntigravityImages,
    });
  }
}

export default function (pi: ExtensionAPI): void {
  registerCompatApiProvider();

  // Refresh catalog on session start so dynamic models (Gemini 4 Argon, Claude 5.5)
  // are hydrated immediately.
  pi.on("session_start", async (_event, ctx) => {
    if (process.env.PI_OFFLINE !== undefined) return;
    if (typeof ctx.modelRegistry?.refresh !== "function") return;
    try {
      await ctx.modelRegistry.refresh({ providers: [PROVIDER_ID] });
    } catch {
      // Last-known-good catalog stays in place.
    }
  });

  const initialCatalog = getCurrentAntigravityCatalog();

  const providerConfig = {
    name: PROVIDER_NAME,
    baseUrl: DEFAULT_ENDPOINT,
    api: ANTIGRAVITY_API,
    models: [...initialCatalog.models, ...ANTIGRAVITY_IMAGE_MODELS],
    refreshModels: async (context: Parameters<typeof refreshAntigravityModels>[0]) => {
      const refreshed = await refreshAntigravityModels(context);
      return [...refreshed, ...ANTIGRAVITY_IMAGE_MODELS];
    },
    oauth: {
      name: PROVIDER_NAME,
      // Antigravity access is quota-backed by the Google account, not metered per token.
      // Pi stores credentials in ~/.pi/agent/auth.json under "agy", enabling both
      // `/login agy` and `/logout` natively.
      isSubscription: true,
      login: loginAntigravity,
      refreshToken: refreshAntigravityToken,
      getApiKey,
    },
    streamSimple: streamAntigravity,
    images: {
      [ANTIGRAVITY_IMAGE_API]: {
        generateImages: generateAntigravityImages,
      },
    },
  };

  pi.registerProvider(
    PROVIDER_ID,
    providerConfig as unknown as Parameters<typeof pi.registerProvider>[1],
  );

  // Usage handler
  const usageHandler = async (_args: string, ctx: ExtensionCommandContext) => {
    await withUsage(ctx, formatUsageSummary);
  };
  pi.registerCommand("agy-usage", {
    description: "Show Antigravity shared quota pools (Gemini / Claude+GPT, 5h + weekly)",
    handler: usageHandler,
  });

  // Doctor handler
  const doctorHandler = async (_args: string, ctx: ExtensionCommandContext) => {
    const d = getLastDiagnostics();
    const apiKey = await resolveApiKeyFromContext(ctx);
    let authState = "missing (run /login agy)";
    let configuredProject = "none";
    if (apiKey) {
      try {
        const parsed = parseApiKey(apiKey);
        authState = "authenticated (single-account OAuth)";
        configuredProject = parsed.projectId;
      } catch {
        authState = "invalid";
      }
    }
    const catalog = getCurrentAntigravityCatalog();
    const lines = [
      `provider=${PROVIDER_ID}`,
      `auth=${authState}`,
      `projectId=${d.projectId || configuredProject}`,
      `wireFingerprint=${defaultUserAgent()}`,
      `catalogModels=${catalog.models.map((m) => m.id).join(", ")}`,
      `lastResolvedRuntimeModel=${d.resolvedRuntimeModel || "none"}`,
      `availableModels=${d.availableModels || "none"}`,
      `matchedModel=${d.matchedModelDebug || "none"}`,
      `lastEndpoint=${d.endpoint || DEFAULT_ENDPOINT}`,
      `lastStatus=${d.status ?? "none"}`,
      ...(d.latencyMs !== undefined ? [`lastLatencyMs=${d.latencyMs}`] : []),
      `toolSchemaWarnings=${d.toolSchemaWarnings || "none"}`,
      `lastError=${d.error ? redactSecrets(d.error) : "none"}`,
      "transport=native-streamSimple (standalone, no agy.exe required)",
      "accountMode=single-account (/login agy, /logout)",
      "commands=/agy-doctor /agy-usage /generate",
    ];
    emitCommandOutput(ctx, `pi-agy doctor\n${lines.join("\n")}`);
  };
  pi.registerCommand("agy-doctor", {
    description: "Show sanitized Antigravity (pi-agy) provider diagnostics and health",
    handler: doctorHandler,
  });

  // Image generation handler (/generate)
  const imageHandler = async (args: string, ctx: ExtensionCommandContext) => {
    const parsed = parseImageCommandArgs(args || "");
    if (!parsed.prompt) {
      emitCommandOutput(
        ctx,
        "Usage: /generate [--ratio 16:9] [--model gemini-3.1-flash-image] [--path file.png] <prompt>",
        "warning",
      );
      return;
    }
    try {
      const apiKey = await resolveApiKeyFromContext(ctx);
      if (!apiKey) {
        emitCommandOutput(
          ctx,
          "No Antigravity credentials. Run /login agy first.",
          "warning",
        );
        return;
      }
      if (ctx.hasUI) ctx.ui.notify("Generating image via Antigravity…", "info");
      const result = await generateAntigravityImage({
        apiKey,
        cwd: ctx.cwd,
        prompt: parsed.prompt,
        aspectRatio: parsed.aspectRatio,
        model: parsed.model,
        path: parsed.path,
      });
      emitCommandOutput(ctx, `Saved image to ${result.savedPaths.join(", ")}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      emitCommandOutput(ctx, `Image generation failed: ${redactSecrets(msg)}`, "warning");
    }
  };
  pi.registerCommand("generate", {
    description:
      "Generate an image via Antigravity (usage: /generate [--ratio 16:9] <prompt>)",
    handler: imageHandler,
  });
}
