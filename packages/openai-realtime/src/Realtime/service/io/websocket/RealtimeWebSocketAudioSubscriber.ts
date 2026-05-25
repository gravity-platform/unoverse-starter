import { getPlatformDependencies } from "@gravity-platform/plugin-base";
import { WsClient } from "../../core/streaming/WsClient";
import { AudioAppendBuilder } from "../events/incoming/builders/AudioAppendBuilder";

function getLogger() {
  return getPlatformDependencies().createLogger("RealtimeWebSocketAudioSubscriber");
}

function getAudioWSManager() {
  return getPlatformDependencies().getAudioWebSocketManager?.();
}

interface RealtimeAudioSession {
  wsClient: WsClient;
  chatId: string;
  isActive: boolean;
}

export class RealtimeWebSocketAudioSubscriber {
  private sessions = new Map<string, RealtimeAudioSession>();
  private static instance: RealtimeWebSocketAudioSubscriber;
  private logger = getLogger();

  private constructor() {
    this.setupWebSocketHandlers();
  }

  static getInstance(): RealtimeWebSocketAudioSubscriber {
    if (!RealtimeWebSocketAudioSubscriber.instance) {
      RealtimeWebSocketAudioSubscriber.instance = new RealtimeWebSocketAudioSubscriber();
    }
    return RealtimeWebSocketAudioSubscriber.instance;
  }

  private setupWebSocketHandlers(): void {
    const audioWSManager = getAudioWSManager();
    if (audioWSManager?.setAudioDataHandler) {
      audioWSManager.setAudioDataHandler(this.handleAudioData.bind(this));
      audioWSManager.setControlMessageHandler(this.handleControlMessage.bind(this));
      this.logger.info("Realtime WebSocket audio subscriber registered");
    } else {
      this.logger.warn("AudioWebSocketManager not available");
    }
  }

  registerSession(wsSessionId: string, chatId: string, wsClient: WsClient): void {
    this.sessions.set(wsSessionId, { wsClient, chatId, isActive: true });

    const audioWSManager = getAudioWSManager();
    audioWSManager?.startAudioSession?.(wsSessionId, wsSessionId);

    this.logger.info("Realtime audio session registered", { wsSessionId, chatId });
  }

  async handleAudioData(sessionId: string, audioData: ArrayBuffer): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) return;
    if (!session.wsClient.isOpen) {
      this.logger.warn("Mic audio but WsClient is closed", { sessionId });
      return;
    }

    const base64 = Buffer.from(audioData).toString("base64");
    session.wsClient.send(AudioAppendBuilder.build(base64));
  }

  async handleControlMessage(sessionId: string, message: any): Promise<void> {
    const type = message?.type;
    if (type === "stop" || type === "END_CALL") {
      const session = this.sessions.get(sessionId);
      if (!session) return;
      this.logger.info("Control 'stop' — closing Realtime WebSocket", { sessionId });
      session.isActive = false;
      try {
        session.wsClient.close();
      } catch (err: any) {
        this.logger.warn("Error closing WS on stop", { sessionId, error: err?.message });
      }
    }
  }

  unregisterSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isActive = false;
      this.sessions.delete(sessionId);
      this.logger.info("Realtime audio session unregistered", { sessionId });
    }
  }
}
