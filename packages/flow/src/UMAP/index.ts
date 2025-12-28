/**
 * UMAP Node Definition
 * Performs UMAP dimensionality reduction on high-dimensional vectors
 */

import { getPlatformDependencies, type EnhancedNodeDefinition } from "@gravity-platform/plugin-base";
import UMAPExecutor from "./executor";

// Export node type constant
export const NODE_TYPE = "UMAP";

// Export a function that creates the definition after platform deps are set
export function createNodeDefinition(): EnhancedNodeDefinition {
  const { NodeInputType } = getPlatformDependencies();

  return {
    packageVersion: "1.1.1",
    type: NODE_TYPE,
  isService: false,
  name: "UMAP",
  description: "Reduce high-dimensional vectors to 3D coordinates using UMAP",
  category: "Flow",
  color: "#8b5cf6", // Purple color for ML/transformation
  logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1753958030/gravity/icons/uMapIcon.png",
  inputs: [
    {
      name: "embedding",
      type: NodeInputType.ARRAY,
      description: "High-dimensional vector array",
    },
  ],
  outputs: [
    {
      name: "result",
      type: NodeInputType.OBJECT,
      description: "UMAP result with 3D coordinates, cluster ID, and color (properties: coordinates[x,y,z], clusterId, color)",
    },
  ],
  configSchema: {
    type: "object",
    properties: {
      vector: {
        type: "object",
        title: "Vector",
        description: "Vector array to embed",
        default: "",
        "ui:field": "template",
      },
      nComponents: {
        type: "number",
        title: "Components",
        description: "Number of dimensions to reduce to",
        default: 3,
        minimum: 1,
        maximum: 3,
      },
      nNeighbors: {
        type: "number",
        title: "Neighbors",
        description: "Number of neighbors for UMAP",
        default: 15,
        minimum: 2,
        maximum: 100,
      },
      minDist: {
        type: "number",
        title: "Min Distance",
        description: "Minimum distance between points in low-dimensional space",
        default: 0.1,
        minimum: 0,
        maximum: 1,
      },
    },
  },
  // Declare capabilities
  capabilities: {
    isTrigger: false,
  },
  };
}

// Export as enhanced node
export const UMAPNode = {
  definition: createNodeDefinition(),
  executor: UMAPExecutor,
};

// Export for node registry
export const definition = createNodeDefinition();
