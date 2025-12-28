/**
 * useFocusedComponent - Hook to get focus state and focused component
 *
 * For templates that want more control over focus rendering.
 * Used by FocusLayout.tsx.
 */

import { useMemo } from "react";
import type { GravityClient, ResponseComponent, HistoryEntry, AssistantResponse } from "../types";

/**
 * Find a component in history by ID
 */
function findComponentInHistory(history: HistoryEntry[], componentId: string): ResponseComponent | null {
  for (const entry of history) {
    if (entry.type === "assistant_response") {
      const found = (entry as AssistantResponse).components.find((c: ResponseComponent) => c.id === componentId);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Hook to get focus state and focused component
 * For templates that want more control over focus rendering
 *
 * @example
 * const { isFocusOpen, focusedComponent, closeFocus } = useFocusedComponent(history, client);
 */
export function useFocusedComponent(history: HistoryEntry[], client?: GravityClient) {
  const focusedComponent = useMemo(() => {
    if (!client?.focusState?.focusedComponentId) return null;
    return findComponentInHistory(history, client.focusState.focusedComponentId);
  }, [history, client?.focusState?.focusedComponentId]);

  return {
    isFocusOpen: !!focusedComponent,
    focusedComponent,
    focusState: client?.focusState,
    closeFocus: client?.closeFocus,
  };
}

export default useFocusedComponent;
