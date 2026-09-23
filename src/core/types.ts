export type OpenCause =
  "middle-click" | "modifier-click" | "target-blank" | "script" | "duplicate" | "unknown";

export type TriggerAction = "group" | "inherit-only" | "ignore";
export type NamingStrategy = "origin-title" | "origin-domain" | "manual";
export type GroupColor =
  "blue" | "cyan" | "green" | "grey" | "orange" | "pink" | "purple" | "red" | "yellow";

export interface SmartTabSettings {
  triggers: Record<OpenCause, TriggerAction>;
  exceptions: {
    pinnedTabs: boolean;
    privateTabs: boolean;
    browserPages: boolean;
  };
  appearance: {
    naming: NamingStrategy;
    color: GroupColor;
    collapsed: boolean;
  };
}

export interface OpenIntent {
  cause: OpenCause;
  href: string;
  timestamp: number;
}

export interface GroupingContext {
  cause: OpenCause;
  parentGrouped: boolean;
  parentPinned: boolean;
  childPinned: boolean;
  incognito: boolean;
  parentUrl?: string;
  childUrl?: string;
}

export type GroupingDecision = "create" | "inherit" | "ignore";

export interface InteractionMessage {
  type: "smart-tab-groups:open-intent";
  intent: OpenIntent;
}
