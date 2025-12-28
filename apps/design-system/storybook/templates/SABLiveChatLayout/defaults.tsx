/**
 * SABLiveChatLayout Template Defaults
 * Amazon Connect conversation mock with proper metadata
 */

import { createMockClients } from "../core";
import AIResponse from "../../components/AIResponse/AIResponse";
import ListPicker from "../../components/ListPicker/ListPicker";
import { ListPickerDefaults } from "../../components/ListPicker/defaults";

// Create all 3 states using shared factory
// Components represent Amazon Connect conversation flow with metadata
export const {
  mockHistoryInitial,
  mockHistoryStreaming,
  mockHistoryComplete,
  mockClientInitial,
  mockClientStreaming,
  mockClientComplete,
} = createMockClients([
  {
    componentType: "AIResponse",
    Component: AIResponse,
    props: { text: "Welcome! Please select your preferred language:" },
    // Mark as Amazon Connect message for proper avatar
    metadata: {
      source: "amazon_connect",
      participantRole: "SYSTEM",
      agentName: "BOT",
    },
  },
  {
    componentType: "ListPicker",
    Component: ListPicker,
    props: ListPickerDefaults,
    metadata: {
      source: "amazon_connect",
      participantRole: "SYSTEM",
      agentName: "BOT",
    },
  },
]);

// Template-specific defaults
export const SABLiveChatLayoutDefaults = {
  placeholder: "Type your message...",
  autoScroll: true,
  logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1764865338/SAB/sablogo.jpg",
  brandName: "SAB Smart Assistant",
};

// Mock Amazon Connect config for Storybook (simulates connected state)
export const mockAmazonConnectConfig = {
  apiGatewayEndpoint: "https://mock-api-gateway.example.com",
  contactFlowId: "mock-contact-flow-id",
  instanceId: "mock-instance-id",
  region: "eu-central-1",
};

// Defaults for Complete story (shows connected to live agent)
export const SABLiveChatLayoutCompleteDefaults = {
  ...SABLiveChatLayoutDefaults,
  amazonConnectConfig: mockAmazonConnectConfig,
  // Override to show connected state in Storybook
  _storybook_connected: true,
};
