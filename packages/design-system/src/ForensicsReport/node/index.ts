/**
 * ForensicsReport Node Definition
 * Auto-generated from Storybook component
 */

import { NodeInputType, type EnhancedNodeDefinition } from "@gravity-platform/plugin-base";
import ForensicsReportExecutor from "./executor";
import { loadDefaultTemplate } from "../service/templates";

export const NODE_TYPE = "ForensicsReport";

export function createNodeDefinition(): EnhancedNodeDefinition {
  return {
    packageVersion: "1.0.0",
    type: NODE_TYPE,
    name: "ForensicsReport",
    description: "ForensicsReport print document from design system",
    category: "Print",
    color: "#8b5cf6",
    template: "printComponent",
    componentTemplate: loadDefaultTemplate(),
    logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1751366180/gravity/icons/gravityIcon.png",
    nodeSize: { width: 1060, height: 820 },
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
                  "title": "Forensics Report Data",
                  "default": {
                        "lab_number": "FL-2024-1012",
                        "case_number": "VHL-2024-1012",
                        "date_received": "October 13, 2024",
                        "date_reported": "October 15, 2024",
                        "requesting_agency": "County Sheriff's Department - Major Crimes Unit",
                        "examiner_name": "Dr. Rebecca Chen, Ph.D., Forensic Toxicology",
                        "item_1_number": "FOR_001",
                        "item_1_description": "Wine glass with residual liquid recovered from cellar floor near victim",
                        "item_1_method": "Gas Chromatography-Mass Spectrometry (GC-MS) analysis",
                        "item_1_result": "Lethal concentration of pharmaceutical-grade compound detected. Substance requires controlled laboratory access. No latent fingerprints recovered.",
                        "item_2_number": "FOR_002",
                        "item_2_description": "Victim blood and tissue samples collected during autopsy examination",
                        "item_2_method": "Toxicological screening and quantitative analysis",
                        "item_2_result": "Fatal dosage confirmed in bloodstream. Compound typically restricted to pharmaceutical research facilities. Death within 5-8 minutes of ingestion.",
                        "item_3_number": "FOR_003",
                        "item_3_description": "Footprint impressions on stone cellar floor near exterior access door",
                        "item_3_method": "Forensic impression analysis and pattern comparison",
                        "item_3_result": "Multiple partial prints identified. Tread pattern consistent with common athletic footwear, size range 8-10. Direction indicates exit pathway.",
                        "item_4_number": "FOR_004",
                        "item_4_description": "Soil samples and footprint casts from vineyard path adjacent to cellar",
                        "item_4_method": "Impression casting and comparative tread analysis",
                        "item_4_result": "Fresh impressions match pattern from cellar floor. Gait analysis suggests rapid movement. Timeline consistent with evening of incident.",
                        "conclusion": "Evidence confirms intentional poisoning using restricted pharmaceutical compound. Perpetrator requires specialized knowledge and controlled substance access. Footprint evidence indicates hasty departure. Further investigation of individuals with relevant expertise recommended.",
                        "signature": "Dr. Rebecca Chen, Ph.D."
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

export const ForensicsReportNode = {
  definition,
  executor: ForensicsReportExecutor,
};

export { createNodeDefinition as default };
