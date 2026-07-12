# 07 — Studio

**View and test your work — mock states in isolation, or live against the real platform, on every channel at once.**

Studio (the Unoverse workbench) is to Unoverse what Storybook is to React — but cross-platform, streaming, and connectable to the live agent backend. It is served by the running platform; nothing extra to install.

---

## 🖥️ What you get

```
┌────────────────────────────────────────────────────────────────┐
│  STUDIO                                      [ Mock | ● Live ] │
│ ┌──────────────────┐  ┌──────────────────────────────────────┐ │
│ │ DEFINITIONS      │  │ NATIVE PREVIEW — per channel          │ │
│ │  components/…    │  │  edit the definition ⇒ preview        │ │
│ │  templates/…     │  │  updates live (MCP resource subscribe)│ │
│ │  [props / states]│  │                                       │ │
│ └──────────────────┘  └──────────────────────────────────────┘ │
│  DEVTOOLS: state inspector · component stream log               │
└────────────────────────────────────────────────────────────────┘
```

Because Studio is **just another MCP client** — same SDK, same definition resources, same component stream as production — what you see is what ships ([02](./02-sdui-and-mcp-apps.md)). Hot reload isn't a dev trick: it's the same `resources/subscribe → updated` mechanism that live-updates production channels.

---

## 🧪 Mode A — Mock (isolation)

Render a component or template with **mock data and mock history**, no backend logic involved. This is your daily loop while designing.

### Mock data = prop defaults. The state picker = the `states/` folder.

Two mechanisms, zero hand-maintained fixtures:

1. **Prop `default`s are the mock data.** Studio renders every definition from its declared defaults — which is why defaults should be realistic content, not empty strings.
2. **The `states/` folder IS the state picker.** Every layer file a definition enumerates (`states/welcome.json`, `states/focus.json`, `states/summary.json`, …) automatically becomes a pill in Studio — no registration, no fixture file. Clicking a pill activates the state **by its own selector** (the file's `visibleWhen`): `"isEmpty"` leaves the store pristine (the welcome layer), `"hasMessages"` seeds a mock conversation, `{ "field": "defaultState", "eq": "focus" }` sets that key in template state — and the matching layer draws itself. Pills follow the root's `$include` order.

So "viewable states" is not extra work — it falls straight out of organizing a definition into layers ([03](./03-components.md)): the folder that structures your `Switch` cases is the same folder Studio reads. Use the picker to exercise every discriminant value (each wizard `step`, `inline/focused`, each `callState` phase), and vary prop defaults to check edge data (empty lists, long text — how you catch a `bind` without a default).

**Apps show their widget's states too.** Selecting an app template (a single-widget shell) also lists its **seeded component's** states as pills — a wizard's steps are one click each, activated by writing the widget's `Switch` discriminant into its slice, exactly what its own buttons do.

---

## 🔴 Mode B — Live (the proof)

Flip the toggle and Studio connects **as an MCP client to your real running platform**. Real workflows stream real components, select real templates, deliver real data — into the local preview. You are watching production behavior before shipping.

Use Live mode to verify the things mock can't:

- your component's **node** receives and merges streamed `COMPONENT_DATA` correctly,
- the **template selection** picks your app for the intents you wrote `whenToUse` for,
- **focus flow**: the widget streams in, `defaultState: "focus"` opens the template's surface, close returns cleanly,
- **turn lifecycle**: thinking indicators derived from `isStreaming` appear and — critically — clear.

---

## 🔬 DevTools — when something looks wrong

| Tool | Shows | Use it when |
|---|---|---|
| **State inspector** | the three buckets live — each component slice, template state, the timeline | "my `visibleWhen` never fires" → look at the actual key/value; it's usually a key-name or bucket mismatch |
| **Component stream log** | every `COMPONENT_INIT` / `COMPONENT_DATA` / `TEMPLATE_DATA` / `WORKFLOW_STATE` with timing | "data isn't arriving" vs "data arrives but my bind is wrong" — this log settles it in seconds |

Debugging order, always: **stream log** (did it arrive?) → **state inspector** (is it in the bucket I read?) → the definition (is my bind/condition right?). Never start by editing the definition on a guess — see the data first.

---

## 🔁 The full loop

```bash
vi rx/components/pricecard/pricecard.json   # 1. edit (schema validates as you type)
./unoverse gendesign                         # 2. regenerate nodes + restart
# 3. Studio: mock states → looks right
# 4. Studio: live mode → streams right
```

For pure definition edits, the resource subscription refreshes the preview without a full regen; `gendesign` is required when the component's **node** must change (new props, new component, meta changes).

---

**Next:** [08 — Validate & Ship](./08-validate-and-ship.md).
