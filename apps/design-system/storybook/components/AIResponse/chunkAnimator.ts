/**
 * ChunkAnimator - Manages smooth typewriter animation of accumulated text
 * Uses interpolation-based animation for buttery smooth streaming
 */

export interface ChunkAnimatorConfig {
  charsPerSecond: number;
  onUpdate: (text: string) => void;
  onTypingChange: (isTyping: boolean) => void;
}

export class ChunkAnimator {
  private displayedText: string = "";
  private targetText: string = ""; // The full text we're animating towards
  private isAnimating: boolean = false;
  private animationFrameId: number | null = null;
  private config: ChunkAnimatorConfig;
  private lastReceivedText: string = ""; // Track last received to prevent duplicates

  // Smooth animation state
  private currentPosition: number = 0; // Fractional position for smooth interpolation
  private lastTimestamp: number = 0;
  private velocity: number = 0; // Current animation velocity (chars/sec)
  private readonly minVelocity: number = 150; // Minimum chars per second
  private readonly maxVelocity: number = 1200; // Maximum chars per second
  private readonly catchUpMultiplier: number = 4; // Speed boost when falling behind

  constructor(config: ChunkAnimatorConfig) {
    this.config = config;
    this.velocity = config.charsPerSecond;
  }

  /**
   * Add accumulated text - smoothly animate towards new target
   * Server sends full accumulated text each time
   */
  addChunk(text: any): void {
    // Handle string input (accumulated text from server)
    const newText = typeof text === "string" ? text : text?.text || "";

    if (!newText) return;

    // Check if this is a duplicate of the last received text
    if (newText === this.lastReceivedText) {
      return;
    }

    this.lastReceivedText = newText;
    this.targetText = newText;

    // If not already animating, start the animation loop
    if (!this.isAnimating) {
      this.startAnimation();
    }
  }

  /**
   * Start the smooth animation loop
   */
  private startAnimation(): void {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.config.onTypingChange(true);
    this.lastTimestamp = 0;
    this.velocity = this.config.charsPerSecond;

    // Show first chunk immediately for instant feedback
    if (this.currentPosition === 0 && this.targetText.length > 0) {
      // Show up to 10 chars or first word boundary immediately
      const immediateChars = Math.min(this.targetText.length, Math.max(10, this.targetText.indexOf(" ", 5) + 1 || 10));
      this.currentPosition = immediateChars;
      this.displayedText = this.targetText.slice(0, immediateChars);
      this.config.onUpdate(this.displayedText);
    }

    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }

  /**
   * Main animation loop - uses smooth interpolation
   */
  private animate(timestamp: number): void {
    if (this.lastTimestamp === 0) {
      this.lastTimestamp = timestamp;
      this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
      return;
    }

    const deltaTime = (timestamp - this.lastTimestamp) / 1000; // Convert to seconds
    this.lastTimestamp = timestamp;

    // Cap delta time to prevent huge jumps after tab switches
    const cappedDelta = Math.min(deltaTime, 0.1);

    const targetLength = this.targetText.length;
    const remaining = targetLength - this.currentPosition;

    // If we've caught up, check if we should stop
    if (remaining <= 0) {
      // Snap to target
      if (this.displayedText !== this.targetText) {
        this.displayedText = this.targetText;
        this.config.onUpdate(this.displayedText);
      }
      this.currentPosition = targetLength;

      // Keep animation running in case more text arrives
      this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
      return;
    }

    // Adaptive velocity: speed up when falling behind
    const lagRatio = remaining / Math.max(targetLength * 0.1, 20); // How far behind we are
    const targetVelocity = Math.min(
      this.maxVelocity,
      Math.max(this.minVelocity, this.config.charsPerSecond * (1 + lagRatio * this.catchUpMultiplier))
    );

    // Fast velocity transition for responsive feel
    const velocityDiff = targetVelocity - this.velocity;
    this.velocity += velocityDiff * Math.min(cappedDelta * 15, 1); // Quick interpolation

    // Calculate new position with smooth sub-character precision
    const charsToAdd = this.velocity * cappedDelta;
    this.currentPosition = Math.min(this.currentPosition + charsToAdd, targetLength);

    // Only update DOM when we cross integer boundaries
    const displayLength = Math.floor(this.currentPosition);
    if (displayLength > this.displayedText.length) {
      this.displayedText = this.targetText.slice(0, displayLength);
      this.config.onUpdate(this.displayedText);
    }

    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }

  /**
   * Set displayed text directly (for syncing with React state)
   */
  setDisplayedText(text: string): void {
    this.displayedText = text;
    this.currentPosition = text.length;
  }

  /**
   * Stop animation and optionally snap to target
   */
  stop(snapToTarget: boolean = true): void {
    this.isAnimating = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (snapToTarget && this.targetText) {
      this.displayedText = this.targetText;
      this.currentPosition = this.targetText.length;
      this.config.onUpdate(this.displayedText);
    }
    this.config.onTypingChange(false);
  }

  /**
   * Reset animator state for new streaming session
   */
  reset(): void {
    this.stop(false);
    this.displayedText = "";
    this.targetText = "";
    this.currentPosition = 0;
    this.lastReceivedText = "";
    this.velocity = this.config.charsPerSecond;
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.stop(false);
  }
}
