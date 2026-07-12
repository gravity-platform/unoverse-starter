# 04 — State

**Three buckets. Two writes. Four moves. Everything else is locked — you project it, you never manage it.**

This is the most important doc in the pack. Every interactive behavior — tabs, wizards, focus, disclosures, voice phases — is built from this one model. The SDK hardcodes **no UI concept**: no focus, no panels, no suggestions, no voice machine. You name the keys; the engine just moves them.

---

## 🪣 The three buckets

| Bucket | Holds | Keyed by | Written by |
|---|---|---|---|
| **Conversation** | the timeline of turns, each turn's status (streaming/complete), the voice transcript | the conversation | **the stream** (and the voice service) — 🔒 never by you |
| **Component state** | one slice per component: its streamed data **and** its own view state (tab, step, `defaultState`) | the component's unique id | streamed `COMPONENT_DATA` + your `setValue` actions |
| **Template state** | the active template's bag: `draft`, plus any keys you name (`openPanel`, `defaultState`, suggestion data, voice `callState`) | the active template | the workflow (`TEMPLATE_DATA`) + your `setTemplateValue` actions + producer services |

All three live in the client's in-memory store, rebuilt from the stream on reload. They are **render state** — the agent's real conversation memory lives on the server and is a different layer entirely. Don't conflate them, and don't try to persist render state.

---

## ✍️ The two writes — the ENTIRE write API

```jsonc
// a button inside a component — writes into ITS OWN slice, then flags the template
{ "type": "Button",
  "action": {
    "type": "setValue",
    "values": [{ "key": "defaultState", "value": "focused" }],
    "then": { "type": "setTemplateValue", "values": [{ "key": "defaultState", "value": "focus" }] }
  } }

// close chrome — clear both, same two verbs
{ "type": "Ref", "ref": "close-button",
  "action": {
    "type": "setValue",
    "values": [{ "key": "defaultState", "value": "inline" }],
    "then": { "type": "setTemplateValue", "values": [{ "key": "defaultState", "value": null }] }
  } }
```

- **`setValue`** → the component's own slice
- **`setTemplateValue`** → template state
- `values` is a list of `{ key, value }` writes (values may be `{{field}}` reads); `then` chains a second write

That's it. There is no `openPanel` verb, no `toggleFocus`, no `showSuggestions`. Those are **keys you invent**, written by the two actions, read by conditions. Adding a feature is **data**, never a new action.

Anything that is not one of these two is routed to the **server as a native MCP call** ([02](./02-sdui-and-mcp-apps.md)): sending a message is `tools/call` on the app's trigger tool; answering a waiting wizard is an MCP **elicitation**. You never build transport.

---

## 🎬 The four moves — one condition vocabulary

All reactivity is `eq` / `ne` / `in` / truthy applied four ways:

| Move | Use when | Example |
|---|---|---|
| **`visibleWhen`** | a small thing appears/disappears | `"visibleWhen": { "field": "openPanel", "eq": "faq" }` |
| **`Switch`** | a whole view swaps (wizard steps, inline↔focused) | `"on": "step", "cases": { … }` |
| **`Each`** | repeat over a data array | see [03](./03-components.md) |
| **`style.when`** | the same element restyles by state | `"when": [{ "field": "deltaPositive", "eq": true, "apply": { "color": "status.success" } }]` |

✅ Mutually exclusive views belong in **one `Switch`**, never in N `visibleWhen`s fighting with opposite conditions.

### Discriminants, not boolean soup

Name **one field** per axis of variation, with a few values — `defaultState: "inline" | "focused"`, `step: "choose" | "confirm" | "done"`, `callState: "idle" | "active" | …`. A pile of independent booleans (`isExpanded`, `showDetails`, `hideHeader`) always drifts into contradictory combinations.

### Named states are first-class — enumerated, viewable, served

A definition's states aren't hidden inside its conditions. Each layer lives as a file in the definition's **`states/` folder**, and that folder is a registry three consumers read automatically:

- **Studio** shows a pill per state in mock view — click to activate it and design that layer in isolation ([07](./07-studio.md)).
- **The served app manifest** carries the same list (`states`, each with its activation selector), so any MCP caller knows which states exist and how to activate them.
- **The root definition** declares the pill order (the sequence of its `$include: "states/…"` references).

Add a state = add a file. It appears everywhere, nothing to register.

---

## 🔍 Focus is not special — it's your choice of bucket

There is **no focus concept in the SDK**. You build it like everything else:

| Behavior | Bucket & key | Read by |
|---|---|---|
| A widget's own expanded/inline look | its slice: `setValue` of `defaultState: "focused"` | `visibleWhen`/`Switch` on `defaultState` |
| A screen-wide "something is focused" signal (hide the chat input, open an overlay) | template state: `setTemplateValue` of `defaultState: "focus"` | `visibleWhen: { field: "defaultState", eq: "focus" }` |

A widget chains both with `then`: set its own `defaultState`, *then* flag the template. **How** `defaultState: "focus"` looks is each template's own business — a chat template may render a full overlay, a voice template a side panel. Same key, different surface, zero SDK involvement ([05](./05-templates.md)).

---

## 🔒 Locked state — managed FOR you, read-only to you

Not all state is yours to write. Three kinds are **locked**: the platform manages them, and your definitions only project them. Trying to manage these yourself is the #1 architecture mistake.

### 1. Conversation & lifecycle — locked to the stream

The timeline, turn identity, and streaming status are written **only by the stream** (`WORKFLOW_STARTED` opens a turn, `WORKFLOW_COMPLETED` closes it — run-scoped, on the MCP `/stream` lane). "Is the assistant thinking" is **derived** from the conversation and handed to you as flags (`isStreaming`, `isEmpty`) for `visibleWhen`.

- ✅ `{"visibleWhen": { "field": "isStreaming" }}` on your thinking indicator.
- ❌ Never simulate lifecycle with your own keys, and never gate a "done" look on whether text has arrived. If a streaming flag never clears, that's a stream-delivery problem to report — not something to patch in a definition.

### 2. Voice — locked in the SDK's voice service

Voice is the canonical **native service**: mic, speakers, and audio frames cannot be data, so the SDK owns them (`useVoiceService`, on the SDK WebSocket lane — the audio lane, [02](./02-sdui-and-mcp-apps.md)). You never touch a connection, a frame, or a mute toggle's plumbing.

But the service is a **producer**: it writes its *derived state* into the normal buckets, and you read it exactly like any other key:

| Voice piece | Where it lands | Your job |
|---|---|---|
| audio I/O (mic/speaker/frames) | 🔒 the service — invisible to definitions | nothing |
| **`callState`**: `idle` · `active` · `agentSpeaking` · `userSpeaking` | **template state** | branch your voice template's phases on it |
| transcript (the words said) | **conversation** | render via `Timeline` |
| fine flags (`isMuted`, `isAssistantSpeaking`, …) | template scope | small reads (a mute icon) |

```jsonc
// a voice template branches call phases off ONE value — same pattern as defaultState
{ "type": "Switch", "on": "callState",
  "cases": {
    "idle":          { "$include": "states/idle" },
    "active":        { "$include": "states/listening" },
    "agentSpeaking": { "$include": "states/speaking" },
    "userSpeaking":  { "$include": "states/listening" }
  } }
```

**The rule services follow:** a service may own native I/O, but its **state lives in the normal buckets**. If UI-driving state hides inside a service hook, that's the same leak as a feature name in the engine.

### 3. Native host chrome — locked in the channel

Truly ephemeral, presentation-only toggles that belong to a specific host screen (a docs drawer open/closed in an embedding app) live in the **host's own native state** (e.g. React `useState` in the channel), passed into the template as `props` and projected with `visibleWhen`. They do NOT go in the store, and they NEVER justify a new SDK primitive.

### The decision table

| The state is… | It goes in… | Written by |
|---|---|---|
| a component's data or its own view state | the component slice | stream + `setValue` |
| shared across the surface (defaultState, panels, drafts, suggestions data) | template state | workflow + `setTemplateValue` |
| conversation flow / streaming status | 🔒 conversation (derived flags) | the stream only |
| voice call phase / transcript | 🔒 written by the voice service into template state / conversation | the service (you read it) |
| host-screen-only ephemeral chrome | 🔒 the native host, as `props` | the channel |

---

**Next:** [05 — Templates (MCP Apps)](./05-templates.md).
