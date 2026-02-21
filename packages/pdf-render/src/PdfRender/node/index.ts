import { NodeInputType, type EnhancedNodeDefinition } from "@gravity-platform/plugin-base";
import { PdfRenderExecutor } from "./executor";

export const NODE_TYPE = "PdfRender";

function createNodeDefinition(): EnhancedNodeDefinition {
  return {
    packageVersion: "1.0.0",
    type: NODE_TYPE,
    name: "PDF Render",
    description: "Renders a design system print component to PDF using headless Chrome",
    category: "Output",
    color: "#DC2626",
    logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1771073087/gravity/icons/pdf.png",

    inputs: [
      {
        name: "signal",
        type: NodeInputType.OBJECT,
        description: "Component spec from a print node (PoliceReport, etc.)",
        required: true,
      },
    ],

    outputs: [
      {
        name: "output",
        type: NodeInputType.OBJECT,
        description: "PDF output with pdfBase64, contentType, filename, pages, size",
      },
    ],

    configSchema: {
      type: "object",
      properties: {
        componentSpec: {
          type: "object",
          title: "Component Spec",
          description: "The componentSpec from the upstream print node.",
          default: "",
          "ui:field": "template",
        },
        pageSize: {
          type: "string",
          title: "Page Size",
          description: "PDF page size",
          enum: ["letter", "a4", "tabloid"],
          enumNames: ["Letter (8.5×11)", "A4 (210×297mm)", "Tabloid (11×17)"],
          default: "letter",
        },
        orientation: {
          type: "string",
          title: "Orientation",
          description: "Page orientation",
          enum: ["portrait", "landscape"],
          enumNames: ["Portrait", "Landscape"],
          default: "portrait",
        },
        filename: {
          type: "string",
          title: "Filename",
          description:
            "Output PDF filename. Supports {{input.componentSpec.type}} syntax. Leave empty for auto-generated.",
          "ui:field": "template",
          default: "",
        },
      },
    },
  };
}

const definition = createNodeDefinition();

export const PdfRenderNode = {
  definition,
  executor: PdfRenderExecutor,
};

export { createNodeDefinition };
