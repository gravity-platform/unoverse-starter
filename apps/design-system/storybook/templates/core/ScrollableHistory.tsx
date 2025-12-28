/**
 * ScrollableHistory - Wrapper that handles auto-scroll behavior
 *
 * Abstracts away the complexity of:
 * - useAutoScroll hook
 * - Ref attachment
 * - Scroll target positioning
 *
 * Templates just wrap their history content with this component.
 */

import React from "react";
import type { HistoryEntry } from "./types";
import { useAutoScroll } from "./useAutoScroll";

interface ScrollableHistoryProps {
  /** History entries for change detection */
  history: HistoryEntry[];
  /** Whether auto-scroll is enabled */
  enabled?: boolean;
  /** Whether to skip scrolling (e.g., welcome screen) */
  skip?: boolean;
  /** Whether focus mode is currently open */
  isFocusOpen?: boolean;
  /** Content to render */
  children: React.ReactNode;
  /** Optional className for the wrapper */
  className?: string;
}

/**
 * Wrapper component that handles auto-scrolling
 *
 * @example
 * <ScrollableHistory history={history} isFocusOpen={isFocusOpen}>
 *   <ChatHistory history={history} />
 * </ScrollableHistory>
 */
export function ScrollableHistory({
  history,
  enabled = true,
  skip = false,
  isFocusOpen = false,
  children,
  className,
}: ScrollableHistoryProps) {
  const scrollTargetRef = useAutoScroll({
    enabled,
    skip,
    isFocusOpen,
    history,
  });

  return (
    <div className={className}>
      {children}
      {/* Scroll target - invisible div at bottom */}
      <div ref={scrollTargetRef} style={{ height: 0, width: 0 }} />
    </div>
  );
}

export default ScrollableHistory;
