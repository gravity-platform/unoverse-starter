# Playbook — Prompt Blocks (prompts/blocks)

A prompt block is a **reusable prompt fragment** — a named piece of agent prompt text
(formatting rules, a reasoning pattern, a policy) that workflows compose into agent
system prompts. Smaller than a skill: a skill is a discoverable behavior guide; a block
is an ingredient.

## Where files go

```
apps/unoverse/prompts/blocks/<category>/<block-name>.md
```

The immediate subdirectory is the block's category (existing: `core/`, `formatting/`).
The runtime scans this tree recursively and serves blocks by category/name.

## Format

```markdown
---
name: Human Readable Name
description: What this block contributes to a prompt
tags: [topic, topic2]
---

[The prompt text itself — written as direct instructions to the agent,
present tense, no meta-commentary about being a block.]
```

## Writing rules

1. **Study an existing block** (e.g. `blocks/formatting/markdown-guidelines.md`) and
   match its shape: tight sections, imperative bullets.
2. A block must stand alone — no references to other blocks, no assumptions about what
   else is in the prompt.
3. Keep it generic and reusable. Anything workflow-specific belongs in that workflow's
   own prompt, not in a shared block.
4. Pick the existing category that fits; create a new subdirectory only for a genuinely
   new family of blocks.

## Ship

`docker compose restart unoverse` — the runtime rescans blocks at boot.
