import { getPlatformDependencies, type EnhancedNodeDefinition } from "@gravity-platform/plugin-base";
import S3FileContentExecutor from "./executor";

export const NODE_TYPE = "S3FileContent";

function createNodeDefinition(): EnhancedNodeDefinition {
  const { NodeInputType } = getPlatformDependencies();
  
  return {
    packageVersion: "1.1.0",
    type: NODE_TYPE,
    name: "S3 File Content",
    description: "Fetch content of a single S3 file",
    category: "storage",
    logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1749916163/gravity/icons/Amazon-S3-Logo.svg.png",
    color: "#FF9900",

    inputs: [
      {
        name: "file",
        type: NodeInputType.OBJECT,
        description: "File to fetch",
      },
    ],

    outputs: [
      {
        name: "fileContent",
        type: NodeInputType.OBJECT,
        description: "File object with content and download URL",
      },
    ],

    configSchema: {
      type: "object",
      properties: {
        file: {
          type: "object",
          title: "File Object",
          description: "File object with key and bucket properties",
          default: "",
        },
      },
    },

    credentials: [
      {
        name: "awsCredential",
        required: true,
        displayName: "AWS",
        description: "AWS credentials for S3 access",
      },
    ],
  };
}

const definition = createNodeDefinition();

export const S3FileContentNode = {
  definition,
  executor: S3FileContentExecutor,
};

export { createNodeDefinition };
