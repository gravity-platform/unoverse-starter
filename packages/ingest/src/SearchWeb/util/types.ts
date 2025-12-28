/**
 * Type definitions for SearchWeb node
 */

export interface SearchWebConfig {
  query: string;
  numResults: number;
  numImages: number;
  searchImages: boolean;
  safeSearch: string;
  country: string;
  language: string;
}

export interface SearchWebInput {
  query?: string;
}

export interface SearchWebOutput {
  webResults: Array<{
    title: string;
    url: string;
    source: string;
    snippet?: string;
  }>;
  imageResults: Array<{
    url: string;
    title: string;
    thumbnail?: string;
    source_url?: string;
    source_name?: string;
  }>;
}

// Executor output structure with __outputs wrapper
export interface SearchWebExecutorOutput {
  __outputs: {
    webResults: SearchWebOutput['webResults'];
    imageResults: SearchWebOutput['imageResults'];
  };
}

export interface SearchResult {
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
