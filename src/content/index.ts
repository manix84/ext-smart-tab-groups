import browser from "webextension-polyfill";
import type { InteractionMessage, OpenCause } from "../core/types";

function linkFromEvent(event: MouseEvent): HTMLAnchorElement | null {
  const target = event.composedPath().find((node) => node instanceof HTMLAnchorElement);
  return target instanceof HTMLAnchorElement && target.href ? target : null;
}

function report(link: HTMLAnchorElement, cause: OpenCause): void {
  const message: InteractionMessage = {
    type: "smart-tab-groups:open-intent",
    intent: { cause, href: link.href, timestamp: Date.now() },
  };
  void browser.runtime.sendMessage(message).catch(() => undefined);
}

document.addEventListener(
  "auxclick",
  (event) => {
    if (event.button !== 1) return;
    const link = linkFromEvent(event);
    if (link) report(link, "middle-click");
  },
  { capture: true },
);

document.addEventListener(
  "click",
  (event) => {
    const link = linkFromEvent(event);
    if (!link) return;
    if (event.ctrlKey || event.metaKey) report(link, "modifier-click");
    else if (link.target.toLowerCase() === "_blank") report(link, "target-blank");
  },
  { capture: true },
);
