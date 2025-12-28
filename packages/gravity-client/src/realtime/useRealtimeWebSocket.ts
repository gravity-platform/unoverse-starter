/**
 * useRealtimeWebSocket - Binary WebSocket for real-time audio streaming
 *
 * Handles bidirectional audio streaming via WebSocket.
 * Sends binary PCM audio to server, receives binary MP3 audio back.
 * Also handles JSON control messages for audio state events.
 */

import { useCallback, useRef, useState, useEffect } from "react";
import type { ControlMessage, AudioState } from "./types";

export interface AudioStateEvent {
  state: AudioState;
  metadata?: Record<string, any>;
}

export interface UseRealtimeWebSocketOptions {
  /** Conversation ID for the WebSocket connection */
  sessionId: string;
  /** User ID for session initialization */
  userId?: string;
  /** Chat ID for session initialization */
  chatId?: string;
  /** WebSocket URL (defaults to current origin) */
  wsUrl?: string;
  /** JWT access token for authentication */
  accessToken?: string;
  /** Function to get access token (called on each connect for fresh token) */
  getAccessToken?: () => Promise<string | null>;
  /** Callback when binary audio is received */
  onAudioReceived?: (audioData: ArrayBuffer) => void;
  /** Callback when connection state changes */
  onConnectionChange?: (connected: boolean) => void;
  /** Callback when control message is received */
  onControlMessage?: (message: ControlMessage) => void;
  /** Callback for specific audio state events */
  onAudioState?: (event: AudioStateEvent) => void;
  /** Auto-connect on mount (default: true) */
  autoConnect?: boolean;
}

export interface UseRealtimeWebSocketReturn {
  /** Whether WebSocket is connected */
  isConnected: boolean;
  /** Send binary audio data */
  sendAudio: (audioData: ArrayBuffer) => void;
  /** Send JSON control message */
  sendControl: (type: string, data?: Record<string, any>) => void;
  /** Connect to WebSocket - returns Promise that resolves when connected */
  connect: () => Promise<void>;
  /** Disconnect from WebSocket */
  disconnect: () => void;
}

export function useRealtimeWebSocket(options: UseRealtimeWebSocketOptions): UseRealtimeWebSocketReturn {
  const {
    sessionId,
    userId,
    chatId,
    wsUrl,
    accessToken,
    getAccessToken,
    onAudioReceived,
    onConnectionChange,
    onControlMessage,
    onAudioState,
    autoConnect = true,
  } = options;

  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build WebSocket URL - now uses unified /ws/gravity endpoint
  const getWsUrl = useCallback(async () => {
    let baseUrl: string;
    if (wsUrl) {
      baseUrl = `${wsUrl}/ws/gravity`;
    } else {
      // Default to current origin
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      baseUrl = `${protocol}//${window.location.host}/ws/gravity`;
    }

    // Get token - prefer getAccessToken() for fresh token, fall back to static accessToken
    let token = accessToken;
    if (getAccessToken) {
      try {
        token = (await getAccessToken()) || accessToken;
      } catch (error) {
        console.warn("[RealtimeWebSocket] Failed to get access token:", error);
      }
    }

    // Append token to URL if available
    if (token) {
      return `${baseUrl}?token=${encodeURIComponent(token)}`;
    }
    return baseUrl;
  }, [wsUrl, accessToken, getAccessToken]);

  // Connect to WebSocket - returns Promise that resolves when connected
  const connect = useCallback(async (): Promise<void> => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }
    if (wsRef.current?.readyState === WebSocket.CONNECTING) {
      // Wait for existing connection
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 50);
      });
    }

    const url = await getWsUrl();
    console.log("[RealtimeWebSocket] Connecting to:", url.replace(/token=[^&]+/, "token=***"));

    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      ws.binaryType = "arraybuffer";

      const timeout = setTimeout(() => {
        reject(new Error("WebSocket connection timeout"));
      }, 10000);

      ws.onopen = () => {
        clearTimeout(timeout);
        console.log("[RealtimeWebSocket] Connected to /ws/gravity");

        // Send INIT_SESSION to initialize the connection
        const initMessage = {
          type: "INIT_SESSION",
          conversationId: sessionId,
          userId: userId || "anonymous",
          chatId: chatId || `chat_${Date.now()}`,
        };
        ws.send(JSON.stringify(initMessage));
        console.log("[RealtimeWebSocket] Sent INIT_SESSION", initMessage);

        setIsConnected(true);
        onConnectionChange?.(true);

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
        resolve();
      };

      ws.onmessage = (event) => {
        if (event.data instanceof ArrayBuffer) {
          // Binary audio data
          onAudioReceived?.(event.data);
        } else {
          // Text control message
          try {
            const message: ControlMessage = JSON.parse(event.data);
            onControlMessage?.(message);

            // Extract audio state if present
            const state = message.state || message.audioState;
            if (state && onAudioState) {
              onAudioState({ state, metadata: message.metadata });
            }
          } catch (error) {
            console.error("[RealtimeWebSocket] Failed to parse control message:", error);
          }
        }
      };

      ws.onerror = (error) => {
        clearTimeout(timeout);
        console.error("[RealtimeWebSocket] Error:", error);
        reject(error);
      };

      ws.onclose = () => {
        setIsConnected(false);
        onConnectionChange?.(false);
      };

      wsRef.current = ws;
    });
  }, [getWsUrl, sessionId, userId, chatId, onAudioReceived, onConnectionChange, onControlMessage, onAudioState]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Send binary audio data
  const sendAudio = useCallback((audioData: ArrayBuffer) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(audioData);
    } else {
      console.warn("[RealtimeWebSocket] Cannot send audio - not connected");
    }
  }, []);

  // Send JSON control message
  const sendControl = useCallback((type: string, data?: Record<string, any>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, ...data }));
    } else {
      console.warn("[RealtimeWebSocket] Cannot send control - not connected");
    }
  }, []);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect && sessionId) {
      connect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, autoConnect]);

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return {
    isConnected,
    sendAudio,
    sendControl,
    connect,
    disconnect,
  };
}
