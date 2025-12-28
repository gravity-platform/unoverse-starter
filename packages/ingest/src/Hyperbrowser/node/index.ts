import { getPlatformDependencies, type EnhancedNodeDefinition } from "@gravity-platform/plugin-base";
import { HyperbrowserExecutor } from "./executor";

export const NODE_TYPE = "Hyperbrowser";

function createNodeDefinition(): EnhancedNodeDefinition {
  const { NodeInputType } = getPlatformDependencies();
  
  return {
    packageVersion: "1.1.1",
    type: NODE_TYPE,
    name: "Hyperbrowser",
    description: "Web scraper that extracts links and content from websites using Hyperbrowser SDK",
    category: "Ingest",
    logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1751883548/gravity/icons/HyperBrowser.svg",
    color: "#FF6B6B",

    inputs: [
      {
        name: "signal",
        type: NodeInputType.STRING,
        description: "URL to scrape",
      },
    ],

    outputs: [
      {
        name: "links",
        type: NodeInputType.ARRAY,
        description: "Array of extracted links with metadata",
      },
      {
        name: "content",
        type: NodeInputType.OBJECT,
        description: "Scraped page content in various formats",
      },
      {
        name: "metadata",
        type: NodeInputType.OBJECT,
        description: "Page metadata and scraping statistics",
      },
    ],

    configSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          title: "URL",
          description: "The URL to scrape for links",
          default: "",
          "ui:field": "template",
        },
        maxPages: {
          type: "number",
          title: "Max Pages",
          description: "Maximum number of pages to crawl (for pagination)",
          default: 10,
          minimum: 1,
          maximum: 100,
        },
        linkSelector: {
          type: "string",
          title: "Link Selector",
          description: "CSS selector for links to extract (optional)",
          placeholder: "a[href], adgm-table-cell[href]",
        },
        tableSelector: {
          type: "string",
          title: "Table Selector",
          description: "CSS selector for tables to extract (optional)",
          placeholder: "table, .data-table, #results-table",
        },
      },
      required: ["url"],
    },

    credentials: [
      {
        name: "hyperbrowserCredential",
        required: true,
        displayName: "Hyperbrowser API",
        description: "Hyperbrowser API credentials for web scraping",
      },
    ],

    capabilities: {
      isTrigger: false,
    },
  };
}

const definition = createNodeDefinition();

export const HyperbrowserNode = {
  definition,
  executor: HyperbrowserExecutor,
};

export { createNodeDefinition };
