import type { Meta, StoryObj } from "@storybook/react";
import BasicLayout from "./BasicLayout";
import { mockClientInitial, mockClientStreaming, mockClientComplete, BasicLayoutDefaults } from "./defaults.tsx";

const meta: Meta<typeof BasicLayout> = {
  title: "Templates/BasicLayout",
  component: BasicLayout,
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
    autoScroll: {
      control: "boolean",
      description: "Auto-scroll to bottom on new content",
    },
  },
};

export default meta;
type Story = StoryObj<typeof BasicLayout>;

// Initial - No components yet
export const Initial: Story = {
  args: {
    client: mockClientInitial,
    ...BasicLayoutDefaults,
  },
};

// Streaming - Components arriving
export const Streaming: Story = {
  args: {
    client: mockClientStreaming,
    ...BasicLayoutDefaults,
  },
};

// Complete - All components rendered
export const Complete: Story = {
  args: {
    client: mockClientComplete,
    ...BasicLayoutDefaults,
  },
};
