import type { GroupingContext, GroupingDecision, SmartTabSettings } from "./types";

const BROWSER_SCHEMES = ["about:", "chrome:", "edge:", "moz-extension:", "chrome-extension:"];

export function isBrowserPage(url?: string): boolean {
  return Boolean(url && BROWSER_SCHEMES.some((scheme) => url.startsWith(scheme)));
}

export function decideGrouping(
  context: GroupingContext,
  settings: SmartTabSettings,
): GroupingDecision {
  if (settings.exceptions.pinnedTabs && (context.parentPinned || context.childPinned)) {
    return "ignore";
  }
  if (settings.exceptions.privateTabs && context.incognito) return "ignore";
  if (
    settings.exceptions.browserPages &&
    (isBrowserPage(context.parentUrl) || isBrowserPage(context.childUrl))
  ) {
    return "ignore";
  }

  const action = settings.triggers[context.cause];
  if (action === "ignore") return "ignore";
  if (context.parentGrouped) return "inherit";
  return action === "group" ? "create" : "ignore";
}

export function groupTitle(
  title: string | undefined,
  url: string | undefined,
  settings: SmartTabSettings,
) {
  if (settings.appearance.naming === "manual") return "";
  if (settings.appearance.naming === "origin-domain" && url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return "Related tabs";
    }
  }
  const cleaned = title?.trim();
  return cleaned ? cleaned.slice(0, 48) : "Related tabs";
}
