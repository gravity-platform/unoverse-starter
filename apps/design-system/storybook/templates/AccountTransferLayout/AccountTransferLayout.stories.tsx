import type { Meta, StoryObj } from "@storybook/react";
import AccountTransferLayout from "./AccountTransferLayout";
import { mockClientInitial, mockClientStreaming, mockClientComplete } from "./defaults";

const meta: Meta<typeof AccountTransferLayout> = {
  title: "Templates/AccountTransferLayout",
  component: AccountTransferLayout,
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
    onStateChange: { action: "state changed" },
  },
};

export default meta;
type Story = StoryObj<typeof AccountTransferLayout>;

// Initial - User just opened the transfer page
export const Initial: Story = {
  args: {
    client: mockClientInitial,
  },
};

// Streaming - AI is working, components updating
export const Streaming: Story = {
  args: {
    client: mockClientStreaming,
  },
};

// Complete - All components rendered and hydrated
export const Complete: Story = {
  args: {
    client: mockClientComplete,
  },
};
