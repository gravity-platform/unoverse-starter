/**
 * Default values for ChatInput component
 * Used only in Storybook for demos
 *
 * NOTE: In production, FAQs and Actions come from the workflow via
 * component metadata. The template extracts them and passes to ChatInput.
 * These defaults are only for standalone ChatInput stories.
 */

// Standalone demo FAQs/Actions (for ChatInput stories only)
export const demoFaqs = [
  { id: "1", question: "What services do you offer?" },
  { id: "2", question: "How do I book an appointment?" },
  { id: "3", question: "What are your opening hours?" },
  { id: "4", question: "Do you accept insurance?" },
  { id: "5", question: "Where are you located?" },
];

export const demoActions = [
  {
    object: {
      universal_id: "action-1",
      title: "Golf Swing Analysis",
      description: "Get a professional analysis of your golf swing technique",
      metadata: {
        images: ["https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=300&fit=crop"],
        callToAction: "Book Now",
      },
    },
  },
  {
    object: {
      universal_id: "action-2",
      title: "Personal Training",
      description: "One-on-one sessions with certified trainers",
      metadata: {
        images: ["https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop"],
        callToAction: "Learn More",
      },
    },
  },
];

export const ChatInputDefaults = {
  placeholder: "Ask me anything...",
  disabled: false,
  enableAudio: false,
  isRecording: false,
  // Empty by default - workflow provides these via template
  faqs: [],
  actions: [],
};
