/**
 * Note Node Definition
 * A documentation node for adding notes and comments to workflows
 */

import { getPlatformDependencies, type EnhancedNodeDefinition } from "@gravity-platform/plugin-base";
import NoteExecutor from "./executor";

// Export node type constant
export const NODE_TYPE = "Note";

// Export a function that creates the definition after platform deps are set
export function createNodeDefinition(): EnhancedNodeDefinition {
  const { NodeInputType } = getPlatformDependencies();

  return {
    packageVersion: "1.1.1",
    type: NODE_TYPE,
  isService: false,
  name: "Note",
  description: "Add notes, documentation, and comments to your workflow",
  category: "Flow",
  color: "#fbbf24", // Yellow color for notes
  logoUrl: "/icons/note-icon.svg",

  // Note nodes have no inputs/outputs - they are purely for documentation
  inputs: [],
  outputs: [],

  // Configuration schema for the UI
  configSchema: {
    type: "object",
    properties: {
      content: {
        type: "string",
        title: "Note Content",
        description:
          "Markdown content for the note. Supports full markdown syntax including headers, lists, code blocks, etc.",
        default:
          "# Note\n\nAdd your documentation here...\n\n- Use markdown syntax\n- Create lists\n- Add **bold** or *italic* text\n- Include `code` snippets",
        "ui:widget": "textarea",
        "ui:options": {
          rows: 10,
        },
      },
      backgroundColor: {
        type: "string",
        title: "Background Color",
        description: "Background color for the note",
        default: "#fffbeb",
        "ui:widget": "color",
      },
      fontSize: {
        type: "number",
        title: "Font Size",
        description: "Base font size for the note content",
        default: 14,
        minimum: 10,
        maximum: 24,
      },
      locked: {
        type: "boolean",
        title: "Lock Note",
        description: "Lock the note to prevent moving or resizing",
        default: false,
      },
    },
    required: ["content"],
  },

  // Node capabilities
  capabilities: {
    isTrigger: false,
  },
  };
}

// Export as enhanced node
export const NoteNode = {
  definition: createNodeDefinition(),
  executor: NoteExecutor,
};

// Export for node registry
export const definition = createNodeDefinition();
