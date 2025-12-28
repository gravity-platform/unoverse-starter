/**
 * OpenAIStructuredOutput - PromiseNode for Structured Extraction
 *
 * Uses the OpenAI Responses API with JSON schema for structured extraction.
 * Designed for GPT-5 models which support the Responses API with strict schemas.
 *
 * Key features:
 * - Uses Responses API (not Chat Completions)
 * - Strict JSON schema enforcement
 * - Returns parsed structured data
 */

import { NodeInputType, type EnhancedNodeDefinition } from "@gravity-platform/plugin-base";
import OpenAIStructuredOutputExecutor from "./executor";

const definition: EnhancedNodeDefinition = {
  type: "OpenAIStructuredOutput",
  name: "GPT-5 Structured Output",
  description: "Extract structured data using GPT-5 Responses API with JSON schema",
  category: "AI",
  color: "#2F6F66",
  logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1749262616/gravity/icons/ChatGPT-Logo.svg.webp",

  inputs: [
    {
      name: "content",
      type: NodeInputType.STRING,
      description: "Content to extract structured data from",
    },
    {
      name: "schema",
      type: NodeInputType.OBJECT,
      description: "JSON schema for structured output",
    },
  ],

  outputs: [
    {
      name: "result",
      type: NodeInputType.OBJECT,
      description: "Extracted structured data matching the schema",
    },
    {
      name: "usage",
      type: NodeInputType.OBJECT,
      description: "Token usage information",
    },
  ],

  configSchema: {
    type: "object",
    properties: {
      model: {
        type: "string",
        title: "Model",
        description: "GPT-5 model to use for structured extraction",
        enum: ["gpt-5.1", "gpt-5.1-mini", "gpt-5.1-nano"],
        enumNames: ["GPT-5.1 (Best)", "GPT-5.1 Mini (Fast)", "GPT-5.1 Nano (Fastest)"],
        default: "gpt-5.1",
      },
      instructions: {
        type: "string",
        title: "Instructions",
        description: "System instructions for extraction",
        default: "Extract structured information from the provided content.",
        "ui:widget": "textarea",
      },
      schemaName: {
        type: "string",
        title: "Schema Name",
        description: "Name for the JSON schema",
        default: "extraction",
      },
    },
    required: ["model"],
  },

  credentials: [
    {
      name: "openAICredential",
      required: true,
      displayName: "OpenAI Credentials",
      description: "OpenAI API key for accessing GPT-5",
    },
  ],
};

export const OpenAIStructuredOutputNode = {
  definition,
  executor: OpenAIStructuredOutputExecutor,
};

export { definition };
