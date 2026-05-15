import { type EnhancedNodeDefinition, NodeInputType } from "@gravity-platform/plugin-base";
import OpenAIAgentExecutor from "./executor";

const definition: EnhancedNodeDefinition = {
  type: "OpenAIAgent",
  isService: false,
  name: "OpenAI Agent",
  description: "Multi-turn agent powered by OpenAI Agents SDK with MCP tool calling and streaming",
  category: "AI",
  color: "#2F6F66",
  logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1749262616/gravity/icons/ChatGPT-Logo.svg.webp",

  inputs: [
    {
      name: "signal",
      type: NodeInputType.OBJECT,
      description: "Data from previous nodes that can be referenced in templates",
    },
  ],

  outputs: [
    {
      name: "progress",
      type: NodeInputType.STRING,
      description: "Tool/skill call log (emitted in real-time)",
    },
    {
      name: "chunk",
      type: NodeInputType.STRING,
      description: "Streaming LLM text response (emitted in real-time)",
    },
    {
      name: "reasoning",
      type: NodeInputType.STRING,
      description: "LLM reasoning/thinking (separate output)",
    },
    {
      name: "mcpResult",
      type: NodeInputType.OBJECT,
      description: "MCP tool results",
    },
    {
      name: "text",
      type: NodeInputType.STRING,
      description: "Final synthesized response",
    },
  ],

  configSchema: {
    type: "object",
    properties: {
      model: {
        type: "string",
        title: "Model",
        description: "Select the OpenAI model",
        enum: ["gpt-5.5", "gpt-5.4-mini", "gpt-5.2", "gpt-5.2-pro"],
        enumNames: [
          "GPT-5.5 (Latest)",
          "GPT-5.4 Mini (Fast)",
          "GPT-5.2",
          "GPT-5.2 Pro (Deep reasoning)",
        ],
        default: "gpt-5.5",
      },
      agentName: {
        type: "string",
        title: "Agent Name",
        description: "Name for this agent (appears in traces)",
        default: "GravityAgent",
      },
      maxTurns: {
        type: "number",
        title: "Max Turns",
        description: "Maximum agent loop iterations (tool calls + responses)",
        default: 15,
        minimum: 1,
        maximum: 50,
      },
      enablePreambles: {
        type: "boolean",
        title: "Enable Preambles",
        description: "Let the model explain why before calling tools",
        default: true,
      },
      enableMarkdown: {
        type: "boolean",
        title: "Enable Markdown Formatting",
        description: "Format output with Markdown",
        default: false,
      },
      systemPrompt: {
        type: "string",
        title: "Instructions",
        description: "Agent instructions (system prompt). Supports template syntax like {{input.fieldName}}",
        default: "",
        "ui:field": "template",
        "ui:ai": {
          editable: true,
        },
      },
      prompt: {
        type: "string",
        title: "Input",
        description: "User input message. Supports template syntax like {{input.fieldName}}",
        default: "",
        "ui:field": "template",
        "ui:ai": {
          editable: true,
        },
      },
    },
    required: ["model", "prompt"],
    "ui:order": [
      "model",
      "agentName",
      "maxTurns",
      "enablePreambles",
      "enableMarkdown",
      "systemPrompt",
      "prompt",
    ],
  },

  credentials: [
    {
      name: "openAICredential",
      required: true,
      displayName: "OpenAI API",
      description: "OpenAI API credentials for authentication",
    },
  ],

  serviceConnectors: [
    {
      name: "mcpService",
      description: "MCP service connector - automatic schema discovery",
      serviceType: "mcp",
      isService: false,
    },
  ],
};

export const OpenAIAgentNode = {
  definition,
  executor: OpenAIAgentExecutor,
};

export { definition };
