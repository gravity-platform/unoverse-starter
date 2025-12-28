import { getPlatformDependencies, type EnhancedNodeDefinition } from "@gravity-platform/plugin-base";
import { SearchWebExecutor } from "./executor";

export const NODE_TYPE = "SearchWeb";

function createNodeDefinition(): EnhancedNodeDefinition {
  const { NodeInputType } = getPlatformDependencies();
  
  return {
    packageVersion: "1.1.1",
    type: NODE_TYPE,
    name: "Search Web",
    description: "Search the web using SearchAPI.io for web results and images",
    category: "Ingest",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/3128/3128287.png",
    color: "#4285F4",

    inputs: [
      {
        name: "query",
        type: NodeInputType.STRING,
        description: "Search query",
      },
    ],

    outputs: [
      {
        name: "webResults",
        type: NodeInputType.ARRAY,
        description: "Array of web search results",
      },
      {
        name: "imageResults",
        type: NodeInputType.ARRAY,
        description: "Array of image search results",
      },
    ],

    configSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          title: "Search Query",
          description: "Query to search for",
          default: "",
          "ui:field": "template",
        },
        numResults: {
          type: "number",
          title: "Number of Results",
          description: "Number of web results to return",
          default: 20,
          minimum: 1,
          maximum: 100,
        },
        numImages: {
          type: "number",
          title: "Number of Images",
          description: "Number of image results to return",
          default: 10,
          minimum: 0,
          maximum: 50,
          "ui:dependencies": {
            searchImages: true,
          },
        },
        searchImages: {
          type: "boolean",
          title: "Search Images",
          description: "Whether to search for images",
          default: true,
          "ui:widget": "toggle",
        },
        safeSearch: {
          type: "string",
          title: "Safe Search",
          description: "Safe search filter level",
          enum: ["active", "moderate", "off"],
          enumNames: ["Active", "Moderate", "Off"],
          default: "active",
        },
        country: {
          type: "string",
          title: "Country",
          description: "Country code for localized results (e.g., 'us', 'uk', 'ae')",
          default: "us",
        },
        language: {
          type: "string",
          title: "Language",
          description: "Language code for results (e.g., 'en', 'ar')",
          default: "en",
        },
      },
      required: ["query"],
    },

    credentials: [
      {
        name: "searchapiCredential",
        required: true,
        displayName: "SearchAPI",
        description: "SearchAPI.io credentials for web search",
      },
    ],

    capabilities: {
      isTrigger: false,
    },
  };
}

const definition = createNodeDefinition();

export const SearchWebNode = {
  definition,
  executor: SearchWebExecutor,
};

export { createNodeDefinition };
