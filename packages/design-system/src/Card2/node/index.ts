/**
 * Card2 Node Definition
 * Auto-generated from Storybook component
 */

import { NodeInputType, type EnhancedNodeDefinition } from "@gravity-platform/plugin-base";
import Card2Executor from "./executor";
import { loadDefaultTemplate } from "../service/templates";

export const NODE_TYPE = "Card2";

export function createNodeDefinition(): EnhancedNodeDefinition {
  return {
    packageVersion: "1.0.0",
    type: NODE_TYPE,
    name: "Card2",
    description: "Card2 UI component from design system",
    category: "Design System",
    color: "#10b981",
    template: "uiComponent",
    componentTemplate: loadDefaultTemplate(),
    logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1751366180/gravity/icons/gravityIcon.png",
    nodeSize: { width: 750, height: 400 },
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
            "title": {
                  "type": "string",
                  "title": "Card title",
                  "default": "Force Sensitivity Assessment",
                  "ui:field": "template"
            },
            "description": {
                  "type": "string",
                  "title": "Card description text",
                  "default": "Discover your connection to the Force with advanced midi-chlorian analysis. Receive personalized training recommendations and track your progress on the path to becoming a Jedi.",
                  "ui:field": "template"
            },
            "image": {
                  "type": "string",
                  "title": "URL for card image",
                  "default": "https://res.cloudinary.com/sonik/image/upload/v1761403583/gravity/YodaPark/force.avif",
                  "ui:field": "template"
            },
            "callToAction": {
                  "type": "string",
                  "title": "Call to action button text",
                  "default": "Start Assessment",
                  "ui:field": "template"
            },
            "object": {
                  "type": "object",
                  "title": "Full object with card data (title, description, imageUrl/image, callToAction)",
                  "ui:field": "template"
            }
      },
      "required": []
},
    credentials: [],
  };
}

const definition = createNodeDefinition();

export const Card2Node = {
  definition,
  executor: Card2Executor,
};

export { createNodeDefinition as default };
