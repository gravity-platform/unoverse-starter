/**
 * useAmazonConnect - Hook for managing Amazon Connect live agent chat
 *
 * This hook manages the Amazon Connect ChatJS SDK, session lifecycle,
 * and message handling. It transforms agent messages to AssistantResponse
 * format for seamless integration with Gravity's unified history.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import "amazon-connect-chatjs"; // Side-effect import - attaches to window.connect
import type { AssistantResponse } from "../../core";
import type { AmazonConnectConfig, ConnectionStatus, CustomerInfo } from "../types";
import { transformToAssistantResponse } from "../lib/messageTransformer";

// Declare global connect namespace from ChatJS
declare global {
  interface Window {
    connect?: {
      ChatSession: {
        create: (config: any) => any;
        SessionTypes: {
          CUSTOMER: string;
        };
      };
    };
  }
}

export interface UseAmazonConnectReturn {
  /** Current connection status */
  connectionStatus: ConnectionStatus;
  /** Whether connected to live agent */
  isConnected: boolean;
  /** Whether currently connecting */
  isConnecting: boolean;
  /** Whether agent is typing */
  isAgentTyping: boolean;
  /** Agent name (if available) */
  agentName: string | null;
  /** Agent avatar URL (if available) */
  agentAvatar: string | null;
  /** Error message if any */
  error: string | null;
  /** Connect to Amazon Connect */
  connect: (customerInfo: CustomerInfo) => Promise<void>;
  /** Send message to agent */
  sendMessage: (content: string) => Promise<void>;
  /** Disconnect from chat */
  disconnect: () => Promise<void>;
}

export function useAmazonConnect(
  config: AmazonConnectConfig | undefined,
  onAgentMessage: (response: AssistantResponse) => void,
  onChatEnded?: () => void
): UseAmazonConnectReturn {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [agentName, setAgentName] = useState<string | null>(null);
  const [agentAvatar, setAgentAvatar] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionRef = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const connectToAgent = useCallback(
    async (customerInfo: CustomerInfo) => {
      if (!config) {
        setError("Amazon Connect configuration not provided");
        return;
      }

      setConnectionStatus("connecting");
      setError(null);

      try {
        // 1. Get participant token via API Gateway
        const response = await fetch(config.apiGatewayEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            InstanceId: config.instanceId,
            ContactFlowId: config.contactFlowId,
            ParticipantDetails: {
              DisplayName: customerInfo.name,
            },
            Attributes: {
              customerName: customerInfo.name,
              email: customerInfo.email || "",
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to start chat: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        // Handle nested response structure from legacy API
        const chatDetails = data.data?.startChatResult || data;

        if (!chatDetails.ContactId) {
          throw new Error("Invalid response: missing ContactId");
        }

        // 2. Check if Amazon Connect SDK is loaded
        if (!window.connect?.ChatSession) {
          throw new Error(
            "Amazon Connect ChatJS SDK not loaded. " +
              "Install 'amazon-connect-chatjs' in your client app and import it before using this template."
          );
        }

        // 3. Initialize ChatJS session
        const chatSession = window.connect.ChatSession.create({
          chatDetails: {
            contactId: chatDetails.ContactId,
            participantId: chatDetails.ParticipantId,
            participantToken: chatDetails.ParticipantToken,
          },
          options: { region: config.region },
          type: window.connect.ChatSession.SessionTypes.CUSTOMER,
        });

        // 3. Set up event handlers
        chatSession.onConnectionEstablished(() => {
          console.log("[AmazonConnect] Connection established");
          setConnectionStatus("connected");
        });

        chatSession.onConnectionBroken(() => {
          console.log("[AmazonConnect] Connection broken");
          setConnectionStatus("disconnected");
        });

        chatSession.onEnded(async () => {
          console.log("[AmazonConnect] Chat ended by agent");
          setConnectionStatus("ended");
          sessionRef.current = null;

          // Add "chat ended" message to history
          const endedResponse = transformToAssistantResponse({
            Id: `ended-${Date.now()}`,
            Content: "Live agent chat has ended. You can continue chatting with the AI assistant.",
            ContentType: "text/plain",
            ParticipantRole: "SYSTEM",
            AbsoluteTime: new Date().toISOString(),
          });
          onAgentMessage(endedResponse);
          onChatEnded?.();
        });

        // 4. Subscribe to messages
        chatSession.onMessage((event: any) => {
          const { ParticipantRole, Type, ContentType, Content, DisplayName } = event.data;

          // Track agent name
          if (ParticipantRole === "AGENT" && DisplayName) {
            setAgentName(DisplayName);
          }

          // Only process agent/system messages (not customer echoes)
          if (ParticipantRole === "AGENT" || ParticipantRole === "SYSTEM") {
            if (Type === "MESSAGE") {
              console.log("[AmazonConnect] Agent message received:", event.data);
              const response = transformToAssistantResponse(event.data);
              console.log("[AmazonConnect] Transformed response:", response);
              onAgentMessage(response);
            }
          }

          // Reset typing indicator on any message
          setIsAgentTyping(false);
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
        });

        // 5. Subscribe to typing events
        chatSession.onTyping(() => {
          setIsAgentTyping(true);

          // Auto-reset typing after 3 seconds
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = setTimeout(() => {
            setIsAgentTyping(false);
          }, 3000);
        });

        // 6. Connect
        await chatSession.connect();
        sessionRef.current = chatSession;

        console.log("[AmazonConnect] Successfully connected");
      } catch (err: any) {
        console.error("[AmazonConnect] Connection error:", err);
        setError(err.message || "Failed to connect to live agent");
        setConnectionStatus("error");
      }
    },
    [config, onAgentMessage, onChatEnded]
  );

  const sendMessage = useCallback(async (content: string) => {
    if (!sessionRef.current) {
      console.error("[AmazonConnect] Cannot send message: not connected");
      return;
    }

    try {
      await sessionRef.current.sendMessage({
        contentType: "text/plain",
        message: content,
      });
    } catch (err: any) {
      console.error("[AmazonConnect] Error sending message:", err);
      setError(err.message || "Failed to send message");
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (!sessionRef.current) {
      return;
    }

    try {
      await sessionRef.current.disconnectParticipant();
      sessionRef.current = null;
      setConnectionStatus("ended");
      setAgentName(null);
      console.log("[AmazonConnect] Disconnected");
      onChatEnded?.(); // Notify parent that chat ended
    } catch (err: any) {
      console.error("[AmazonConnect] Error disconnecting:", err);
    }
  }, [onChatEnded]);

  return {
    connectionStatus,
    isConnected: connectionStatus === "connected",
    isConnecting: connectionStatus === "connecting",
    isAgentTyping,
    agentName,
    agentAvatar,
    error,
    connect: connectToAgent,
    sendMessage,
    disconnect,
  };
}
