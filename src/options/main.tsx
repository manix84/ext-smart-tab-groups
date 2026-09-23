import React from "react";
import ReactDOM from "react-dom/client";
import browser from "webextension-polyfill";
import { DEFAULT_SETTINGS, mergeSettings, SETTINGS_KEY } from "../core/settings";
import type {
  GroupColor,
  NamingStrategy,
  OpenCause,
  SmartTabSettings,
  TriggerAction,
} from "../core/types";
import "./styles.css";

const triggerLabels: Record<OpenCause, string> = {
  "middle-click": "Middle-clicked links",
  "modifier-click": "Ctrl/Cmd-clicked links",
  "target-blank": "Links that request a new tab",
  script: "Tabs opened by page scripts",
  duplicate: "Duplicated tabs",
  unknown: "Unknown opening method",
};

export function App() {
  const [settings, setSettings] = React.useState<SmartTabSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    void browser.storage.sync.get(SETTINGS_KEY).then((stored) => {
      setSettings(mergeSettings(stored[SETTINGS_KEY] as Partial<SmartTabSettings> | undefined));
      setReady(true);
    });
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    await browser.storage.sync.set({ [SETTINGS_KEY]: settings });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1_500);
  }

  function setTrigger(cause: OpenCause, action: TriggerAction) {
    setSettings((current) => ({
      ...current,
      triggers: { ...current.triggers, [cause]: action },
    }));
  }

  if (!ready) return <main className="shell">Loading settings…</main>;

  return (
    <main className="shell">
      <header>
        <p className="eyebrow">SMART TAB GROUPS</p>
        <h1>Keep related work together.</h1>
        <p className="intro">
          New tabs can follow the tab they came from. Choose when Smart Tab Groups should create,
          inherit, or leave groups alone.
        </p>
      </header>

      <form onSubmit={save}>
        <section>
          <div className="section-heading">
            <span>01</span>
            <div>
              <h2>Opening rules</h2>
              <p>
                Unknown opens stay untouched by default so the extension never makes a wild guess.
              </p>
            </div>
          </div>
          <div className="rule-list">
            {(Object.keys(triggerLabels) as OpenCause[]).map((cause) => (
              <label className="rule" key={cause}>
                <span>{triggerLabels[cause]}</span>
                <select
                  value={settings.triggers[cause]}
                  onChange={(event) => setTrigger(cause, event.target.value as TriggerAction)}
                >
                  <option value="group">Create or inherit group</option>
                  <option value="inherit-only">Only inherit existing group</option>
                  <option value="ignore">Leave ungrouped</option>
                </select>
              </label>
            ))}
          </div>
        </section>

        <section>
          <div className="section-heading">
            <span>02</span>
            <div>
              <h2>Boundaries</h2>
              <p>Protect tabs where automatic movement would be surprising.</p>
            </div>
          </div>
          <div className="checks">
            {(
              [
                ["pinnedTabs", "Never group pinned tabs"],
                ["browserPages", "Never group browser and extension pages"],
                ["privateTabs", "Disable grouping in private windows"],
              ] as const
            ).map(([key, label]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={settings.exceptions[key]}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      exceptions: { ...current.exceptions, [key]: event.target.checked },
                    }))
                  }
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </section>

        <section>
          <div className="section-heading">
            <span>03</span>
            <div>
              <h2>New group appearance</h2>
              <p>Applied only when Smart Tab Groups creates a group, not to groups you made.</p>
            </div>
          </div>
          <div className="grid">
            <label>
              <span>Name groups from</span>
              <select
                value={settings.appearance.naming}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    appearance: {
                      ...current.appearance,
                      naming: event.target.value as NamingStrategy,
                    },
                  }))
                }
              >
                <option value="origin-title">Origin tab title</option>
                <option value="origin-domain">Origin domain</option>
                <option value="manual">Leave unnamed</option>
              </select>
            </label>
            <label>
              <span>Colour</span>
              <select
                value={settings.appearance.color}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    appearance: {
                      ...current.appearance,
                      color: event.target.value as GroupColor,
                    },
                  }))
                }
              >
                {(
                  [
                    "blue",
                    "cyan",
                    "green",
                    "grey",
                    "orange",
                    "pink",
                    "purple",
                    "red",
                    "yellow",
                  ] as const
                ).map((color) => (
                  <option value={color} key={color}>
                    {color[0].toUpperCase() + color.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className="inline-check">
              <input
                type="checkbox"
                checked={settings.appearance.collapsed}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    appearance: { ...current.appearance, collapsed: event.target.checked },
                  }))
                }
              />
              <span>Start new groups collapsed</span>
            </label>
          </div>
        </section>

        <footer>
          <p aria-live="polite">
            {saved ? "Settings saved." : "Settings sync with your browser profile."}
          </p>
          <button type="submit">Save settings</button>
        </footer>
      </form>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
