import { createLogger, getNodeCredentials } from "../../shared/platform";
import { HyperbrowserConfig, HyperbrowserOutput, HyperbrowserLink, ExtractedLink } from "../util/types";

// Simplified types for the service layer
interface SessionOptions {
  acceptCookies?: boolean;
  useStealth?: boolean;
  useProxy?: boolean;
  solveCaptchas?: boolean;
  adblock?: boolean;
}

export interface CrawlOptions {
  url: string;
  extractionMode?: "links" | "content" | "both";
  linkSelector?: string;
  tableSelector?: string;
  waitForSelector?: string;
  maxPages?: number;
  formats?: Array<"markdown" | "html" | "text" | "links" | "screenshot">;
  sessionOptions?: SessionOptions;
}

export interface CrawlResult {
  links?: HyperbrowserLink[];
  content?: string[];
  metadata?: {
    url: string;
    title?: string;
    description?: string;
    extractionMode: string;
    pagesScraped: number;
    timestamp: string;
    totalLinks?: number;
    totalTables?: number;
  };
}

/**
 * Get Hyperbrowser configuration from context
 */
async function getHyperbrowserConfig(context: any) {
  const credentials = await getNodeCredentials(context, "hyperbrowserCredential");
  const apiKey = credentials?.apiKey;
  
  if (!apiKey) {
    throw new Error("Hyperbrowser API key not found in credentials");
  }

  return {
    apiKey,
    baseUrl: "https://api.hyperbrowser.ai/v1",
  };
}

/**
 * High-level crawl operation that orchestrates scraping and extraction
 */
export async function crawlWebPage(
  options: CrawlOptions,
  context: any
): Promise<CrawlResult> {
  const logger = createLogger("HyperbrowserService");
  const { apiKey, baseUrl } = await getHyperbrowserConfig(context);
  
  const {
    url,
    extractionMode = "both",
    linkSelector,
    tableSelector,
    waitForSelector,
    maxPages = 1,
    formats = ["markdown"],
    sessionOptions = {}
  } = options;

  logger.info("Starting Hyperbrowser crawl", { url, extractionMode });

  const allLinks: ExtractedLink[] = [];
  const allContent: any[] = [];
  let pagesScraped = 0;

  // Build session options with defaults
  const fullSessionOptions: SessionOptions = {
    useStealth: sessionOptions.useStealth || false,
    useProxy: sessionOptions.useProxy || false,
    solveCaptchas: sessionOptions.solveCaptchas || false,
    adblock: true,
    acceptCookies: sessionOptions.acceptCookies || false,
  };

  try {
    // Prepare request payload
    const requestPayload = {
      url,
      extractionMode,
      linkSelector,
      tableSelector,
      waitForSelector,
      maxPages,
      formats,
      sessionOptions: fullSessionOptions,
    };

    // Make API request to Hyperbrowser
    const response = await fetch(`${baseUrl}/crawl`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hyperbrowser API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json() as any;

    // Process links from the response
    if (result.links && Array.isArray(result.links)) {
      allLinks.push(...result.links.map((link: any) => ({
        text: link.text || "",
        href: link.href || "",
        absoluteUrl: link.absoluteUrl || link.href || "",
      })));
    }

    // Process content from the response
    if (result.content) {
      if (Array.isArray(result.content)) {
        allContent.push(...result.content);
      } else {
        allContent.push(result.content);
      }
    }

    pagesScraped = result.pagesScraped || 1;

    logger.info("Hyperbrowser crawl completed", {
      linksFound: allLinks.length,
      contentPieces: allContent.length,
      pagesScraped,
    });

    return {
      links: allLinks,
      content: allContent,
      metadata: {
        url,
        totalLinks: allLinks.length,
        totalTables: 0, // Not implemented in this simplified version
        pagesScraped,
        extractionMode,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    logger.error("Hyperbrowser crawl failed", { 
      url,
      error: error.message 
    });
    throw new Error(`Hyperbrowser crawl failed: ${error.message}`);
  }
}
