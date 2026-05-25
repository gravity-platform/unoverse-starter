import { getPlatformDependencies } from "@gravity-platform/plugin-base";
import { StreamingMetadata } from "../../../../util/types";
import { WebSocketAudioPublisher } from "../../io/publishers/WebSocketAudioPublisher";

const { createLogger } = getPlatformDependencies();
const logger = createLogger("RealtimeAudioHandler");

export class AudioHandler {
  private chunkIndex = 0;
  private publisher = new WebSocketAudioPublisher();

  constructor(
    private conversationId: string,
    private metadata: StreamingMetadata,
  ) {}

  async handleAudioStart(): Promise<void> {
    await this.publisher.publishState({
      state: "SPEECH_STARTED",
      conversationId: this.conversationId,
      metadata: this.metadata,
      message: "Assistant started speaking",
    });
  }

  async bufferAudioChunk(base64Audio: string): Promise<void> {
    await this.publisher.publishAudio({
      audioData: base64Audio,
      format: "pcm16",
      sourceType: "OpenAIRealtime",
      conversationId: this.conversationId,
      metadata: this.metadata,
      audioState: "SPEECH_STREAMING",
      index: this.chunkIndex++,
    });
  }

  async handleAudioEnd(): Promise<void> {
    await this.publisher.publishState({
      state: "SPEECH_ENDED",
      conversationId: this.conversationId,
      metadata: this.metadata,
      message: "Assistant finished speaking",
    });
    await this.publisher.cleanup(this.conversationId);
  }

  cleanup(): void {
    this.chunkIndex = 0;
  }
}
