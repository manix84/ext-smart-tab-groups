import type { SmartTabSettings } from "./types";

export const SETTINGS_KEY = "settings";

export const DEFAULT_SETTINGS: SmartTabSettings = {
  triggers: {
    "middle-click": "group",
    "modifier-click": "group",
    "target-blank": "group",
    script: "ignore",
    duplicate: "ignore",
    unknown: "ignore",
  },
  exceptions: {
    pinnedTabs: true,
    privateTabs: false,
    browserPages: true,
  },
  appearance: {
    naming: "origin-title",
    color: "blue",
    collapsed: false,
  },
};

export function mergeSettings(value?: Partial<SmartTabSettings>): SmartTabSettings {
  return {
    triggers: { ...DEFAULT_SETTINGS.triggers, ...value?.triggers },
    exceptions: { ...DEFAULT_SETTINGS.exceptions, ...value?.exceptions },
    appearance: { ...DEFAULT_SETTINGS.appearance, ...value?.appearance },
  };
}
