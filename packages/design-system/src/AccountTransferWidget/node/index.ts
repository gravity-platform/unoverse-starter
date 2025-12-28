/**
 * AccountTransferWidget Node Definition
 * Auto-generated from Storybook component
 */

import { NodeInputType, type EnhancedNodeDefinition } from "@gravity-platform/plugin-base";
import AccountTransferWidgetExecutor from "./executor";
import { loadDefaultTemplate } from "../service/templates";

export const NODE_TYPE = "AccountTransferWidget";

export function createNodeDefinition(): EnhancedNodeDefinition {
  return {
    packageVersion: "1.0.0",
    type: NODE_TYPE,
    name: "AccountTransferWidget",
    description: "AccountTransferWidget UI component from design system",
    category: "Design System",
    color: "#10b981",
    template: "uiComponent",
    componentTemplate: loadDefaultTemplate(),
    logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1751366180/gravity/icons/gravityIcon.png",
    nodeSize: { width: 900, height: 600 },
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
            "transferData": {
                  "type": "object",
                  "title": "Transfer data object populated by AI",
                  "ui:field": "template"
            },
            "availableAccounts": {
                  "type": "object",
                  "title": "Available source accounts to choose from",
                  "ui:field": "template"
            },
            "beneficiaries": {
                  "type": "object",
                  "title": "Saved beneficiaries to choose from",
                  "ui:field": "template"
            },
            "heroImage": {
                  "type": "string",
                  "title": "Hero image URL for the widget",
                  "ui:field": "template"
            }
      },
      "required": []
},
    credentials: [],
  };
}

const definition = createNodeDefinition();

export const AccountTransferWidgetNode = {
  definition,
  executor: AccountTransferWidgetExecutor,
};

export { createNodeDefinition as default };
