import { createLogger, getNodeCredentials } from "../../shared/platform";
import { SearchWebConfig } from "../util/types";

export interface WebResult {
  title: string;
  url: string;
  source: string;
  snippet?: string;
}

export interface ImageResult {
  url: string;
  title: string;
  thumbnail?: string;
  source_url?: string;
  source_name?: string;
}

export interface SearchWebOutput {
  webResults: WebResult[];
  imageResults: ImageResult[];
}

/**
 * SearchWebSerp implementation adapted for GravityWorkflow
 */
const SearchWebSerp = (apiKey: string) => {
  /**
   * Main search function
   */
  const search = async (query: string, params: any = {}) => {
    try {
      const searchParams = new URLSearchParams({
        engine: "google",
        q: query,
        gl: params.gl || "us",
        hl: params.hl || "en",
        num: params.num || 10,
        safe: params.safe || "active",
        api_key: apiKey,
        ...params,
      });

      const response = await fetch(
        `https://www.searchapi.io/api/v1/search?${searchParams}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`SearchAPI error: ${response.statusText}`);
      }

      const results = await response.json();
      return results;
    } catch (error: any) {
      console.error(`Search error:`, error);
      return { error: error.message };
    }
  };

  /**
   * Dedicated image search function
   */
  const searchImages = async (query: string, params: any = {}) => {
    try {
      const searchParams = new URLSearchParams({
        engine: "google_images",
        q: query,
        api_key: apiKey,
        num: params.num || 10,
        safe: params.safe || "active",
        size: "large",
        ...params,
      });

      const response = await fetch(
        `https://www.searchapi.io/api/v1/search?${searchParams}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`SearchAPI Images error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        ...(data as any),
        images:
          (data as any).images?.map((img: any) => ({
            url: img.original.link,
            thumbnail: img.thumbnail,
            source_url: img.source.link,
            title: img.title,
            source_name: img.source.name,
            dimensions:
              img.original.width && img.original.height
                ? {
                    width: img.original.width,
                    height: img.original.height,
                  }
                : null,
          })) || [],
      };
    } catch (error: any) {
      console.error(`Image search error:`, error);
      return { error: error.message };
    }
  };

  return {
    search,
    searchImages,
  };
};

/**
 * Search the web using SearchAPI.io
 */
export async function searchWeb(
  config: SearchWebConfig,
  context: any
): Promise<SearchWebOutput> {
  const logger = createLogger("SearchWeb");
  logger.info("Starting web search", { query: config.query });

  const credentials = await getNodeCredentials(context, "searchapiCredential");
  const apiKey = credentials?.apiKey;

  if (!apiKey) {
    throw new Error("SearchAPI API key not found in credentials");
  }

  const searcher = SearchWebSerp(apiKey);

  // Search web results
  const webSearchParams = {
    num: config.numResults,
    gl: config.country,
    hl: config.language,
    safe: config.safeSearch,
  };

  logger.info("Searching web", webSearchParams);
  const webResults: any = await searcher.search(config.query, webSearchParams);

  if (webResults.error) {
    throw new Error(`Web search failed: ${webResults.error}`);
  }

  // Process web results
  const processedWebResults: WebResult[] = (webResults.organic_results || []).map((result: any) => ({
    title: result.title || "",
    url: result.link || "",
    source: result.source || "",
    snippet: result.snippet || "",
  }));

  logger.info(`Found ${processedWebResults.length} web results`);

  // Search images if enabled
  let processedImageResults: ImageResult[] = [];
  
  if (config.searchImages && config.numImages > 0) {
    logger.info("Searching images", { num: config.numImages });
    
    const imageResults = await searcher.searchImages(config.query, {
      num: config.numImages,
      safe: config.safeSearch,
    });

    if (!imageResults.error && imageResults.images) {
      processedImageResults = imageResults.images.slice(0, config.numImages).map((img: any) => ({
        url: img.url,
        title: img.title || "",
        thumbnail: img.thumbnail?.link || img.thumbnail || "",
        source_url: img.source_url || "",
        source_name: img.source_name || "",
      }));
      
      logger.info(`Found ${processedImageResults.length} image results`);
    }
  }

  return {
    webResults: processedWebResults,
    imageResults: processedImageResults,
  };
}
