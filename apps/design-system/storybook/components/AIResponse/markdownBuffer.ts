/**
 * Markdown Buffer - Holds back incomplete markdown syntax during streaming
 * Prevents jumpy rendering when links, bold, code blocks are partially streamed
 *
 * IMPORTANT: This must be conservative - only buffer clearly incomplete syntax
 * at the very end of the text. Being too aggressive causes text to disappear.
 */

/**
 * Find the safe cutoff point in markdown text
 * Returns the index up to which we can safely render
 *
 * Strategy: Only look at the last ~10 characters for incomplete syntax.
 * This prevents the "disappearing text" bug when links like [SAB Card](url) stream in.
 */
export function getSafeMarkdownCutoff(text: string): number {
  if (!text) return 0;

  const len = text.length;

  // Only examine the very end of text (last 10 chars) for incomplete syntax
  // Being too aggressive causes text to disappear while links stream in
  const tailStart = Math.max(0, len - 10);
  const tail = text.slice(tailStart);

  // Check for incomplete link ONLY if [ is in the last 10 chars
  // This prevents cutting off text like "[SAB VISA Signature Credit Card](" mid-stream
  const bracketInTail = tail.lastIndexOf("[");
  if (bracketInTail !== -1) {
    const afterBracket = tail.slice(bracketInTail);
    // Check if this is a complete link [text](url)
    const isComplete = /^\[[^\]]*\]\([^)]*\)/.test(afterBracket);
    // Check if it's a closed reference [text]
    const isClosed = /^\[[^\]]*\]/.test(afterBracket);

    if (!isComplete && !isClosed) {
      // Incomplete link - but only cut if it's very short (just started)
      // If the bracket content is long, show it anyway to avoid flicker
      if (afterBracket.length < 8) {
        return tailStart + bracketInTail;
      }
    }
  }

  // Check for trailing incomplete markers (only at the very end)
  // These patterns indicate we're mid-syntax
  const trailingPatterns = [
    /\*{1,2}$/, // Ends with * or **
    /_{1,2}$/, // Ends with _ or __
    /`{1,3}$/, // Ends with `, ``, or ```
  ];

  for (const pattern of trailingPatterns) {
    const match = tail.match(pattern);
    if (match) {
      // Only cut if this looks like the START of a marker (preceded by space or start)
      const matchStart = tailStart + tail.length - match[0].length;
      const charBefore = matchStart > 0 ? text[matchStart - 1] : " ";
      // If preceded by whitespace or punctuation, it's likely a new marker
      if (/[\s\n(]/.test(charBefore)) {
        return matchStart;
      }
    }
  }

  // Show everything - don't be aggressive
  return len;
}

/**
 * Get the safe portion of markdown to render
 */
export function getSafeMarkdown(text: string, isStreaming: boolean): string {
  if (!isStreaming) {
    // Not streaming - show everything
    return text;
  }

  const cutoff = getSafeMarkdownCutoff(text);
  return text.slice(0, cutoff);
}
