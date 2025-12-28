/**
 * Suggestions Node Definition
 * Publishes FAQs, Actions, and Recommendations to the client state
 */

import { getPlatformDependencies, type EnhancedNodeDefinition } from "@gravity-platform/plugin-base";
import SuggestionsExecutor from "./executor";

// Export node type constant
export const NODE_TYPE = "Suggestions";

// Export a function that creates the definition after platform deps are set
export function createNodeDefinition(): EnhancedNodeDefinition {
  const { NodeInputType } = getPlatformDependencies();

  return {
    packageVersion: "1.1.1",
    type: NODE_TYPE,
    isService: false,
    name: "Suggestions",
    description: "Publish FAQs, Actions, and Recommendations to the client UI",
    category: "Flow",
    color: "#8B5CF6", // Purple for suggestions/AI
    logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1751366180/gravity/icons/gravityIcon.png",

    inputs: [
      {
        name: "signal",
        type: NodeInputType.ANY,
        description: "Signal containing suggestions data",
      },
    ],

    outputs: [
      {
        name: "suggestions",
        type: NodeInputType.OBJECT,
        description: "The suggestions object that was published",
      },
    ],

    configSchema: {
      type: "object",
      properties: {
        faqs: {
          type: "object",
          title: "FAQs",
          description: "Static FAQs (can be overridden by input)",
          "ui:field": "template",
        },
        actions: {
          type: "object",
          title: "Actions",
          description: "Static Actions (can be overridden by input)",
          "ui:field": "template",
        },
        recommendations: {
          type: "object",
          title: "Recommendations",
          description: "Static Recommendations (can be overridden by input)",
          "ui:field": "template",
        },
      },
      required: [],
    },
  };
}

// Export as enhanced node
export const SuggestionsNode = {
  definition: createNodeDefinition(),
  executor: SuggestionsExecutor,
};

// Export for node registry
export const definition = createNodeDefinition();
