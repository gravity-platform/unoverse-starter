import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

/**
 * Register generated component nodes dynamically
 */
export async function ingestComponents(api: any) {
  try {
    const nodes = [];
    const srcDir = path.join(__dirname, "..", "..", "src");

    // Check if src directory exists
    if (!fs.existsSync(srcDir)) {
      // Silently skip if no components generated yet
      return {
        total: 0,
        registered: 0,
        components: [],
      };
    }

    // Find all directories with node/index.ts in src folder
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== 'shared' && entry.name !== 'ingestion') {
        const nodePath = path.join(srcDir, entry.name, "node");

        if (fs.existsSync(nodePath)) {
          try {
            const nodeModule = await import(`../../src/${entry.name}/node`);
            const NodeExport = nodeModule[`${entry.name}Node`] || nodeModule.default;

            if (NodeExport) {
              nodes.push(NodeExport);
              api.registerNode(NodeExport);
            }
          } catch (e: any) {
            // Silently skip failed components during development
          }
        }
      }
    }

    return {
      total: nodes.length,
      registered: nodes.length,
      components: nodes.map((n) => n.definition?.name || "Unknown"),
    };
  } catch (error) {
    // Log error but don't crash the server
    throw error;
  }
}
