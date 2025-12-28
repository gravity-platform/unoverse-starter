/**
 * CardCarousel Node Definition
 * Auto-generated from Storybook component
 */

import { NodeInputType, type EnhancedNodeDefinition } from "@gravity-platform/plugin-base";
import CardCarouselExecutor from "./executor";
import { loadDefaultTemplate } from "../service/templates";

export const NODE_TYPE = "CardCarousel";

export function createNodeDefinition(): EnhancedNodeDefinition {
  return {
    packageVersion: "1.0.0",
    type: NODE_TYPE,
    name: "CardCarousel",
    description: "CardCarousel UI component from design system",
    category: "Design System",
    color: "#10b981",
    template: "uiComponent",
    componentTemplate: loadDefaultTemplate(),
    logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1751366180/gravity/icons/gravityIcon.png",
    nodeSize: { width: 900, height: 400 },
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
            "items": {
                  "type": "object",
                  "title": "Array of card items to display (from PostgresFetch or similar)",
                  "ui:field": "template"
            }
      },
      "required": []
},
    credentials: [],
  };
}

const definition = createNodeDefinition();

export const CardCarouselNode = {
  definition,
  executor: CardCarouselExecutor,
};

export { createNodeDefinition as default };
