import type { GravityTemplateProps } from "../core";

/**
 * Amazon Connect Configuration
 */
export interface AmazonConnectConfig {
  /** API Gateway endpoint for StartChatContact */
  apiGatewayEndpoint: string;
  /** Amazon Connect contact flow ID */
  contactFlowId: string;
  /** Amazon Connect instance ID */
  instanceId: string;
  /** AWS region for Amazon Connect */
  region: string;
}

/**
 * Connection status for live agent chat
 */
export type ConnectionStatus = "idle" | "connecting" | "connected" | "disconnected" | "ended" | "error";

/**
 * Customer info for initiating chat
 */
export interface CustomerInfo {
  name: string;
  email?: string;
}

/**
 * SABLiveChatLayout Props
 */
export interface SABLiveChatLayoutProps extends GravityTemplateProps {
  placeholder?: string;
  autoScroll?: boolean;

  /** Logo URL displayed in header */
  logoUrl?: string;

  /** Brand name for alt text */
  brandName?: string;

  /** Subtitle shown on welcome screen */
  brandSubtitle?: string;

  /** Amazon Connect configuration - enables live agent mode when provided */
  amazonConnectConfig?: AmazonConnectConfig;

  /** Initial customer info (optional - defaults to "Customer") */
  customerInfo?: CustomerInfo;

  /** Callback when live agent mode changes */
  onLiveAgentModeChange?: (isConnected: boolean) => void;

  /** Storybook only: Force connected UI state without actual connection */
  _storybook_connected?: boolean;
}
