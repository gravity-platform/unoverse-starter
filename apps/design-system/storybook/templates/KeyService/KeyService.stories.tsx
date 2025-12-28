import type { Meta, StoryObj } from "@storybook/react";
import KeyService from "./KeyService";
import { mockClientInitial, mockClientStreaming, mockClientComplete } from "./defaults";

const meta: Meta<typeof KeyService> = {
  title: "Templates/KeyService",
  component: KeyService,
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
};

export default meta;
type Story = StoryObj<typeof KeyService>;

// Initial - User just opened the page
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
