import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import AIResponse from "./AIResponse";
import { AIResponseDefaults } from "./defaults";

const meta: Meta<typeof AIResponse> = {
  title: "Components/AIResponse",
  component: AIResponse,
  parameters: {
    layout: "padded",
    workflowSize: { width: 750, height: 400 }, // Default size for workflow editor
  },
  argTypes: {
    progressText: {
      control: "text",
      description: "Progress/thinking message",
      workflowInput: true, // ✅ Workflow input
    },
    text: {
      control: "object",
      description: "Main response text",
      workflowInput: true, // ✅ Workflow input
    },
    questions: {
      control: "object",
      description: "Follow-up questions (array of strings)",
      workflowInput: true, // ✅ Workflow input
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: AIResponseDefaults,
};

export const WithMarkdown: Story = {
  args: AIResponseDefaults,
};
