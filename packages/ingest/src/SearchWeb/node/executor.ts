import { type NodeExecutionContext } from "@gravity-platform/plugin-base";
import { SearchWebConfig, SearchWebExecutorOutput } from "../util/types";
import { PromiseNode, createLogger } from "../../shared/platform";
import { searchWeb } from "../service/searchWebService";

const NODE_TYPE = "SearchWeb";

export class SearchWebExecutor extends PromiseNode<SearchWebConfig> {
  constructor() {
    super(NODE_TYPE);
  }

  protected async executeNode(
    inputs: Record<string, any>,
    config: SearchWebConfig,
    context: NodeExecutionContext
  ): Promise<SearchWebExecutorOutput> {
    const logger = createLogger("SearchWeb");
    
    // Build credential context for service
    const credentialContext = this.buildCredentialContext(context);
    
    if (!config.query || config.query.trim() === "") {
      throw new Error("Search query is required");
    }
    
    logger.info("Searching web", {
      query: config.query,
      numResults: config.numResults,
      searchImages: config.searchImages,
    });

    try {
      const results = await searchWeb(config, credentialContext);
      
      logger.info("Search completed", {
        webResultsCount: results.webResults.length,
        imageResultsCount: results.imageResults.length,
      });

      // Return results mapped to output connectors
      return {
        __outputs: {
          webResults: results.webResults,
          imageResults: results.imageResults
        }
      };
    } catch (error) {
      logger.error("Search failed", { error });
      throw error;
    }
  }

  /**
   * Build credential context from execution context
   */
  private buildCredentialContext(context: NodeExecutionContext) {
    return {
      credentials: context.credentials || {},
      nodeType: NODE_TYPE,
      workflowId: context.workflow?.id || "",
      executionId: context.executionId || "",
      nodeId: context.nodeId || "",
    };
  }
}
