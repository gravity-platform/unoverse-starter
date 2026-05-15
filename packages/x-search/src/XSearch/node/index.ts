import { type EnhancedNodeDefinition, NodeInputType } from "@gravity-platform/plugin-base";
import XSearchExecutor from "./executor";

function createNodeDefinition(): EnhancedNodeDefinition {
  return {
    packageVersion: "1.0.0",
    type: "XSearch",
    isService: false,
    name: "X Search",
    description: "Search recent X (Twitter) posts and return structured tweet data",
    category: "Ingest",
    color: "#000000",
    logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1777865512/gravity/icons/X_logo.jpg",
    inputs: [
      {
        name: "query",
        type: NodeInputType.STRING,
        description: "Search query (overrides config if provided)",
        required: false,
      },
    ],
    outputs: [
      {
        name: "tweets",
        type: NodeInputType.ARRAY,
        description: "Array of tweet objects",
      },
      {
        name: "resultCount",
        type: NodeInputType.NUMBER,
        description: "Number of tweets returned",
      },
      {
        name: "raw",
        type: NodeInputType.STRING,
        description: "Raw JSON response from X API",
      },
    ],
    configSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          title: "Search Query",
          description: "X search query. Supports: from:user, #hashtag, -exclude, lang:en, OR (no parentheses). Wrap phrases in quotes e.g. \"Miro board\" lang:en -is:retweet",
        },
        maxResults: {
          type: "number",
          title: "Max Results",
          description: "Number of tweets to return (1–100)",
          default: 10,
          minimum: 1,
          maximum: 100,
        },
        tweetFields: {
          type: "string",
          title: "Tweet Fields",
          description: "Comma-separated X API tweet fields to include",
          default: "created_at,public_metrics,author_id",
        },
      },
      required: ["query"],
      "ui:order": ["query", "maxResults", "tweetFields"],
    },
    capabilities: { isTrigger: false },
    serviceConnectors: [],
    credentials: [
      {
        name: "xCredential",
        required: true,
        displayName: "X API Credentials",
        description: "X API v2 Bearer Token",
      },
    ],
  };
}

export const XSearchNode = {
  get definition() {
    return createNodeDefinition();
  },
  executor: XSearchExecutor,
};
