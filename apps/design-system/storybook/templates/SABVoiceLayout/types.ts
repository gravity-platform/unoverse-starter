/**
 * Types for SABVoiceLayout template
 */

import type { GravityTemplateProps } from "../core";

export type ConnectionStatus = "idle" | "connecting" | "connected" | "error" | "ended";

export interface SABVoiceLayoutProps extends GravityTemplateProps {
  /** Assistant name displayed in UI */
  assistantName?: string;
  /** Assistant subtitle */
  assistantSubtitle?: string;
  /** Logo URL */
  logoUrl?: string;
  /** Brand name */
  brandName?: string;
  /** Storybook: simulate connected state */
  _storybook_connected?: boolean;
  /** Storybook: simulate assistant speaking */
  _storybook_speaking?: boolean;
  /** Storybook: simulate user speaking (mic active) */
  _storybook_listening?: boolean;
}
