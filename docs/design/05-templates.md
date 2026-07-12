# 05 — Templates (MCP Apps)

**A template is a whole surface — and a deployable MCP App that owns its workflow.**

Components render pieces of data. A **template** is the shell around them: the chat layout, the voice surface, the dashboard. It is org-scoped, swappable at runtime (the conversation stays put — state lives in the store, not the template), and it ships as an **MCP App**.

---

## 📁 Layout & the manifest

```
rx/orgs/<org>/templates/chatlayout/
├── chatlayout.json     # the template definition (envelope, kind: "template")
├── manifest.json       # the APP binding — workflow, defaultState, autoTrigger
├── states/             # earned extractions
└── blocks/
```

`manifest.json` is what makes the template an **app**:

```jsonc
{
  "name": "Trip Booker",
  "description": "A guided trip booking assessment.",
  "whenToUse": "Book, change or cancel a trip — a guided flow that recommends the best option.",
  "category": "Travel",
  "version": "1.0.0",
  "defaultState": "focus",            // the named state the app LOADS in — an OPEN name: "template" (fluid surface) · "focus" (takeover) · "component" (inline card) · or your own
  "inputSchema": {
    "type": "object",
    "properties": { "message": { "type": "string", "description": "The user's request" } }
  },
  "binding": { "workflow": "wf-xxxxxx", "trigger": "inputtrigger1" },   // the app OWNS this binding
  "autoTrigger": true,
  "expose": { "openaiApps": false },
  "previewComponents": ["BookingWizard"]
}
```

This is the MCP-apps standard in practice ([02](./02-sdui-and-mcp-apps.md)): clients **pull** the app (definition + manifest) as MCP resources; nothing pushes UI by workflow name. Sending a user message = `tools/call` on the app's trigger tool; a wizard's answers = a native elicitation resolving the held call. The channel never invents transport.

---

## 🧩 Template-only primitives

### `Timeline` — the conversation

Renders the turn history (user + assistant messages, streamed answer text, the transcript in voice apps). The conversation bucket is locked to the stream ([04](./04-state.md)) — `Timeline` just projects it.

### `ComponentSlot` — where streamed components land

```jsonc
{ "type": "ComponentSlot", "select": {} }
```

Rules that bite:

- ✅ **One generic `select: {}`** in the flow of conversation — components arrive with their own natural size and the slot just hosts them.
- ❌ **Never type-filter slots by component name** ("prose here, ProductCard there") — hardcoded type rules are brittle and forbidden. A component that needs to be wide declares that in **its own definition**.
- ⚠️ **Global slots (`from: "all"`) select oldest-first.** An untyped global slot shows the conversation's *first-ever* component forever. If you use a global slot (e.g. a focus panel), **pin its `type`**.

---

## 🔍 `defaultState` — the named state the app loads in

`defaultState` is just a template-state key ([04](./04-state.md)) — but by convention it's THE key for screen-wide surface state. The manifest declares the name the app loads in; after load it's ordinary state anything can move. The name set is OPEN — invent one and design for it; every template defines **its own** rendering per name:

```jsonc
// chat template: defaultState "focus" = full overlay over the conversation
{ "type": "Box", "visibleWhen": { "field": "defaultState", "eq": "focus" },
  "style": { "position": "absolute", "inset": "0", "width": "full", "height": "full",
             "background": "surface.base", "overflow": "hidden", "direction": "column" },
  "children": [
    { "type": "ComponentSlot",
      "select": { "from": "all", "type": ["BookingWizard"], "limit": 1 },
      "style": { "width": "full", "height": "full" } }
  ] }
```

- A focusable widget's **node** emits `TEMPLATE_DATA { defaultState: "focus" }` when it streams in (declared in its definition's `defaultState`), so the surface opens the instant the widget arrives; the user's expand/close buttons write the same key.
- The **component stays fit-to-content**; the **template decides the framing** — modal, sheet, side panel, anything. Same `defaultState` name, different surface per template, zero SDK change.

### Rich layers: cap height, scroll inside

A focus surface can hold unbounded content. Don't let it grow forever or clip:

```jsonc
{ "type": "Box", "style": { "height": "full", "minHeight": "0", "direction": "column" },
  "children": [
    { "$include": "blocks/header" },
    { "type": "Box", "style": { "flex": "1", "minHeight": "0", "overflow": "auto" },
      "children": [ /* the long body */ ] }
  ] }
```

Header/footer pinned; **only the body scrolls**.

---

## 🎙️ Voice templates

A voice template is the same model with one extra locked input: the voice service projects **`callState`** (`idle` · `active` · `agentSpeaking` · `userSpeaking`) into template scope, and the template branches its phases on it with one `Switch` — exactly like `defaultState` ([04 §Locked state](./04-state.md)). The transcript rides the conversation, so `Timeline` renders it for free. You never wire audio.

---

## 🤖 `whenToUse` — how the AI picks your app

The **manifest's** `whenToUse` is the text the platform embeds to **select** your app for a user's intent (the template definition may carry one too). It replaces `description` in selection when present.

| | Example |
|---|---|
| ✅ **Outcome-first, user's vocabulary** | "Book, change or cancel a trip in a guided conversation." |
| ❌ Layout-first | "Two-column split layout with a side panel." |
| ✅ **Disqualify by property** | "Not for data-dense monitoring — use a dashboard template for that." |
| ❌ Disqualify by naming a sibling | "Don't use if AcmeDashboard is available." |

Never hardcode agent, workflow, or sibling-template names in meta.

---

## 📋 Template checklist

- [ ] Scaffolded with `./unoverse new template <org> <name>` (envelope + manifest for free)
- [ ] `manifest.json` `binding.workflow` + `binding.trigger` filled (the app owns them)
- [ ] `Timeline` for conversation, generic `ComponentSlot` in the flow
- [ ] Global/focus slots pin `type`
- [ ] `defaultState` surfaces defined for every name the app can load in or reach, body scrolls inside a capped frame
- [ ] No component-type rules, no sizing overrides of components
- [ ] `whenToUse` outcome-first
- [ ] Previewed in Studio, mock then live ([07](./07-studio.md))

---

**Next:** [06 — Styles & Tokens](./06-styles-and-tokens.md).
