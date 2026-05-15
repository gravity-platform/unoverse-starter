import type { GravityTemplateProps } from "../core";

export type ConnectionStatus = "idle" | "connecting" | "connected" | "error" | "ended";

export interface MiroChatProps extends GravityTemplateProps {
  assistantName?: string;
  assistantSubtitle?: string;
  logoUrl?: string;
  brandName?: string;
  _storybook_connected?: boolean;
  _storybook_speaking?: boolean;
  _storybook_listening?: boolean;
}
