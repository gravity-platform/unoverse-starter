/**
 * ProfileReport Node Definition
 * Auto-generated from Storybook component
 */

import { NodeInputType, type EnhancedNodeDefinition } from "@gravity-platform/plugin-base";
import ProfileReportExecutor from "./executor";
import { loadDefaultTemplate } from "../service/templates";

export const NODE_TYPE = "ProfileReport";

export function createNodeDefinition(): EnhancedNodeDefinition {
  return {
    packageVersion: "1.0.0",
    type: NODE_TYPE,
    name: "ProfileReport",
    description: "ProfileReport print document from design system",
    category: "Print",
    color: "#8b5cf6",
    template: "printComponent",
    componentTemplate: loadDefaultTemplate(),
    logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1751366180/gravity/icons/gravityIcon.png",
    nodeSize: { width: 800, height: 1060 },
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
            "object": {
                  "type": "object",
                  "title": "Profile Report Data",
                  "default": {
                        "name": "Gavin Thornwood",
                        "aliases": "Gav, The Heir, Young Thornwood",
                        "status": "Suspect",
                        "date_of_birth": "March 15, 1982",
                        "place_of_birth": "Napa Valley, CA",
                        "height": "6'1\"",
                        "weight": "185 lbs",
                        "build": "Athletic",
                        "occupation": "Heir Apparent",
                        "scars_marks": "Scar above left brow",
                        "hair_color": "Dark Brown",
                        "coat_colors": "-",
                        "eye_color": "Steel Gray",
                        "sex": "Male",
                        "species": "Human",
                        "remarks": "Eldest son of the Thornwood estate, managing vineyard expansion projects. Was hosting a toast at the gala during the critical timeframe. Appeared notably composed and collected during initial questioning.",
                        "photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop"
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

export const ProfileReportNode = {
  definition,
  executor: ProfileReportExecutor,
};

export { createNodeDefinition as default };
