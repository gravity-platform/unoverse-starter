import type { Meta, StoryObj } from "@storybook/react";
import ChatLayout from "./ChatLayout";
import {
  mockClientInitial,
  mockClientStreaming,
  mockClientComplete,
  ChatLayoutDefaults,
} from "./defaults.tsx";

const meta: Meta<typeof ChatLayout> = {
  title: "Templates/ChatLayout",
  component: ChatLayout,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', width: '100vw' }}>
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
type Story = StoryObj<typeof ChatLayout>;

// Initial - User just opened the chat
export const Initial: Story = {
  args: {
    client: mockClientInitial,
    ...ChatLayoutDefaults,
  },
};

// Streaming - AI is working, components updating
export const Streaming: Story = {
  args: {
    client: mockClientStreaming,
    ...ChatLayoutDefaults,
  },
};

// Complete - All components rendered and hydrated
export const Complete: Story = {
  args: {
    client: mockClientComplete,
    ...ChatLayoutDefaults,
  },
};
