import browser from "webextension-polyfill";
import { decideGrouping, groupTitle } from "../core/rules";
import { DEFAULT_SETTINGS, mergeSettings, SETTINGS_KEY } from "../core/settings";
import type { InteractionMessage, OpenCause, OpenIntent, SmartTabSettings } from "../core/types";

const NONE = -1;
const INTENT_TTL_MS = 2_000;
const pendingIntents = new Map<number, OpenIntent>();

async function getSettings(): Promise<SmartTabSettings> {
  const stored = await browser.storage.sync.get(SETTINGS_KEY);
  return mergeSettings(stored[SETTINGS_KEY] as Partial<SmartTabSettings> | undefined);
}

function comparableUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    url.hash = "";
    return url.href;
  } catch {
    return value;
  }
}

function consumeIntent(openerId: number, childUrl?: string): OpenCause {
  const intent = pendingIntents.get(openerId);
  pendingIntents.delete(openerId);
  if (!intent || Date.now() - intent.timestamp > INTENT_TTL_MS) return "unknown";
  return comparableUrl(intent.href) === comparableUrl(childUrl) ? intent.cause : "unknown";
}

browser.runtime.onMessage.addListener((message: unknown, sender: browser.Runtime.MessageSender) => {
  const candidate = message as Partial<InteractionMessage>;
  if (
    candidate.type === "smart-tab-groups:open-intent" &&
    candidate.intent &&
    sender.tab?.id !== undefined
  ) {
    pendingIntents.set(sender.tab.id, candidate.intent);
  }
});

browser.tabs.onCreated.addListener((child) => {
  void handleCreatedTab(child);
});

async function handleCreatedTab(child: browser.Tabs.Tab): Promise<void> {
  if (child.id === undefined || child.openerTabId === undefined) return;

  try {
    const parent = await browser.tabs.get(child.openerTabId);
    const settings = await getSettings();
    const cause = consumeIntent(parent.id!, child.pendingUrl ?? child.url);
    const decision = decideGrouping(
      {
        cause,
        parentGrouped: (parent.groupId ?? NONE) !== NONE,
        parentPinned: parent.pinned,
        childPinned: child.pinned,
        incognito: parent.incognito || child.incognito,
        parentUrl: parent.url,
        childUrl: child.pendingUrl ?? child.url,
      },
      settings,
    );

    if (decision === "ignore") return;
    const groupId =
      decision === "inherit"
        ? await browser.tabs.group({ groupId: parent.groupId!, tabIds: child.id })
        : await browser.tabs.group({ tabIds: [parent.id!, child.id] });

    if (decision === "create") {
      await browser.tabGroups.update(groupId, {
        title: groupTitle(parent.title, parent.url, settings),
        color: settings.appearance.color,
        collapsed: settings.appearance.collapsed,
      });
    }
  } catch (error) {
    console.warn("Smart Tab Groups could not process a new tab", error);
  }
}

browser.action.onClicked.addListener(() => browser.runtime.openOptionsPage());

browser.runtime.onInstalled.addListener(async () => {
  const stored = await browser.storage.sync.get(SETTINGS_KEY);
  if (!stored[SETTINGS_KEY]) await browser.storage.sync.set({ [SETTINGS_KEY]: DEFAULT_SETTINGS });
});
