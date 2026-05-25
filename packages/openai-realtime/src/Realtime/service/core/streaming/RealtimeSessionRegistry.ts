import { WsClient } from "./WsClient";

class RealtimeSessionRegistry {
  private sessions = new Map<string, WsClient>();

  register(conversationId: string, wsClient: WsClient): void {
    this.sessions.set(conversationId, wsClient);
  }

  get(conversationId: string): WsClient | undefined {
    return this.sessions.get(conversationId);
  }

  remove(conversationId: string): void {
    this.sessions.delete(conversationId);
  }

  clear(): void {
    this.sessions.clear();
  }
}

export const realtimeSessionRegistry = new RealtimeSessionRegistry();
