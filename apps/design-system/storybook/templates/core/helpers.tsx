/**
 * Core helper functions for Gravity Templates
 */

import React from "react";
import type { ResponseComponent } from "./types";
import { FocusableWrapper } from "./focus";

/**
 * Format relative time for timestamps
 */
export function formatRelativeTime(date: string): string {
  const now = new Date();
  const messageDate = new Date(date);
  const diffMs = now.getTime() - messageDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hr ago`;
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return messageDate.toLocaleDateString();
}

/**
 * Check if component matches a type or category
 * Checks componentType, metadata.category, and nodeId
 */
export function isComponentType(component: ResponseComponent, type: string): boolean {
  const lowerType = type.toLowerCase();

  if (component.componentType?.toLowerCase().includes(lowerType)) {
    return true;
  }

  if (component.metadata?.category?.toLowerCase().includes(lowerType)) {
    return true;
  }

  if (component.nodeId?.toLowerCase().includes(lowerType)) {
    return true;
  }

  return false;
}

/**
 * Filter components by type
 *
 * @example
 * filterComponents(components, { include: ['image'] })
 * filterComponents(components, { exclude: ['image'] })
 * filterComponents(components, { include: ['AIResponse', 'Card', '*'], order: true })
 */
export function filterComponents(
  components: ResponseComponent[],
  options: { include?: string[]; exclude?: string[]; order?: boolean } = {}
): ResponseComponent[] {
  const { include, exclude, order } = options;

  let filtered = components.filter((component) => {
    if (include && include.length > 0) {
      const hasWildcard = include.includes("*");
      if (!hasWildcard) {
        const matches = include.some((type) => isComponentType(component, type));
        if (!matches) return false;
      }
    }

    if (exclude && exclude.length > 0) {
      const matches = exclude.some((type) => isComponentType(component, type));
      if (matches) return false;
    }

    return true;
  });

  if (order && include && include.length > 0) {
    filtered = filtered.sort((a, b) => {
      const aIndex = include.findIndex((type) => type === "*" || isComponentType(a, type));
      const bIndex = include.findIndex((type) => type === "*" || isComponentType(b, type));

      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }

      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      return 0;
    });
  }

  return filtered;
}

/**
 * Render a component from workflow history
 * Handles all the boilerplate: props spreading, nodeId, chatId
 * Automatically wraps focusable components with FocusableWrapper
 *
 * @param component - The component to render
 * @param additionalProps - Extra props to pass to the component
 * @param onOpenFocus - Callback to open focus mode (from client.openFocus)
 * @param focusedComponentId - ID of currently focused component (to set displayState)
 */
export function renderComponent(
  component: ResponseComponent,
  additionalProps?: Record<string, any>,
  onOpenFocus?: (componentId: string, targetTriggerNode: string | null, chatId: string | null) => void,
  focusedComponentId?: string | null
) {
  const { Component, props, id, nodeId, chatId } = component;
  if (!Component) return null;

  // Check if component is focusable (set by workflow designer)
  const isFocusable = props?.focusable === true;

  // Determine displayState: 'focused' if this component is focused, 'inline' if focusable but not focused
  const isFocused = focusedComponentId === id;
  const displayState = isFocusable ? (isFocused ? "focused" : "inline") : undefined;

  const renderedComponent = (
    <Component key={id} {...props} nodeId={nodeId} chatId={chatId} displayState={displayState} {...additionalProps} />
  );

  // Only show FocusableWrapper (expand button) when NOT focused
  if (isFocusable && !isFocused) {
    return (
      <FocusableWrapper key={id} component={component} onOpenFocus={onOpenFocus}>
        {renderedComponent}
      </FocusableWrapper>
    );
  }

  return renderedComponent;
}
