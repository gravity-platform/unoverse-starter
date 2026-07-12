# 02 — SDUI & MCP Apps

**UI is data. MCP is the transport. This is the standard — not one option among several.**

---

## 🏗️ The model in one picture

```
  YOU WRITE (data)                 THE PLATFORM PROVIDES (code)
┌──────────────────────┐        ┌─────────────────────────────────┐
│ rx/ definitions      │        │ SDK renderer (per platform)     │
│  components/ atoms/  │  MCP   │  web · Flutter · iOS · Android  │
│  orgs/<org>/         │ ─────► │  — dumb, generic, style-free    │
│    templates/ styles/│ stream │                                 │
└──────────────────────┘        │ Engine: workflows stream data   │
   JSON + tokens only           │ into your components            │
                                └─────────────────────────────────┘
```

- **You** author neutral JSON definitions and token files.
- **The SDK** on each platform renders them natively. It hardcodes **no feature, no style, no UI concept** — it resolves tokens and moves your state keys, nothing else.
- **The engine** runs workflows whose agents pick your components (by `whenToUse`) and stream data into them.

### Why SDUI

| Benefit | How you feel it |
|---|---|
| **Zero-release UI changes** | Edit a definition or a token → every channel updates on refresh. No app-store release, no rebuild per platform. |
| **One definition, every platform** | The same JSON renders as React on web and native views elsewhere. You never fork per platform. |
| **Agents can drive UI** | Because UI is data, a workflow/agent can select, stream, and update it at runtime — the whole point of the platform. |
| **Rebrand = data** | All styling is tokens; a theme swap touches `styles/` only ([06](./06-styles-and-tokens.md)). |
| **Provable dev loop** | Studio renders through the exact production path — what you preview is what ships ([07](./07-studio.md)). |

---

## 🧱 The closed primitive set

Definitions compose ONLY these. The set is frozen — adding to it is an SDK change, and a build-failing guard test enforces that.

| Group | Primitives |
|---|---|
| **Structure** | `Box`, `Stack`, `Row`, `Column`, `Each`, `Switch`, `ComponentSlot`, `Timeline` |
| **Leaves** | `Text`, `Image`, `Button`, `Input`, `Markdown`, `Skeleton`, `Icon` |
| **Helpers** | `Ref` (use an atom), `$include` (pull in a sibling file) |
| **Conditions** | `eq`, `ne`, `in`, truthy — used by `visibleWhen`, `Switch`, `style.when` |

❌ **Wrong instinct:** "I need a `Chart` / `Accordion` / `Carousel` primitive."
✅ **Right instinct:** compose it — bars are `Box` + `Each` over data; an accordion is `visibleWhen` on a dev-named state key. If it genuinely cannot be composed, that's a platform conversation, not a definition.

---

## 🔌 MCP Apps — the standard

**A template is an MCP App.** This is not an integration detail; it is the contract every client and every tool in the ecosystem shares:

| Concern | The MCP-standard answer |
|---|---|
| **How definitions reach clients** | Served as **MCP resources** (`unoverse://` URIs). Clients subscribe; `resources/updated` notifications ARE hot reload — in dev *and* prod. |
| **How the app binds to logic** | The template's `manifest.json` names its **workflow**. The app owns its workflow — clients pull the app; nothing is pushed by name. |
| **How a user message is sent** | `tools/call` on the app's trigger tool. Fire-and-forget — results come back over the component stream, never the call result. |
| **How a form/wizard answers** | Native MCP **elicitation** resolving the held `tools/call` — the agent is literally waiting on the user's answer. |
| **How UI state arrives** | Run-scoped messages (`COMPONENT_INIT/DATA`, `TEMPLATE_DATA`, `WORKFLOW_STATE`) on the MCP **`/stream`**. |
| **How themes arrive** | Served live as MCP resources (`unoverse://theme/<name>`) — never baked into an SDK bundle. |

**The rule:** a host must NEVER hand-roll its own transport — no bespoke REST send, no custom `user_action` message, no side-channel state push. The SDK owns the one interaction path; every consumer (Studio, a native app, an external MCP client) shares it. If your channel needs something the path doesn't do, that's a platform gap to raise — not a workaround to build.

### The two lanes (know which carries what)

| Lane | Carries | Scope |
|---|---|---|
| **MCP `/stream`** | components, template data, workflow lifecycle — everything that renders | **run-scoped** (this conversation, this app) |
| **SDK WebSocket** | audio frames (voice) + global cross-app state | global / native I/O |

Everything you author reads from the first lane. The second lane belongs to native **services** (like voice) — covered in [04 — State](./04-state.md), because it's where "locked" state comes from.

---

## 🔁 One path, dev and prod

Studio is **not a special harness**. It is just another MCP client: it subscribes to the same definition resources, receives the same component stream, and runs the same native renderers as production channels. That's why:

- "Works in Studio" provably means "works in production."
- Hot reload in Studio is the same `resources/subscribe` mechanism that live-updates production channels.
- Live mode in Studio is literally production, pointed at local renderers.

---

**Next:** coming from React or Flutter? Read the [02a translation table](./02a-coming-from-react.md) first. Then [03 — Components](./03-components.md) — composition, props, and reuse.
