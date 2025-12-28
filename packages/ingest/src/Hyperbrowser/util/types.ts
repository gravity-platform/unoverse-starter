/**
 * Type definitions for Hyperbrowser node
 */

export interface HyperbrowserConfig {
  url: string;
  maxPages?: number;
  linkSelector?: string;
  tableSelector?: string;
}

export interface ExtractedLink {
  text: string;
  href: string;
  absoluteUrl: string;
}

export interface HyperbrowserLink {
  text: string;
  href: string;
  absoluteUrl: string;
}

export type ExtractedTable = Record<string, {
  text: string;
  href: string | null;
  absoluteUrl: string | null;
}>;

export interface HyperbrowserOutput {
  links: ExtractedLink[];
  content: any;
  metadata: {
    url: string;
    totalLinks: number;
    totalTables: number;
    pagesScraped: number;
    extractionMode: string;
    timestamp: string;
  };
}

// Executor output structure with __outputs wrapper for multi-output routing
export interface HyperbrowserExecutorOutput {
  __outputs: {
    links: ExtractedLink[];
    content: any;
    metadata: HyperbrowserOutput['metadata'];
  };
}
