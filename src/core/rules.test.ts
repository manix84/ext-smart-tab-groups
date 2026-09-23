import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS } from "./settings";
import { decideGrouping, groupTitle, isBrowserPage } from "./rules";

const base = {
  cause: "middle-click" as const,
  parentGrouped: false,
  parentPinned: false,
  childPinned: false,
  incognito: false,
  parentUrl: "https://example.com/start",
  childUrl: "https://example.com/detail",
};

describe("decideGrouping", () => {
  it("creates a group for a configured trigger", () => {
    expect(decideGrouping(base, DEFAULT_SETTINGS)).toBe("create");
  });

  it("inherits an existing parent group", () => {
    expect(decideGrouping({ ...base, parentGrouped: true }, DEFAULT_SETTINGS)).toBe("inherit");
  });

  it("does not guess for unknown opens", () => {
    expect(decideGrouping({ ...base, cause: "unknown" }, DEFAULT_SETTINGS)).toBe("ignore");
  });

  it("respects pinned-tab exceptions", () => {
    expect(decideGrouping({ ...base, parentPinned: true }, DEFAULT_SETTINGS)).toBe("ignore");
  });
});

describe("browser page detection", () => {
  it.each(["about:addons", "chrome://settings", "edge://settings", "moz-extension://id/"])(
    "recognises %s",
    (url) => expect(isBrowserPage(url)).toBe(true),
  );
});

describe("groupTitle", () => {
  it("uses the origin title by default", () => {
    expect(groupTitle("A useful page", base.parentUrl, DEFAULT_SETTINGS)).toBe("A useful page");
  });

  it("can derive a domain without www", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      appearance: { ...DEFAULT_SETTINGS.appearance, naming: "origin-domain" as const },
    };
    expect(groupTitle("Ignored", "https://www.example.com/path", settings)).toBe("example.com");
  });
});
