import { getPlatformDependencies, type EnhancedNodeDefinition } from "@gravity-platform/plugin-base";
import MCPExecutor from "./executor";

export const NODE_TYPE = "MCP";

function createNodeDefinition(): EnhancedNodeDefinition {
  const { NodeInputType } = getPlatformDependencies();

  return {
    packageVersion: "1.1.1",
    type: NODE_TYPE,
    name: "MCP Service",
    description: "Model Context Protocol service node that handles schema-based service requests",
    category: "Flow",
    color: "#8B5CF6", // Purple color for service nodes

    // Node template for styling
    template: "service", // Options: "standard", "service", "mini"

    // This service node ALSO has workflow connections
    inputs: [
      {
        name: "response",
        type: NodeInputType.OBJECT,
        description: "Response from the connected node handling the service request",
        required: false
      }
    ],
    outputs: [
      {
        name: "request",
        type: NodeInputType.OBJECT,
        description: "Service request forwarded to connected node"
      }
    ],

    // SERVICE CONNECTORS - defines what services this node provides
    serviceConnectors: [
      {
        name: "mcpService",
        description: "Provides Model Context Protocol services",
        serviceType: "mcp",
        methods: ["getSchema", "getChunksByQuery"],
        isService: true, // This node PROVIDES MCP services to others
      },
    ],

    // Configuration schema - holds the service schema
    configSchema: {
      type: "object",
      properties: {
        serviceSchema: {
          type: "object",
          title: "Service Schema",
          description: "JSON schema defining the service methods and their input/output formats",
          default: {},
          "ui:field": "JSON",
        },
      },
      required: ["serviceSchema"],
    },

    // Node capabilities
    capabilities: {
      isTrigger: false,
    },
  };
}

const definition = createNodeDefinition();

export const MCPNode = {
  definition,
  executor: MCPExecutor,
};

export { createNodeDefinition };
