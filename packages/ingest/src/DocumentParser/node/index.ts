import { getPlatformDependencies, type EnhancedNodeDefinition } from "@gravity-platform/plugin-base";
import { DocumentParserExecutor } from "./executor";

export const NODE_TYPE = "DocumentParser";

function createNodeDefinition(): EnhancedNodeDefinition {
  const { NodeInputType, NodeConcurrency } = getPlatformDependencies();

  return {
    packageVersion: "1.1.1",
    type: NODE_TYPE,
    name: "Document Parser",
    description: "Parse documents (PDF, DOCX, TXT) and extract text content",
    category: "Ingest",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/2991/2991112.png",
    color: "#4A90E2",

    inputs: [
      {
        name: "signal",
        type: NodeInputType.OBJECT,
        description: "File object",
      },
    ],

    outputs: [
      {
        name: "output",
        type: NodeInputType.OBJECT,
        description: "Parsed document",
      },
    ],

    configSchema: {
      type: "object",
      properties: {
        file: {
          type: "object",
          title: "File",
          description: "Parse me",
          default: "",
          "ui:field": "template",
        },
        parserType: {
          type: "string",
          title: "Parser Type",
          description: "Force specific parser or use auto-detect",
          enum: ["auto", "pdf", "docx", "txt"],
          default: "auto",
        },
        maxFileSizeMB: {
          type: "number",
          title: "Max File Size (MB)",
          description: "Maximum file size to process in megabytes",
          default: 10,
          minimum: 1,
          maximum: 100,
        },
      },
    },
  };
}

const definition = createNodeDefinition();

export const DocumentParserNode = {
  definition,
  executor: DocumentParserExecutor,
};

export { createNodeDefinition };
