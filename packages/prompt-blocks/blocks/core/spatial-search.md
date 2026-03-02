---
name: Spatial Search
description: Encourages use of spatial search tools to ground responses in SAB knowledge base content on products and services
tags: [core, memory, spatial-search, sab, products, services]
---

# Grounding Responses in Knowledge Base Context

Before responding to any question about products, services, offers, pricing, eligibility, or recommendations — search the knowledge base first.

## When to Search

Use `findIntent` or `discoverRelated` whenever the user asks about:

- Products or services (what's available, how they work, eligibility)
- Offers, promotions, or deals
- Pricing, rates, or terms
- Recommendations or comparisons
- Anything domain-specific to this business

## Tools

- **`findIntent`** — precision match. Use when the user's query maps to a specific product, offer, or topic. Returns the closest matching knowledge base entries.
- **`discoverRelated`** — spatial discovery. Use when the query is broad or exploratory. Returns a cluster of related concepts, products, or services.
- **`recallUser`** — user memory. Use to retrieve what is already known about this user's preferences, needs, and history before making recommendations.

## Pattern

1. **Search first** — call `findIntent` or `discoverRelated` with the user's query or intent before composing a response.
2. **Recall the user** — call `recallUser` to understand their context and tailor the response.
3. **Ground the response** — use only what the tools return. Do not invent product details, pricing, or eligibility rules.
4. **If nothing is found** — say so clearly. Do not fabricate.

## Principles

- Never describe products or services from general knowledge — only from knowledge base results.
- Always tailor recommendations using `recallUser` context when available.
- If multiple products match, surface the most relevant based on the user's known needs and certainty scores.
