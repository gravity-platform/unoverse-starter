# Playbook — Agent Skills (prompts/skills)

An agent skill is a markdown behavior guide the platform's AI agents discover and follow
at runtime (e.g. how to handle complaints, how to walk a user through a process). It is
**prose for an agent**, not code.

## Where files go

```
apps/unoverse/prompts/skills/<skill-name>/
  SKILL.md           # required — frontmatter + instructions
```

The runtime scans this folder and serves skills to agents; agents match on the
`description` and `triggers`.

## SKILL.md format

```markdown
---
name: skill-name                # required: lowercase, numbers, hyphens; max 64 chars
description: One or two sentences saying what this covers AND when to use it (10–1024 chars)
version: 1.0.0                  # optional, semver
category: ai                    # optional: ai | integration | workflow | utility
triggers:                       # optional, max 20 keywords/phrases (2–50 chars each)
  - keyword or phrase
credentials: []                 # optional: credential types the skill's flow needs
nodeTypes: []                   # optional: workflow node types the skill relies on
---

# Skill Name

## When to Use This Skill
[The situations that should activate this behavior]

## Approach / Instructions
[Clear, step-by-step guidance. Concrete do/don't phrasing beats abstractions —
include example lines the agent can use verbatim where tone matters.]

## Examples
[Concrete before/after or dialogue examples]
```

No other frontmatter keys are accepted (validation rejects unknown properties). The
markdown body must exist — a skill with frontmatter only is invalid.

## Writing rules

1. **The `description` does the routing.** Write it for an agent deciding "do I need
   this now?" — cover both the topic and the trigger situations.
2. **Study an existing skill** in `prompts/skills/` and match its voice and structure.
3. Keep instructions outcome-focused and scannable: short sections, bulleted do/don't
   lists, explicit escalation/stop conditions.
4. One skill = one behavior. If you're writing "and also…", split it.

## Ship

`docker compose restart unoverse` — the runtime rescans skills at boot. Verify the
skill appears via the platform's skill listing (`./unoverse check` for overall health).
