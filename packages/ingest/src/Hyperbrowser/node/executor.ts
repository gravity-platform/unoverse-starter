import { type NodeExecutionContext } from "@gravity-platform/plugin-base";
import { HyperbrowserConfig, HyperbrowserExecutorOutput } from "../util/types";
import { PromiseNode, createLogger } from "../../shared/platform";
import { crawlWebPage, CrawlOptions } from "../service/hyperbrowserService";

const NODE_TYPE = "Hyperbrowser";

export class HyperbrowserExecutor extends PromiseNode<HyperbrowserConfig> {
  constructor() {
    super(NODE_TYPE);
  }

  protected async executeNode(
    inputs: Record<string, any>,
    config: HyperbrowserConfig,
    context: NodeExecutionContext
  ): Promise<HyperbrowserExecutorOutput> {
    const logger = createLogger("Hyperbrowser");
    
    // Build credential context for service
    const credentialContext = this.buildCredentialContext(context);

    // Build crawl options
    const crawlOptions: CrawlOptions = {
      url: config.url,
      extractionMode: "links",
      formats: ["links"],
      sessionOptions: {
        acceptCookies: true,
        useStealth: true,
      },
    };

    // Add optional parameters only if they have values
    if (config.linkSelector) {
      crawlOptions.linkSelector = config.linkSelector;
    }
    if (config.tableSelector) {
      crawlOptions.tableSelector = config.tableSelector;
    }
    if (config.maxPages) {
      crawlOptions.maxPages = config.maxPages;
    }

    // Call the crawl service with configuration
    const result = await crawlWebPage(
      crawlOptions,
      credentialContext
    );

    // Wrap in __outputs pattern for multi-output routing
    return {
      __outputs: {
        links: result.links || [],
        content: result.content,
        metadata: {
          url: result.metadata?.url || config.url,
          totalLinks: result.metadata?.totalLinks || 0,
          totalTables: result.metadata?.totalTables || 0,
          pagesScraped: result.metadata?.pagesScraped || 1,
          extractionMode: result.metadata?.extractionMode || "links",
          timestamp: result.metadata?.timestamp || new Date().toISOString()
        }
      }
    };
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
