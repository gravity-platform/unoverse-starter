import type { Meta, StoryObj } from "@storybook/react";
import MiroIssueTriage from "./MiroIssueTriage";
import { MiroIssueTriageDefaults } from "./defaults";

const meta: Meta<typeof MiroIssueTriage> = {
  title: "Components/MiroIssueTriage",
  component: MiroIssueTriage,
  parameters: {
    layout: "padded",
    workflowSize: { width: 1200, height: 700 },
  },
  argTypes: {
    painPoints: { control: "object", description: "Array of pain points from AI analysis", workflowInput: true },
    productIdeas: { control: "object", description: "Array of product ideas from AI analysis", workflowInput: true },
    topTweet: { control: "object", description: "Highest signal tweet with reasoning", workflowInput: true },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: MiroIssueTriageDefaults };

export const Loading: Story = { args: { painPoints: [], productIdeas: [], topTweet: undefined as any } };
