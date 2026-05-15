/**
 * MiroIssueTriage Node Definition
 * Auto-generated from Storybook component
 */

import { NodeInputType, type EnhancedNodeDefinition } from "@gravity-platform/plugin-base";
import MiroIssueTriageExecutor from "./executor";
import { loadDefaultTemplate } from "../service/templates";

export const NODE_TYPE = "MiroIssueTriage";

export function createNodeDefinition(): EnhancedNodeDefinition {
  return {
    packageVersion: "1.0.0",
    type: NODE_TYPE,
    name: "MiroIssueTriage",
    description: "MiroIssueTriage UI component from design system",
    category: "Design System",
    color: "#10b981",
    template: "uiComponent",
    componentTemplate: loadDefaultTemplate(),
    logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1751366180/gravity/icons/gravityIcon.png",
    nodeSize: { width: 1200, height: 700 },
    inputs: [{ name: "signal", type: NodeInputType.OBJECT, description: "Signal" }],
    outputs: [{ name: "componentSpec", type: NodeInputType.OBJECT, description: "Component spec for downstream nodes" }],
    configSchema: {
      "type": "object",
      "properties": {
            "focusable": {
                  "type": "boolean",
                  "title": "Enable Focus Mode",
                  "description": "Allow this component to expand and become the primary interaction surface",
                  "default": false,
                  "ui:widget": "toggle"
            },
            "focusLabel": {
                  "type": "string",
                  "title": "Focus Mode Label",
                  "description": "Name shown in chat input when this component is focused (e.g., 'Bank Transfer')",
                  "default": "",
                  "ui:dependencies": {
                        "focusable": true
                  }
            },
            "painPoints": {
                  "type": "object",
                  "title": "Array of pain points from AI analysis",
                  "default": [
                        {
                              "insight": "Large, complex Miro boards become architecturally unmanageable",
                              "evidence": "'The web of insanity my Largest Miro board fully contains could totally use a better architecture...' (33 impressions)"
                        },
                        {
                              "insight": "Diagrams on Miro boards go stale and drift from live systems (e.g., DB schemas, architecture)",
                              "evidence": "'Most teams maintain DB schemas in three places — code, dbdocs, and a stale Miro board.' (290 impressions)"
                        },
                        {
                              "insight": "Miro boards are visually overwhelming and hard to read at scale — zoomed-out boards are illegible",
                              "evidence": "'The zoomed out Miro board screenshot that you can't even read but somehow still tells you everything about how that designer thinks 😂' (24 impressions)"
                        },
                        {
                              "insight": "Teams underutilize Miro's power — many don't know how to structure boards effectively, creating a skills gap",
                              "evidence": "'Most teams don't even know how powerful a well structured Miro board can be.' (10 impressions); '$50 for a complex Miro board is honestly low depending on the scope... it's systems thinking.' (20 impressions)"
                        },
                        {
                              "insight": "There is an emerging freelance economy around Miro board building, signaling unmet demand for professional-grade templates and setup assistance",
                              "evidence": "'I am looking to bring on two professional Miro Board Builders to assist with high-level design projects.' (283 impressions); 'I built this Miro board for a client last week. They went from total chaos to a clean organized workflow in 24 hours.' (135 impressions)"
                        },
                        {
                              "insight": "Miro is used as a manual workflow-mapping tool before automation, but lacks native automation integration",
                              "evidence": "'List every manual task your team does daily. Put it on a Miro board. Ask: what 50-60% can Claude Code, Clay, or N8N handle?' (878 impressions, 19 likes, 16 bookmarks)"
                        }
                  ],
                  "ui:field": "template"
            },
            "productIdeas": {
                  "type": "object",
                  "title": "Array of product ideas from AI analysis",
                  "default": [
                        {
                              "title": "Live Data Sync for Architecture & Schema Diagrams",
                              "description": "Allow Miro boards to connect to live data sources (e.g., Postgres, GitHub, Jira) so diagrams auto-update when the source changes, eliminating stale boards.",
                              "addressesPainPoint": "Diagrams on Miro boards go stale and drift from live systems"
                        },
                        {
                              "title": "Board Health & Structure Analyzer",
                              "description": "An AI-powered tool that scans large boards and flags complexity issues, suggests grouping/clustering, and recommends architecture improvements to tame 'web of insanity' boards.",
                              "addressesPainPoint": "Large, complex Miro boards become architecturally unmanageable"
                        },
                        {
                              "title": "Smart Board Zoom Summaries",
                              "description": "Automatically generate a readable, high-level summary view of a board at low zoom levels — using AI to surface key labels, clusters, and flows instead of unreadable tiny text.",
                              "addressesPainPoint": "Zoomed-out boards are illegible and visually overwhelming at scale"
                        },
                        {
                              "title": "Workflow Automation Mapper (AI + N8N/Make Integration)",
                              "description": "A native Miro template and integration that lets teams map manual workflows on a board, then tag tasks as automation candidates and export them directly to N8N, Make, or Clay.",
                              "addressesPainPoint": "Miro is used as a manual workflow-mapping tool before automation but lacks native automation integration"
                        },
                        {
                              "title": "Miro Expert Marketplace & Certified Templates",
                              "description": "An in-product marketplace where verified Miro board builders can sell templates and setup services, with a certification program to surface quality builders to teams who need them.",
                              "addressesPainPoint": "Emerging freelance economy around Miro board building signals unmet demand for professional-grade setup"
                        },
                        {
                              "title": "Guided Board Builder (AI Onboarding Wizard)",
                              "description": "An interactive AI assistant that asks teams about their use case and auto-generates a structured, best-practice board with proper frameworks, flows, and labels — lowering the skill barrier.",
                              "addressesPainPoint": "Teams underutilize Miro's power due to a skills gap in structuring boards effectively"
                        }
                  ],
                  "ui:field": "template"
            },
            "topTweet": {
                  "type": "object",
                  "title": "Highest signal tweet with reasoning",
                  "default": {
                        "text": "Every sales team lead should do this once: 1. List every manual task your team does daily 2. Put it on a Miro board 3. Ask: what 50-60% can Claude Code, Clay, or N8N handle? 4. Hire one technical person to build it in-house",
                        "reason": "Highest-signal tweet (878 impressions, 19 likes, 16 bookmarks, 5 replies) — reveals Miro is organically used as a workflow audit and automation-planning tool, a high-intent use case Miro could own natively with automation integrations."
                  },
                  "ui:field": "template"
            }
      },
      "required": []
},
    credentials: [],
  };
}

const definition = createNodeDefinition();

export const MiroIssueTriageNode = {
  definition,
  executor: MiroIssueTriageExecutor,
};

export { createNodeDefinition as default };
