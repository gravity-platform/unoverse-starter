/**
 * Core template library
 * Re-exports everything for easy importing
 */

// Types
export { StreamingState, type ResponseComponent } from "./types";
export * from "./types";

// Hooks
export { useGravityTemplate } from "./hooks";
export { useAutoScroll } from "./useAutoScroll";
export { useStreamingState } from "./useStreamingState";
export { ScrollableHistory } from "./ScrollableHistory";

// Helpers
export { renderComponent, filterComponents } from "./helpers";

// Focus Mode
export { FocusableWrapper, FocusLayout, useFocusedComponent, withFocusMode } from "./focus";

// Mock client (for Storybook)
export { createMockClient, createMockClients } from "./mockClient";

// Base class
export { GravityTemplate } from "./GravityTemplate";
