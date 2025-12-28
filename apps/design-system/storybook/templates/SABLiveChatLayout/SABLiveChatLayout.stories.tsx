import type { Meta, StoryObj } from "@storybook/react";
import SABLiveChatLayout from "./SABLiveChatLayout";
import {
  mockClientInitial,
  mockClientStreaming,
  mockClientComplete,
  SABLiveChatLayoutDefaults,
  SABLiveChatLayoutCompleteDefaults,
} from "./defaults";

const meta: Meta<typeof SABLiveChatLayout> = {
  title: "Templates/SABLiveChatLayout",
  component: SABLiveChatLayout,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ height: "100vh", width: "100vw" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text for input",
    },
    autoScroll: {
      control: "boolean",
      description: "Auto-scroll to bottom on new content",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SABLiveChatLayout>;

// ============================================
// 3-State Pattern: Initial, Streaming, Complete
// ============================================

// Initial - Empty chat, ready to start
export const Initial: Story = {
  args: {
    client: mockClientInitial,
    ...SABLiveChatLayoutDefaults,
  },
};

// Streaming - AI/Agent is responding, components updating
export const Streaming: Story = {
  args: {
    client: mockClientStreaming,
    ...SABLiveChatLayoutDefaults,
  },
};

// Complete - Full conversation with all components rendered (shows connected to live agent)
export const Complete: Story = {
  args: {
    client: mockClientComplete,
    ...SABLiveChatLayoutCompleteDefaults,
  },
};
