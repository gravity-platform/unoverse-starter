/**
 * AIResponse Node Definition
 * Auto-generated from Storybook component
 */

import { NodeInputType, type EnhancedNodeDefinition } from "@gravity-platform/plugin-base";
import AIResponseExecutor from "./executor";
import { loadDefaultTemplate } from "../service/templates";

export const NODE_TYPE = "AIResponse";

export function createNodeDefinition(): EnhancedNodeDefinition {
  return {
    packageVersion: "1.0.0",
    type: NODE_TYPE,
    name: "AIResponse",
    description: "AIResponse UI component from design system",
    category: "Design System",
    color: "#10b981",
    template: "uiComponent",
    componentTemplate: loadDefaultTemplate(),
    logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1751366180/gravity/icons/gravityIcon.png",
    nodeSize: { width: 750, height: 400 },
    inputs: [{ name: "signal", type: NodeInputType.OBJECT, description: "Signal" }],
    outputs: [{ name: "output", type: NodeInputType.OBJECT, description: "Response object" }],
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
            "progressText": {
                  "type": "string",
                  "title": "Progress/thinking message",
                  "default": "Searching the Jedi Archives...",
                  "ui:field": "template"
            },
            "text": {
                  "type": "object",
                  "title": "Main response text",
                  "default": "The **Star Wars** saga spans nine main films across three trilogies, following the Skywalker family's journey through the galaxy. From Anakin's fall to the **dark side** to Luke's redemption of his father, and Rey's discovery of her own power, these stories explore themes of **hope**, **redemption**, and the eternal struggle between light and dark.",
                  "ui:field": "template"
            },
            "questions": {
                  "type": "object",
                  "title": "Follow-up questions (array of strings)",
                  "default": [
                        "What is the correct chronological order to watch all Star Wars films?",
                        "Who are the most powerful Jedi in Star Wars history?",
                        "What is the difference between the light side and dark side of the Force?"
                  ],
                  "ui:field": "template"
            }
      },
      "required": []
},
    credentials: [],
  };
}

const definition = createNodeDefinition();

export const AIResponseNode = {
  definition,
  executor: AIResponseExecutor,
};

export { createNodeDefinition as default };
