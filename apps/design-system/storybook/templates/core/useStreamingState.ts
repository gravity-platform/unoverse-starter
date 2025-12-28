/**
 * useStreamingState - Hook to check if any response is currently streaming
 *
 * Abstracts the common pattern of checking history for streaming responses.
 */

import { useMemo } from "react";
import type { HistoryEntry } from "./types";
import { StreamingState } from "./types";

/**
 * Check if any response in history is currently streaming
 *
 * @param history - History entries to check
 * @returns true if any response is streaming, false otherwise
 *
 * @example
 * const isStreaming = useStreamingState(history);
 * <ChatInput disabled={isStreaming} />
 */
export function useStreamingState(history: HistoryEntry[]): boolean {
  return useMemo(() => {
    return history.some(
      (entry) => entry.type === "assistant_response" && entry.streamingState === StreamingState.STREAMING
    );
  }, [history]);
}

export default useStreamingState;
