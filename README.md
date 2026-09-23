# Smart Tab Groups

Smart Tab Groups is a privacy-first browser extension that keeps related work together by remembering **how tabs are opened**, not merely which sites they show.

The initial Firefox-first MVP does three things:

- middle-click, Ctrl/Cmd-click, or open a `target="_blank"` link from an ungrouped tab to group the parent and child;
- open a matching link from an existing group to add the child to that group;
- leave pinned tabs, browser pages, and uncertain opening methods alone by default.

Chrome compatibility is part of the architecture from the beginning. The extension uses Manifest V3, a shared standards-based core, a dual browser background declaration, and feature detection around native tab-group APIs.

## Status

This project is an early, functional prototype. It needs browser-level integration testing before it is ready for an extension store.

## Development

Requirements: Node.js 22 or newer and npm 12 or newer.

```sh
npm install
npm run check
```

The production extension is written to `dist/`. In Firefox, open `about:debugging`, choose **This Firefox**, then load `dist/manifest.json` as a temporary add-on. In Chrome, open `chrome://extensions`, enable developer mode, and load the unpacked `dist/` directory.

## Design principles

- **Lineage over URL:** an investigation can cross domains and still be one piece of work.
- **Conservative automation:** unknown tab origins remain untouched unless the user opts in.
- **Manual choices win:** pinned tabs and user-created groups are respected.
- **Local and private:** browsing data is evaluated in the browser and is not sent anywhere.
- **Cross-browser core:** browser differences live at the edge of the system, not in the rules engine.

## Roadmap

- browser-driven Firefox and Chrome integration tests;
- per-domain rules and configurable exceptions;
- context-menu, duplicate-tab, bookmark, and script-open detection;
- durable tab-lineage metadata across extension background restarts;
- optional permissions for advanced URL-aware rules;
- accessible onboarding and import/export of settings.

See [CONTRIBUTING.md](CONTRIBUTING.md) before proposing changes. Security issues should follow [SECURITY.md](SECURITY.md), and data handling is documented in [PRIVACY.md](PRIVACY.md).

## License

[MIT](LICENSE) © 2026 Rob Taylor.
