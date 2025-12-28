/**
 * ChunkAnimator - Manages smooth typewriter animation of accumulated text
 * Extracts deltas from accumulated text and animates character-by-character
 */

export interface ChunkAnimatorConfig {
  charsPerSecond: number;
  onUpdate: (text: string) => void;
  onTypingChange: (isTyping: boolean) => void;
}

export class ChunkAnimator {
  private displayedText: string = "";
  private textQueue: string[] = []; // Queue of text deltas to animate
  private isAnimating: boolean = false;
  private animationFrameId: number | null = null;
  private config: ChunkAnimatorConfig;
  private lastReceivedText: string = ""; // Track last received to prevent duplicates

  constructor(config: ChunkAnimatorConfig) {
    this.config = config;
  }

  /**
   * Add accumulated text - animate from current position to new text
   * Server sends full accumulated text each time
   */
  addChunk(text: any): void {
    // Handle string input (accumulated text from server)
    const newText = typeof text === "string" ? text : text?.text || "";

    if (!newText) return;

    // Check if this is a duplicate of the last received text
    if (newText === this.lastReceivedText) {
      // Silently ignore duplicates
      return;
    }

    this.lastReceivedText = newText;

    // Cancel any ongoing animation
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Start animating to the new text
    this.animateToText(newText);
  }

  /**
   * Animate from current displayed text to target text
   */
  private animateToText(targetText: string): void {
    const startLength = this.displayedText.length;
    const targetLength = targetText.length;

    // If target is shorter or same, just update immediately
    if (targetLength <= startLength) {
      this.displayedText = targetText;
      this.config.onUpdate(this.displayedText);
      return;
    }

    this.isAnimating = true;
    this.config.onTypingChange(true);

    // IMPORTANT: Show first character immediately to prevent flash
    // Without this, there's a 1-frame delay where nothing is displayed
    if (startLength === 0 && targetLength > 0) {
      this.displayedText = targetText.slice(0, 1);
      this.config.onUpdate(this.displayedText);
    }

    let currentPos = Math.max(startLength, 1); // Start from at least 1 if we showed first char
    const msPerChar = 1000 / this.config.charsPerSecond;
    let lastUpdate = 0;

    const animate = (timestamp: number) => {
      if (lastUpdate === 0) {
        lastUpdate = timestamp;
      }

      const elapsed = timestamp - lastUpdate;
      const targetPos = Math.min(currentPos + Math.floor(elapsed / msPerChar), targetLength);

      // Add characters from current position to target position
      if (targetPos > currentPos) {
        this.displayedText = targetText.slice(0, targetPos);
        this.config.onUpdate(this.displayedText);
        currentPos = targetPos;

        if (currentPos >= targetLength) {
          // Animation complete
          this.isAnimating = false;
          this.config.onTypingChange(false);
          this.animationFrameId = null;
          return;
        }
      }

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  /**
   * Set displayed text directly (for syncing with React state)
   */
  setDisplayedText(text: string): void {
    this.displayedText = text;
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
