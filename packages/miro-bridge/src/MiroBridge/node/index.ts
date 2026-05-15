import {
  getPlatformDependencies,
  type EnhancedNodeDefinition,
} from "@gravity-platform/plugin-base";
import MiroBridgeExecutor from "./executor";

export const NODE_TYPE = "MiroBridge";

function createNodeDefinition(): EnhancedNodeDefinition {
  const { NodeInputType } = getPlatformDependencies();

  return {
    packageVersion: "0.1.0",
    type: NODE_TYPE,
    name: "Miro Bridge",
    description: "Connects an LLM to a live Miro board via 10 MCP tools. Commands run in the Miro iframe via the MiroBridge component.",
    category: "Agent Tools",
    color: "#ffdd00",
    template: "service",
    logoUrl:
      "https://res.cloudinary.com/sonik/image/upload/v1751366180/gravity/icons/gravityIcon.png",
    inputs: [],
    outputs: [
      {
        name: "boardState",
        type: NodeInputType.OBJECT,
        description: "Current board state snapshot: { items[], timestamp }",
      },
    ],
    serviceConnectors: [
      {
        name: "mcpService",
        description:
          "MCP tools for an LLM agent to read and write the Miro board in real time",
        serviceType: "mcp",
        methods: [
          "get_board_state",
          "get_selection",
          "create_sticky",
          "create_text",
          "create_frame",
          "create_shape",
          "create_card",
          "create_app_card",
          "create_image",
          "update_item",
          "delete_item",
          "create_connector",
          "add_tag",
          "zoom_to",
        ],
        isService: true,
      },
    ],
    configSchema: {
      type: "object",
      properties: {
        defaultX: {
          type: "number",
          title: "Default X position",
          description: "Canvas X coordinate used when a create tool is called without an explicit x. Default 0 (board centre).",
          default: 0,
        },
        defaultY: {
          type: "number",
          title: "Default Y position",
          description: "Canvas Y coordinate used when a create tool is called without an explicit y. Default 0 (board centre).",
          default: 0,
        },
      },
      required: [],
    },
    credentials: [
      {
        name: "miroCredential",
        type: "miroCredential",
        required: true,
      },
    ],
    capabilities: { isTrigger: false },
  };
}

const definition = createNodeDefinition();

export const MiroBridgeNode = {
  definition,
  executor: MiroBridgeExecutor,
};

export { createNodeDefinition };
