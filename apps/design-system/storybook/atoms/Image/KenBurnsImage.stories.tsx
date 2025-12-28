import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import KenBurnsImage from "./KenBurnsImage";
import { KenBurnsImageDefaults } from "./defaults";

const meta: Meta<typeof KenBurnsImage> = {
  title: "Atoms/Image",
  component: KenBurnsImage,
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <div style={{ width: "600px", height: "400px" }}>
      <KenBurnsImage {...args} />
    </div>
  ),
  argTypes: {
    src: {
      control: "text",
      description: "Image source URL",
      workflowInput: true,  // ✅ Workflow input
    },
    alt: {
      control: "text",
      description: "Alt text for the image",
      workflowInput: true,  // ✅ Workflow input
    },
    direction: {
      control: "select",
      options: ["topLeft", "topRight", "bottomLeft", "bottomRight", "center"],
      description: "Direction of the zoom and pan movement",
      workflowInput: true,  // ✅ Workflow input
    },
    scale: {
      control: { type: "range", min: 1.05, max: 1.5, step: 0.05 },
      description: "Maximum zoom scale",
      workflowInput: true,  // ✅ Workflow input
    },
    overlay: {
      control: "boolean",
      description: "Show gradient overlay",
      workflowInput: true,  // ✅ Workflow input
    },
    grain: {
      control: "boolean",
      description: "Show grain texture",
      workflowInput: true,  // ✅ Workflow input
    },
    particles: {
      control: "boolean",
      description: "Show floating particles",
      workflowInput: true,  // ✅ Workflow input
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: KenBurnsImageDefaults,
};

export const WithAllEffects: Story = {
  args: {
    ...KenBurnsImageDefaults,
    overlay: true,
    grain: true,
    particles: true,
  },
};

export const SubtleEffect: Story = {
  args: {
    ...KenBurnsImageDefaults,
    scale: 1.15,
    overlay: false,
    grain: false,
  },
};
