/**
 * GravityTemplate - Base class for class-based templates
 * Most templates use functional components with hooks instead
 */

import React from "react";
import type { GravityTemplateProps, HistoryEntry, UserMessage, AssistantResponse } from "./types";

/**
 * Base GravityTemplate component (class-based)
 * For functional templates, use client.sendMessage() and client.history.entries directly
 */
export abstract class GravityTemplate<
  P extends GravityTemplateProps = GravityTemplateProps
> extends React.Component<P> {
  protected getUserMessages(): UserMessage[] {
    return (
      (this.props as any).history?.filter(
        (entry: HistoryEntry): entry is UserMessage => entry.type === "user_message"
      ) || []
    );
  }

  protected getResponses(): AssistantResponse[] {
    return (
      (this.props as any).history?.filter(
        (entry: HistoryEntry): entry is AssistantResponse => entry.type === "assistant_response"
      ) || []
    );
  }

  protected getByRole(role: "user" | "assistant"): HistoryEntry[] {
    return (this.props as any).history?.filter((entry: HistoryEntry) => entry.role === role) || [];
  }

  protected getLatest(): HistoryEntry | null {
    const history = (this.props as any).history || [];
    return history[history.length - 1] || null;
  }

  protected get isStreaming(): boolean {
    return (this.props as any).isStreaming || this.props.workflowState === "WORKFLOW_STARTED";
  }

  protected get workflowState(): "WORKFLOW_STARTED" | "WORKFLOW_COMPLETED" | null {
    return this.props.workflowState || null;
  }

  protected get isWorkflowCompleted(): boolean {
    return this.props.workflowState === "WORKFLOW_COMPLETED";
  }

  protected sendMessage(message: string): void {
    (this.props as any).onSend?.(message);
  }

  abstract render(): React.ReactNode;
}

/**
 * Functional component interface
 */
export interface GravityTemplateFn<P extends GravityTemplateProps = GravityTemplateProps> {
  (props: P): React.ReactElement | null;
}
