/**
 * AutopsyReport Node Definition
 * Auto-generated from Storybook component
 */

import { NodeInputType, type EnhancedNodeDefinition } from "@gravity-platform/plugin-base";
import AutopsyReportExecutor from "./executor";
import { loadDefaultTemplate } from "../service/templates";

export const NODE_TYPE = "AutopsyReport";

export function createNodeDefinition(): EnhancedNodeDefinition {
  return {
    packageVersion: "1.0.0",
    type: NODE_TYPE,
    name: "AutopsyReport",
    description: "AutopsyReport print document from design system",
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
                  "title": "Autopsy Report Data",
                  "default": {
                        "decedent": "Antonio Reyes",
                        "race": "H",
                        "sex": "M",
                        "age": "52",
                        "time_of_death": "10:12 PM",
                        "place": "Wine Cellar",
                        "type_of_death_trauma": " ",
                        "type_of_death_suicide": " ",
                        "type_of_death_suddenly": " ",
                        "type_of_death_found_dead": "X",
                        "type_of_death_suspicious": "X",
                        "type_of_death_unusual": " ",
                        "type_of_death_unnatural": "X",
                        "comment": "Decedent discovered in wine cellar during harvest gala event. Emergency services notified at scene.",
                        "body_height": "5'10\"",
                        "body_weight": "175lb",
                        "body_hair": "Black",
                        "body_eyes": "Brown",
                        "body_clothes": "Formal attire",
                        "body_accessories": "Wristwatch",
                        "marks_and_wounds": "No external trauma observed. Perioral cyanosis present. Petechial hemorrhaging in conjunctiva. Oral mucosa shows mild irritation consistent with chemical exposure.",
                        "toxicology_results": "Lethal concentration of organophosphate compound detected in blood and tissue samples. Substance consistent with agricultural pesticide chemicals.",
                        "probable_cause_of_death": "Acute poisoning from ingestion of toxic organophosphate compound administered via wine.",
                        "further_action": "Homicide investigation recommended. Wine samples and cellar evidence retained for criminal analysis.",
                        "date": "2024-10-13",
                        "place_of_investigation": "Napa County Morgue",
                        "signature": "Dr. Sarah Chen, M.E."
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

export const AutopsyReportNode = {
  definition,
  executor: AutopsyReportExecutor,
};

export { createNodeDefinition as default };
