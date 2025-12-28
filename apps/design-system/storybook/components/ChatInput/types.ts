/**
 * ChatInput Types
 */

// FAQ can be a string or an object with question property
export type FAQ = string | { id?: string; question: string };

export interface Action {
  id?: string;
  label?: string;
  title?: string;
  description?: string;
  image?: string;
  callToAction?: string;
  icon?: string;
  object?: Record<string, any>;
}

export interface Recommendation {
  id: string;
  text: string;
  confidence?: number;
  actionLabel?: string;
}

/**
 * Focus context passed to ChatInput when focus mode is active
 */
export interface FocusContext {
  /** Whether focus mode is currently open */
  isOpen: boolean;
  /** ID of the focused component */
  componentId?: string | null;
  /** Display name for the focused agent */
  agentName?: string | null;
  /** Target trigger node for routing messages */
  targetTriggerNode?: string | null;
  /** Close focus mode */
  close?: () => void;
}

export interface ChatInputProps {
  placeholder?: string;
  onSend?: (message: string) => void;
  disabled?: boolean;
  enableAudio?: boolean;
  isRecording?: boolean;
  onMicrophoneClick?: () => void;
  faqs?: FAQ[];
  actions?: Action[];
  recommendations?: Recommendation[];
  onFaqClick?: (faq: string) => void;
  onActionClick?: (data: any) => void;
  onRecommendationClick?: (recommendation: Recommendation) => void;
  /** Focus mode context - shows pill when isOpen is true */
  focusContext?: FocusContext;
}

export type TabType = "actions" | "recommendations" | "faq" | null;
