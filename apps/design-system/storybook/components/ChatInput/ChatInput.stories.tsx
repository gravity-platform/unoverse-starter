import type { Meta, StoryObj } from "@storybook/react";
import ChatInput from "./ChatInput";
import { ChatInputDefaults, demoFaqs, demoActions } from "./defaults";

const meta: Meta<typeof ChatInput> = {
  title: "Components/ChatInput",
  component: ChatInput,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text for the input field",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled (e.g., during streaming)",
    },
    enableAudio: {
      control: "boolean",
      description: "Show microphone button for voice input",
    },
    faqs: {
      control: "object",
      description: "Array of FAQ objects (from workflow metadata)",
    },
    actions: {
      control: "object",
      description: "Array of action objects (from workflow metadata)",
    },
    onSend: { action: "onSend" },
    onFaqClick: { action: "onFaqClick" },
    onActionClick: { action: "onActionClick" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "400px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatInput>;

// Default - Ready for input, no FAQs/Actions (workflow hasn't sent any)
export const Default: Story = {
  args: ChatInputDefaults,
};

// Streaming - Input disabled while AI is responding
export const Streaming: Story = {
  args: {
    ...ChatInputDefaults,
    disabled: true,
  },
};

// WithSuggestions - Workflow has sent FAQs and Actions
export const WithSuggestions: Story = {
  args: {
    ...ChatInputDefaults,
    faqs: demoFaqs,
    actions: demoActions,
  },
};
