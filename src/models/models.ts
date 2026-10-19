import type { ProviderModelConfig } from "@earendil-works/pi-coding-agent";
import type { AntigravityRouting, ThinkingWire } from "../types/types.js";
import { ThinkingEffort } from "../types/enums.js";
import type { AntigravityCatalog } from "./grouping.js";

export const PROVIDER_ID = "agy";
export const PROVIDER_NAME = "agy";

/**
 * Public selectable model IDs → backend request model IDs by thinking effort.
 *
 * Catalog mirrors `agy models` v1.4.2 (cl=985595000), which advertises:
 * - Gemini 4 Argon (Low / Medium / High)
 * - Gemini 3.8 Flash (Low / Medium / High)
 * - Claude Opus 5.5 (Low / Medium / High)
 * - Claude Sonnet 5.5 (Low / Medium / High)
 * - GPT-OSS 120B (Medium)
 * - Plus fallback routing for Gemini 3.7/3.6/3.5 Flash, Gemini 3.1 Pro, Claude 4.6
 */
export const ANTIGRAVITY_ROUTING: Record<string, AntigravityRouting> = {
  "gemini-4-argon": {
    off: "gemini-4-argon-low",
    routing: {
      minimal: "gemini-4-argon-low",
      low: "gemini-4-argon-low",
      medium: "gemini-4-argon-medium",
      high: "gemini-4-argon-high",
      xhigh: "gemini-4-argon-high",
    },
    defaultRequestId: "gemini-4-argon-medium",
  },
  "gemini-3.8-flash": {
    off: "gemini-3.8-flash-low",
    routing: {
      minimal: "gemini-3.8-flash-low",
      low: "gemini-3.8-flash-low",
      medium: "gemini-3.8-flash-medium",
      high: "gemini-3.8-flash-high",
      xhigh: "gemini-3.8-flash-high",
    },
    defaultRequestId: "gemini-3.8-flash-low",
  },
  "claude-opus-5-5": {
    off: "claude-opus-5-5-low",
    routing: {
      minimal: "claude-opus-5-5-low",
      low: "claude-opus-5-5-low",
      medium: "claude-opus-5-5-medium",
      high: "claude-opus-5-5-high",
      xhigh: "claude-opus-5-5-high",
    },
    defaultRequestId: "claude-opus-5-5-medium",
  },
  "claude-sonnet-5-5": {
    off: "claude-sonnet-5-5-low",
    routing: {
      minimal: "claude-sonnet-5-5-low",
      low: "claude-sonnet-5-5-low",
      medium: "claude-sonnet-5-5-medium",
      high: "claude-sonnet-5-5-high",
      xhigh: "claude-sonnet-5-5-high",
    },
    defaultRequestId: "claude-sonnet-5-5-medium",
  },
  "gpt-oss-120b": {
    off: "gpt-oss-120b-medium",
    routing: {
      minimal: "gpt-oss-120b-medium",
      low: "gpt-oss-120b-medium",
      medium: "gpt-oss-120b-medium",
      high: "gpt-oss-120b-medium",
    },
    defaultRequestId: "gpt-oss-120b-medium",
  },
  "claude-opus-4-6": {
    routing: {
      minimal: "claude-opus-4-6-thinking",
      low: "claude-opus-4-6-thinking",
      medium: "claude-opus-4-6-thinking",
      high: "claude-opus-4-6-thinking",
    },
    defaultRequestId: "claude-opus-4-6-thinking",
  },
  "claude-sonnet-4-6": {
    off: "claude-sonnet-4-6",
    routing: {
      minimal: "claude-sonnet-4-6",
      low: "claude-sonnet-4-6",
      medium: "claude-sonnet-4-6",
      high: "claude-sonnet-4-6",
      xhigh: "claude-sonnet-4-6",
    },
    defaultRequestId: "claude-sonnet-4-6",
  },
  "gemini-3.1-pro": {
    off: "gemini-3.1-pro-low",
    routing: {
      minimal: "gemini-3.1-pro-low",
      low: "gemini-3.1-pro-low",
      medium: "gemini-3.1-pro-low",
      high: "gemini-pro-agent",
      xhigh: "gemini-pro-agent",
    },
    defaultRequestId: "gemini-3.1-pro-low",
  },
  "gemini-3.7-flash": {
    off: "gemini-3.7-flash-low",
    routing: {
      minimal: "gemini-3.7-flash-low",
      low: "gemini-3.7-flash-low",
      medium: "gemini-3.7-flash-medium",
      high: "gemini-3.7-flash-high",
      xhigh: "gemini-3.7-flash-high",
    },
    defaultRequestId: "gemini-3.7-flash-low",
  },
  "gemini-3.6-flash": {
    off: "gemini-3.6-flash-low",
    routing: {
      minimal: "gemini-3.6-flash-low",
      low: "gemini-3.6-flash-low",
      medium: "gemini-3.6-flash-medium",
      high: "gemini-3.6-flash-high",
      xhigh: "gemini-3.6-flash-high",
    },
    defaultRequestId: "gemini-3.6-flash-low",
  },
  "gemini-3.5-flash": {
    off: "gemini-3.5-flash-extra-low",
    routing: {
      minimal: "gemini-3.5-flash-extra-low",
      low: "gemini-3.5-flash-extra-low",
      medium: "gemini-3.5-flash-low",
      high: "gemini-3-flash-agent",
      xhigh: "gemini-3-flash-agent",
    },
    defaultRequestId: "gemini-3.5-flash-extra-low",
  },
};

/**
 * Verified maximum output tokens accepted by the Cloud Code Assist backend per model/runtime ID.
 */
export const RUNTIME_MAX_OUTPUT_TOKENS: Record<string, number> = {
  "gemini-4-argon": 65536,
  "gemini-4-argon-low": 65536,
  "gemini-4-argon-medium": 65536,
  "gemini-4-argon-high": 65536,
  "gemini-3.8-flash": 65536,
  "gemini-3.8-flash-low": 65536,
  "gemini-3.8-flash-medium": 65536,
  "gemini-3.8-flash-high": 65536,
  "gemini-3.7-flash": 65536,
  "gemini-3.7-flash-tiered": 65536,
  "gemini-3.7-flash-low": 65536,
  "gemini-3.7-flash-medium": 65536,
  "gemini-3.7-flash-high": 65536,
  "gemini-3.6-flash": 65536,
  "gemini-3.6-flash-low": 65536,
  "gemini-3.6-flash-medium": 65536,
  "gemini-3.6-flash-high": 65536,
  "gemini-3.5-flash": 65536,
  "gemini-3.5-flash-extra-low": 65536,
  "gemini-3.5-flash-low": 65536,
  "gemini-3-flash-agent": 65536,
  "gemini-3.1-pro": 65535,
  "gemini-3.1-pro-low": 65535,
  "gemini-3.1-pro-high": 65535,
  "gemini-pro-agent": 65535,
  "claude-opus-5-5": 128000,
  "claude-opus-5-5-low": 128000,
  "claude-opus-5-5-medium": 128000,
  "claude-opus-5-5-high": 128000,
  "claude-sonnet-5-5": 128000,
  "claude-sonnet-5-5-low": 128000,
  "claude-sonnet-5-5-medium": 128000,
  "claude-sonnet-5-5-high": 128000,
  "claude-opus-4-6": 64000,
  "claude-opus-4-6-thinking": 64000,
  "claude-sonnet-4-6": 64000,
  "gpt-oss-120b": 32768,
  "gpt-oss-120b-medium": 32768,
};

export function getMaxOutputTokens(modelId: string, runtimeModel?: string): number {
  const discovered = currentModels.find((model) => model.id === modelId);
  if (currentModels !== ANTIGRAVITY_MODELS && discovered) return discovered.maxTokens;
  if (runtimeModel && RUNTIME_MAX_OUTPUT_TOKENS[runtimeModel] !== undefined) {
    return RUNTIME_MAX_OUTPUT_TOKENS[runtimeModel];
  }
  if (RUNTIME_MAX_OUTPUT_TOKENS[modelId] !== undefined) {
    return RUNTIME_MAX_OUTPUT_TOKENS[modelId];
  }
  if (runtimeModel) {
    if (runtimeModel.startsWith("claude-opus-5-5") || runtimeModel.startsWith("claude-sonnet-5-5"))
      return 128000;
    if (runtimeModel.startsWith("claude-")) return 64000;
    if (runtimeModel.startsWith("gpt-oss-")) return 32768;
    if (runtimeModel.startsWith("gemini-3.1-pro") || runtimeModel === "gemini-pro-agent")
      return 65535;
    if (runtimeModel.startsWith("gemini-")) return 65536;
  }
  return 8192;
}

const geminiFlashCost = { input: 0.1, output: 0.4, cacheRead: 0.025, cacheWrite: 0.1 };
const geminiProCost = { input: 1.25, output: 5.0, cacheRead: 0.3125, cacheWrite: 1.25 };
const claudeSonnetCost = { input: 3.0, output: 15.0, cacheRead: 0.3, cacheWrite: 3.75 };
const claudeOpusCost = { input: 15.0, output: 75.0, cacheRead: 1.5, cacheWrite: 18.75 };
const gptOssCost = { input: 0.6, output: 2.4, cacheRead: 0.15, cacheWrite: 0.6 };

const thinkingLevelMaps = {
  lowMediumHigh: {
    off: null,
    minimal: null,
    low: "low",
    medium: "medium",
    high: "high",
    xhigh: null,
    max: null,
  },
  lowHigh: {
    off: null,
    minimal: null,
    low: "low",
    medium: null,
    high: "high",
    xhigh: null,
    max: null,
  },
  thinking: {
    off: null,
    minimal: null,
    low: null,
    medium: null,
    high: "high",
    xhigh: null,
    max: null,
  },
  medium: {
    off: null,
    minimal: null,
    low: null,
    medium: "medium",
    high: null,
    xhigh: null,
    max: null,
  },
} satisfies Record<string, ProviderModelConfig["thinkingLevelMap"]>;

/** Same set as `agy models` v1.4.2, collapsed to public Pi model IDs. */
export const ANTIGRAVITY_MODELS: ProviderModelConfig[] = [
  {
    id: "gemini-4-argon",
    name: "Gemini 4 Argon (agy)",
    reasoning: true,
    thinkingLevelMap: thinkingLevelMaps.lowMediumHigh,
    input: ["text", "image"],
    cost: geminiProCost,
    contextWindow: 1048576,
    maxTokens: 65536,
  },
  {
    id: "gemini-3.8-flash",
    name: "Gemini 3.8 Flash (agy)",
    reasoning: true,
    thinkingLevelMap: thinkingLevelMaps.lowMediumHigh,
    input: ["text", "image"],
    cost: geminiFlashCost,
    contextWindow: 1048576,
    maxTokens: 65536,
  },
  {
    id: "claude-opus-5-5",
    name: "Claude Opus 5.5 (agy)",
    reasoning: true,
    thinkingLevelMap: thinkingLevelMaps.lowMediumHigh,
    input: ["text", "image"],
    cost: claudeOpusCost,
    contextWindow: 1000000,
    maxTokens: 128000,
  },
  {
    id: "claude-sonnet-5-5",
    name: "Claude Sonnet 5.5 (agy)",
    reasoning: true,
    thinkingLevelMap: thinkingLevelMaps.lowMediumHigh,
    input: ["text", "image"],
    cost: claudeSonnetCost,
    contextWindow: 1000000,
    maxTokens: 128000,
  },
  {
    id: "gpt-oss-120b",
    name: "GPT-OSS 120B (agy)",
    reasoning: true,
    thinkingLevelMap: thinkingLevelMaps.medium,
    input: ["text"],
    cost: gptOssCost,
    contextWindow: 131072,
    maxTokens: 32768,
  },
];

let currentModels: ProviderModelConfig[] = ANTIGRAVITY_MODELS;
let currentRouting: Record<string, AntigravityRouting> = { ...ANTIGRAVITY_ROUTING };

export function getCurrentAntigravityModels(): ProviderModelConfig[] {
  return currentModels;
}

export function getCurrentAntigravityRouting(): Record<string, AntigravityRouting> {
  return currentRouting;
}

export function getCurrentAntigravityCatalog(): AntigravityCatalog {
  return { models: currentModels, routing: currentRouting };
}

export function applyAntigravityCatalog(catalog: AntigravityCatalog): void {
  currentModels = catalog.models;
  currentRouting = catalog.routing;
}

export function resetAntigravityCatalogForTests(): void {
  currentModels = ANTIGRAVITY_MODELS;
  currentRouting = { ...ANTIGRAVITY_ROUTING };
}

/** Resolve public model id + thinking effort to Antigravity runtime model id. */
export function getAntigravityRequestModelId(modelId: string, effort: string | undefined): string {
  const r = currentRouting[modelId] ?? ANTIGRAVITY_ROUTING[modelId];
  if (!r) return modelId;

  if (effort === undefined || effort === "off") {
    return r.off ?? r.routing?.minimal ?? r.routing?.low ?? r.defaultRequestId ?? modelId;
  }

  const effortKey = effort as ThinkingEffort;
  if (effortKey === ThinkingEffort.Xhigh) {
    return (
      r.routing?.xhigh ??
      r.routing?.high ??
      r.routing?.low ??
      r.routing?.minimal ??
      r.off ??
      r.defaultRequestId ??
      modelId
    );
  }

  return (
    r.routing?.[effortKey] ??
    r.routing?.low ??
    r.routing?.minimal ??
    r.off ??
    r.defaultRequestId ??
    modelId
  );
}

/**
 * If a next-gen model (e.g. Gemini 3.8 Flash) is not yet available on the backend,
 * provide a fallback runtime model ID (e.g. Gemini 3.7 Flash) to maintain availability.
 */
export function getFallbackRuntimeModel(runtimeModel: string, effort?: string): string | undefined {
  if (runtimeModel.startsWith("gemini-3.8-flash-")) {
    return runtimeModel.replace("gemini-3.8-flash-", "gemini-3.7-flash-");
  }
  if (runtimeModel === "gemini-3.8-flash") {
    return "gemini-3.7-flash-low";
  }
  if (runtimeModel === "gemini-3.7-flash-tiered") {
    return getAntigravityRequestModelId("gemini-3.6-flash", effort);
  }
  if (runtimeModel.startsWith("gemini-3.7-flash-")) {
    return runtimeModel.replace("gemini-3.7-flash-", "gemini-3.6-flash-");
  }
  if (runtimeModel === "gemini-3.7-flash") {
    return "gemini-3.6-flash-low";
  }
  return undefined;
}

export type { ThinkingWire };

export const ANTIGRAVITY_MODEL_ENUM: Record<string, string> = {
  // Gemini 4 Argon
  "gemini-4-argon": "MODEL_PLACEHOLDER_M418",
  "gemini-4-argon-high": "MODEL_PLACEHOLDER_M417",
  "gemini-4-argon-medium": "MODEL_PLACEHOLDER_M418",
  "gemini-4-argon-low": "MODEL_PLACEHOLDER_M419",
  // Gemini 3.8 Flash
  "gemini-3.8-flash": "MODEL_PLACEHOLDER_M318",
  "gemini-3.8-flash-high": "MODEL_PLACEHOLDER_M318",
  "gemini-3.8-flash-medium": "MODEL_PLACEHOLDER_M319",
  "gemini-3.8-flash-low": "MODEL_PLACEHOLDER_M320",
  "gemini-3.8-flash-tiered": "MODEL_PLACEHOLDER_M322",
  // Claude 5.5
  "claude-opus-5-5": "MODEL_PLACEHOLDER_M401",
  "claude-opus-5-5-low": "MODEL_PLACEHOLDER_M400",
  "claude-opus-5-5-medium": "MODEL_PLACEHOLDER_M401",
  "claude-opus-5-5-high": "MODEL_PLACEHOLDER_M402",
  "claude-sonnet-5-5": "MODEL_PLACEHOLDER_M404",
  "claude-sonnet-5-5-low": "MODEL_PLACEHOLDER_M403",
  "claude-sonnet-5-5-medium": "MODEL_PLACEHOLDER_M404",
  "claude-sonnet-5-5-high": "MODEL_PLACEHOLDER_M405",
  // Gemini 3.7 Flash
  "gemini-3.7-flash": "MODEL_PLACEHOLDER_M298",
  "gemini-3.7-flash-high": "MODEL_PLACEHOLDER_M298",
  "gemini-3.7-flash-medium": "MODEL_PLACEHOLDER_M299",
  "gemini-3.7-flash-low": "MODEL_PLACEHOLDER_M300",
  "gemini-3.7-flash-tiered": "MODEL_PLACEHOLDER_M301",
  // Gemini 3.6 Flash
  "gemini-3.6-flash": "MODEL_PLACEHOLDER_M71",
  "gemini-3.6-flash-high": "MODEL_PLACEHOLDER_M71",
  "gemini-3.6-flash-medium": "MODEL_PLACEHOLDER_M72",
  "gemini-3.6-flash-low": "MODEL_PLACEHOLDER_M73",
  "gemini-3.6-flash-tiered": "MODEL_PLACEHOLDER_M196",
  // Gemini 3.5 Flash
  "gemini-3.5-flash": "MODEL_PLACEHOLDER_M20",
  "gemini-3.5-flash-extra-low": "MODEL_PLACEHOLDER_M187",
  "gemini-3.5-flash-low": "MODEL_PLACEHOLDER_M20",
  "gemini-3-flash-agent": "MODEL_PLACEHOLDER_M84",
  // Gemini 3.1 Pro
  "gemini-3.1-pro": "MODEL_PLACEHOLDER_M36",
  "gemini-3.1-pro-low": "MODEL_PLACEHOLDER_M36",
  "gemini-3.1-pro-high": "MODEL_PLACEHOLDER_M37",
  "gemini-pro-agent": "MODEL_PLACEHOLDER_M16",
  // Claude 4.6
  "claude-sonnet-4-6": "MODEL_PLACEHOLDER_M35",
  "claude-opus-4-6": "MODEL_PLACEHOLDER_M26",
  "claude-opus-4-6-thinking": "MODEL_PLACEHOLDER_M26",
  // GPT-OSS
  "gpt-oss-120b": "MODEL_OPENAI_GPT_OSS_120B_MEDIUM",
  "gpt-oss-120b-medium": "MODEL_OPENAI_GPT_OSS_120B_MEDIUM",
};

const modelEnumCache = new Map<string, string>();

/** Register dynamically discovered model enum (e.g. from fetchAvailableModels). */
export function registerModelEnum(wireModelId: string, modelEnum: string): void {
  if (wireModelId && modelEnum) {
    modelEnumCache.set(wireModelId, modelEnum);
  }
}

/** Register batch of discovered model enums from fetchAvailableModels raw models dictionary. */
export function registerDiscoveredModelEnums(
  models: Record<string, { model?: unknown }> | undefined,
): void {
  if (!models) return;
  for (const [wireId, info] of Object.entries(models)) {
    if (typeof info?.model === "string" && info.model) {
      modelEnumCache.set(wireId, info.model);
    }
  }
}

/** Get model_enum label for a given wire model id (dynamic cache first, then static fallback). */
export function getModelEnum(wireModelId: string): string | undefined {
  const direct = modelEnumCache.get(wireModelId) || ANTIGRAVITY_MODEL_ENUM[wireModelId];
  if (direct) return direct;

  const routed = getAntigravityRequestModelId(wireModelId, undefined);
  return modelEnumCache.get(routed) || ANTIGRAVITY_MODEL_ENUM[routed];
}

/** Return a serializable snapshot of model enums learned from discovery. */
export function snapshotDynamicModelEnums(): Record<string, string> {
  return Object.fromEntries(modelEnumCache);
}

/** Replace dynamically learned model enums with a previously persisted snapshot. */
export function restoreDynamicModelEnums(modelEnums: Record<string, string>): void {
  modelEnumCache.clear();
  for (const [wireModelId, modelEnum] of Object.entries(modelEnums)) {
    if (wireModelId && modelEnum) modelEnumCache.set(wireModelId, modelEnum);
  }
}

export function clearModelEnumCache(): void {
  modelEnumCache.clear();
}

export function getThinkingConfig(
  modelId: string,
  effort: string | undefined,
): ThinkingWire | undefined {
  if (modelId.startsWith("claude-")) {
    if (!effort || effort === "off") return { includeThoughts: false, thinkingBudget: 0 };
    const thinkingBudget =
      effort === "high" || effort === "xhigh" ? 16_000 : effort === "medium" ? 4_096 : 1_024;
    return { includeThoughts: true, thinkingBudget };
  }
  if (modelId.startsWith("gpt-oss-")) {
    if (!effort || effort === "off") return { includeThoughts: false, thinkingBudget: 0 };
    return { includeThoughts: true, thinkingBudget: 8192 };
  }
  if (modelId.startsWith("gemini-3.5-flash") || modelId === "gemini-3-flash-agent") {
    if (!effort || effort === "off") return { includeThoughts: false, thinkingBudget: 0 };
    const thinkingBudget =
      effort === "high" || effort === "xhigh" ? 10_000 : effort === "medium" ? 4_000 : 1_000;
    return { includeThoughts: true, thinkingBudget };
  }
  if (modelId.startsWith("gemini-3.1-pro") || modelId === "gemini-pro-agent") {
    if (!effort || effort === "off") return { includeThoughts: false, thinkingBudget: 0 };
    return {
      includeThoughts: true,
      thinkingBudget: effort === "high" || effort === "xhigh" ? 10_001 : 1_001,
    };
  }
  // Gemini 4 Argon rejects thinkingBudget 0 and any budget under 1000 (#93).
  if (modelId.includes("argon") || modelId.startsWith("gemini-4")) {
    if (!effort || effort === "off") return undefined;
    const thinkingBudget =
      effort === "high" || effort === "xhigh" ? -1 : effort === "medium" ? 4_000 : 1_000;
    return { includeThoughts: true, thinkingBudget };
  }
  if (modelId.startsWith("gemini-")) {
    if (!effort || effort === "off") return { includeThoughts: false, thinkingBudget: 0 };
    const thinkingBudget =
      effort === "high" || effort === "xhigh" ? -1 : effort === "medium" ? 4_000 : 1_000;
    return { includeThoughts: true, thinkingBudget };
  }
  return undefined;
}
