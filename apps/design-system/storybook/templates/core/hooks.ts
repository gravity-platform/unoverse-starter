/**
 * Core hooks for Gravity Templates
 */

import type { HistoryEntry, UserMessage, AssistantResponse } from "./types";

/**
 * Hook for working with history entries
 * Provides utility methods for filtering and rendering
 */
export function useGravityTemplate(history: HistoryEntry[]) {
  return {
    getUserMessages: () => history.filter((entry): entry is UserMessage => entry.type === "user_message"),
    getResponses: () => history.filter((entry): entry is AssistantResponse => entry.type === "assistant_response"),
    getByRole: (role: "user" | "assistant") => history.filter((entry) => entry.role === role),
    getLatest: () => history[history.length - 1] || null,
    getFirst: () => history[0] || null,
    getAllComponents: () => {
      return history
        .filter((entry): entry is AssistantResponse => entry.type === "assistant_response")
        .flatMap((response) => response.components);
    },
  };
}
