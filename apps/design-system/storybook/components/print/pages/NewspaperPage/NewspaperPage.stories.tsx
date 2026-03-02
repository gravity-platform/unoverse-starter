import type { Meta, StoryObj } from "@storybook/react";
import NewspaperPage from "./NewspaperPage";

const meta: Meta<typeof NewspaperPage> = {
  title: "Print/Pages/NewspaperPage",
  component: NewspaperPage,
  parameters: {
    layout: "centered",
    workflowSize: { width: 1060, height: 3300 },
  },
  argTypes: {
    articles: {
      control: "object",
      description: "Articles JSON — LLM-generated reporter stories (IDs 1–8, sequential)",
      workflowInput: true,
    },
    components: {
      control: "object",
      description: "Components JSON — masthead, banner, sheriff, editor, horoscopes, bestsellers, classifieds",
      workflowInput: true,
    },
  },
};

export default meta;

export const Default: StoryObj<typeof NewspaperPage> = {
  args: {},
};
