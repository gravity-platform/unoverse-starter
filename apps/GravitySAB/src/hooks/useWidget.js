import { useState, useCallback } from "react";

let globalSetIsOpen = null;

export function useWidget() {
  const [isOpen, setIsOpen] = useState(false);

  // Store setter globally so we can control from outside if needed
  globalSetIsOpen = setIsOpen;

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}

// Global control functions
export const openWidget = () => globalSetIsOpen?.(true);
export const closeWidget = () => globalSetIsOpen?.(false);
