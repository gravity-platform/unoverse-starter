import {
  getPlatformDependencies,
  type EnhancedNodeDefinition,
} from "@gravity-platform/plugin-base";
import SmartDocumentExecutor from "./executor";

export const NODE_TYPE = "SmartDocument";

function createNodeDefinition(): EnhancedNodeDefinition {
  const { NodeInputType } = getPlatformDependencies();

  return {
    packageVersion: "0.2.0",
    type: NODE_TYPE,
    name: "Smart Document",
    description:
      "Agent-managed long-form markdown document. Addressable sections (H1/H2) with stable IDs and content hashes. Exposes outline / readSection / updateSection / appendToSection / replaceInSection / insertSection / deleteSection / moveSection / resetDoc as MCP tools.",
    category: "Agent Tools",
    color: "#10b981",
    template: "service",
    logoUrl:
      "https://res.cloudinary.com/sonik/image/upload/v1751366180/gravity/icons/gravityIcon.png",
    inputs: [],
    outputs: [
      {
        name: "markdown",
        type: NodeInputType.STRING,
        description: "Current rendered markdown content",
      },
    ],
    serviceConnectors: [
      {
        name: "mcpService",
        description:
          "MCP tools for a single agent to read and edit this markdown document by section",
        serviceType: "mcp",
        // getSchema is a meta-method (tool discovery) and must NOT be listed here.
        methods: [
          "outline",
          "readSection",
          "updateSection",
          "appendToSection",
          "replaceInSection",
          "insertSection",
          "deleteSection",
          "moveSection",
          "resetDoc",
        ],
        isService: true,
      },
    ],
    configSchema: {
      type: "object",
      properties: {
        initialMarkdown: {
          type: "string",
          title: "Initial content",
          description:
            "Seeded into Redis when the node first executes. Parsed into sections on init (H1/H2 become sections; H3+ stays in bodies). Supports {{input.field}} templating.",
          default: "",
          "ui:field": "template",
        },
        sectionizeAt: {
          type: "integer",
          title: "Sectionize at",
          description:
            "Which heading level starts a new section. 2 (default) = H1 and H2 are sections, H3+ stays in bodies. 1 = only H1 is a section.",
          default: 2,
          enum: [1, 2],
          enumNames: ["H1 only", "H1 and H2"],
        },
      },
      required: [],
    },
    credentials: [],
    capabilities: { isTrigger: false },
  };
}

const definition = createNodeDefinition();

export const SmartDocumentNode = {
  definition,
  executor: SmartDocumentExecutor,
};

export { createNodeDefinition };
