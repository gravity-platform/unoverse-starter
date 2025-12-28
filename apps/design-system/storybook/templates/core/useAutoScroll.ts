/**
 * useAutoScroll - Simple auto-scroll hook
 *
 * Uses ResizeObserver to scroll when content changes.
 * Simple and reliable.
 */

import { useEffect, useRef, RefObject } from "react";
import type { HistoryEntry } from "./types";

interface UseAutoScrollOptions {
  enabled?: boolean;
  skip?: boolean;
  isFocusOpen?: boolean;
  history: HistoryEntry[];
}

export function useAutoScroll({
  enabled = true,
  skip = false,
  isFocusOpen = false,
}: UseAutoScrollOptions): RefObject<HTMLDivElement> {
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || skip || isFocusOpen) return;
    if (!scrollTargetRef.current) return;

    // Find scrollable parent
    let scrollContainer: HTMLElement | null = scrollTargetRef.current.parentElement;
    while (scrollContainer && scrollContainer !== document.body) {
      const style = window.getComputedStyle(scrollContainer);
      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        break;
      }
      scrollContainer = scrollContainer.parentElement;
    }

    if (!scrollContainer) return;

    // Scroll to bottom when content changes
    const observer = new ResizeObserver(() => {
      scrollContainer!.scrollTo({ top: scrollContainer!.scrollHeight, behavior: "smooth" });
    });

    // Observe the content area
    const content = scrollTargetRef.current.parentElement;
    if (content) {
      observer.observe(content);
    }

    // Initial scroll
    scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: "instant" });

    return () => observer.disconnect();
  }, [enabled, skip, isFocusOpen]);

  return scrollTargetRef;
}

export default useAutoScroll;
