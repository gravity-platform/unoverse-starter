import { getPlatformDependencies, type EnhancedNodeDefinition } from "@gravity-platform/plugin-base";
import PineconeUploadExecutor from "./executor";

export const NODE_TYPE = "PineconeUpload";

function createNodeDefinition(): EnhancedNodeDefinition {
  const { NodeInputType } = getPlatformDependencies();
  
  return {
    packageVersion: "1.1.0",
    type: NODE_TYPE,
    name: "Pinecone Upload",
    description: "Upload a single vector to Pinecone database",
    category: "Knowledge",
    color: "#8B5CF6",
    logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1749137717/gravity/icons/pinecone.webp",
    inputs: [
      {
        name: "signal",
        type: NodeInputType.STRING,
        description: "Text to generate embeddings for",
      },
      {
        name: "metadata",
        type: NodeInputType.OBJECT,
        description: "Metadata to store with the vector",
      },
    ],
    outputs: [
      {
        name: "output",
        type: NodeInputType.OBJECT,
        description:
          "Detailed upload report including vector IDs, chunk statistics, URL/title metadata, and upload summary",
      },
    ],
    serviceConnectors: [
      {
        name: "embeddingService",
        description: "Embedding service connection - needs createEmbedding method",
        serviceType: "embedding",
        methods: ["createEmbedding"],
        isService: false, // This node CONSUMES embedding services from others
      },
    ],
    configSchema: {
      type: "object",
      properties: {
        vectorId: {
          type: "string",
          title: "Vector ID",
          description: "Unique ID for the vector. If this ID already exists, it will overwrite the existing vector.",
          default: "",
          "ui:field": "template",
        },
        text: {
          type: "string",
          title: "Text",
          description: "Text to generate embeddings for",
          default: "",
          "ui:field": "template",
        },
        metadata: {
          type: "object",
          title: "Metadata",
          description: "Optional metadata to store with the vector (JSON format)",
          default: "",
          "ui:field": "template",
        },
        indexName: {
          type: "string",
          title: "Index Name",
          description: "Pinecone index name to upload vector to",
          default: "",
        },
        namespace: {
          type: "string",
          title: "Namespace",
          description: "Optional namespace to upload to",
          default: "default",
          "ui:field": "template",
        },
        enableChunking: {
          type: "boolean",
          title: "Enable Text Chunking",
          description: "Split long text into smaller chunks for better search results",
          default: false,
          "ui:widget": "toggle",
        },
        chunkingStrategy: {
          type: "string",
          title: "Chunking Strategy",
          description: "How to split the text into chunks",
          enum: ["fixed", "sentence", "paragraph"],
          enumNames: ["Fixed Size", "By Sentence", "By Paragraph"],
          default: "fixed",
          "ui:dependencies": {
            enableChunking: true,
          },
        },
        maxChunkSize: {
          type: "number",
          title: "Max Chunk Size",
          description: "Maximum number of characters per chunk",
          default: 1000,
          minimum: 100,
          maximum: 4000,
          "ui:dependencies": {
            enableChunking: true,
          },
        },
        chunkOverlap: {
          type: "number",
          title: "Chunk Overlap",
          description: "Number of characters to overlap between chunks",
          default: 200,
          minimum: 0,
          maximum: 500,
          "ui:dependencies": {
            enableChunking: true,
          },
        },
      },
      required: ["indexName", "vectorId", "text"],
    },
    credentials: [
      {
        name: "pineconeCredential",
        required: true,
        displayName: "Pinecone API Key",
        description: "Pinecone API credentials for database access",
      },
    ],
    capabilities: {
      isTrigger: false,
    },
    services: {
      provides: [],
      requires: {},
    },
  };
}

const definition = createNodeDefinition();

export const PineconeUploadNode = {
  definition,
  executor: PineconeUploadExecutor,
};

export { createNodeDefinition };
