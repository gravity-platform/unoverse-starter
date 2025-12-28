import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: {
      control: "text",
      description: "Button text content",
      workflowInput: true,
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline"],
      description: "Button style variant",
      workflowInput: true,
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Button size",
      workflowInput: true,
    },
    disabled: {
      control: "boolean",
      description: "Disable button",
      workflowInput: false,
    },
    onClick: {
      action: "clicked",
      description: "Click handler (wired by template)",
      workflowInput: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
    size: "md",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
    size: "md",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline Button",
    variant: "outline",
    size: "md",
  },
};

export const Small: Story = {
  args: {
    children: "Small Button",
    variant: "primary",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Large Button",
    variant: "primary",
    size: "lg",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    variant: "primary",
    size: "md",
    disabled: true,
  },
};
