import { getPlatformDependencies, type EnhancedNodeDefinition } from "@gravity-platform/plugin-base";
import PineconeServiceExecutor from "./executor";

export const NODE_TYPE = "PineconeService";

function createNodeDefinition(): EnhancedNodeDefinition {
  const { NodeInputType } = getPlatformDependencies();
  
  return {
    packageVersion: "1.1.0",
    type: NODE_TYPE,
    name: "Pinecone Service",
    description: "Vector database service provider for semantic search and storage",
    category: "Knowledge",
    color: "#0080FF",
    logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1749139513/gravity/icons/pinecone.png",
    template: "service", // Options: "standard", "service", "mini"
    inputs: [],
    outputs: [],
    serviceConnectors: [
      {
        name: "vectorService",
        description: "Provides vector database operations",
        serviceType: "vector",
        methods: ["upsert", "query", "delete", "fetch", "update"],
        isService: true, // This node PROVIDES vector services to others
      },
    ],
    configSchema: {
      type: "object",
      properties: {
        indexName: {
          type: "string",
          description: "Pinecone index name",
          default: "",
        },
        namespace: {
          type: "string",
          description: "Default namespace within the index",
          default: "",
        },
      },
      required: ["indexName"],
    },
    credentials: [
      {
        name: "pineconeCredential",
        required: true,
        displayName: "Pinecone Credentials",
        description: "Pinecone API key for accessing the vector database",
      },
    ],
    capabilities: {
      isTrigger: false,
    },
    services: {
      provides: ["vector:upsertVectors", "vector:queryVectors", "vector:deleteVectors", "vector:describeIndexStats"],
      requires: {},
    },
  };
}

const definition = createNodeDefinition();

export const PineconeServiceNode = {
  definition,
  executor: PineconeServiceExecutor,
};

export { createNodeDefinition };
