import type { Meta, StoryObj } from "@storybook/react";
import SABChatLayout from "./SABChatLayout";
import { mockClientInitial, mockClientStreaming, mockClientComplete, SABChatLayoutDefaults } from "./defaults";

const meta: Meta<typeof SABChatLayout> = {
  title: "Templates/SABChatLayout",
  component: SABChatLayout,
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
    brandName: {
      control: "text",
      description: "Brand name displayed in welcome screen",
    },
    brandSubtitle: {
      control: "text",
      description: "Subtitle displayed in welcome screen",
    },
    logoUrl: {
      control: "text",
      description: "URL for brand logo",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SABChatLayout>;

// Initial - User just opened the chat (shows welcome screen)
export const Initial: Story = {
  args: {
    client: mockClientInitial,
    ...SABChatLayoutDefaults,
  },
};

// Streaming - AI is working, components updating
export const Streaming: Story = {
  args: {
    client: mockClientStreaming,
    ...SABChatLayoutDefaults,
  },
};

// Complete - All components rendered and hydrated
export const Complete: Story = {
  args: {
    client: mockClientComplete,
    ...SABChatLayoutDefaults,
  },
};

// Focus Mode - Component is focused, shows pill in input
export const FocusMode: Story = {
  args: {
    client: {
      ...mockClientComplete,
      focusState: {
        focusedComponentId: "comp-1",
        targetTriggerNode: "inputtrigger6",
        chatId: "chat-123",
        agentName: "Bank Transfer",
      },
      closeFocus: () => console.log("[Mock] Close focus"),
    },
    ...SABChatLayoutDefaults,
  },
};
