import type { Meta, StoryObj } from "@storybook/react";
import MiroChat from "./MiroChat";
import {
  mockClientInitial,
  MiroChatDefaults,
  MiroChatConnected,
  MiroChatSpeaking,
  MiroChatListening,
} from "./defaults";

const meta: Meta<typeof MiroChat> = {
  title: "Templates/MiroChat",
  component: MiroChat,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ height: "100vh" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    _storybook_connected: {
      control: "boolean",
      description: "Whether the call is connected",
    },
    _storybook_speaking: {
      control: "boolean",
      description: "Whether the assistant is speaking",
    },
    _storybook_listening: {
      control: "boolean",
      description: "Whether the user is speaking",
    },
    assistantName: {
      control: "text",
      description: "Name displayed for the AI assistant",
    },
    assistantSubtitle: {
      control: "text",
      description: "Subtitle displayed under assistant name",
    },
    logoUrl: {
      control: "text",
      description: "URL for assistant avatar image",
    },
    brandName: {
      control: "text",
      description: "Brand name displayed in header",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MiroChat>;

/** Idle - ready to start call */
export const Idle: Story = {
  args: { client: mockClientInitial, ...MiroChatDefaults },
};

/** Connected - call active */
export const Connected: Story = {
  args: { client: mockClientInitial, ...MiroChatConnected },
};

/** Speaking - assistant is talking */
export const Speaking: Story = {
  args: { client: mockClientInitial, ...MiroChatSpeaking },
};

/** Listening - user is speaking, mic active */
export const Listening: Story = {
  args: { client: mockClientInitial, ...MiroChatListening },
};
