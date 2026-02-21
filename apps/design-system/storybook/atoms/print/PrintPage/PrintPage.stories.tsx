import type { Meta, StoryObj } from "@storybook/react";
import PrintPage from "./PrintPage";

const meta: Meta<typeof PrintPage> = {
  title: "Print/Atoms/PrintPage",
  component: PrintPage,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["letter", "tabloid", "a4"],
      description: "Page size",
    },
    orientation: {
      control: "select",
      options: ["portrait", "landscape"],
      description: "Page orientation",
    },
    background: {
      control: "text",
      description: "Background image URL",
    },
  },
};

export default meta;
type Story = StoryObj<typeof PrintPage>;

export const Letter: Story = {
  args: {
    size: "letter",
    orientation: "portrait",
    children: (
      <div style={{ padding: "36pt", fontFamily: "Georgia, serif" }}>
        <h1 style={{ fontSize: "24pt", marginBottom: "12pt" }}>Letter Page (8.5 × 11")</h1>
        <p style={{ fontSize: "10pt", lineHeight: 1.5 }}>
          This is a print-quality page rendered at actual size. Text flows naturally with no character limits.
        </p>
      </div>
    ),
  },
};

export const Tabloid: Story = {
  args: {
    size: "tabloid",
    orientation: "portrait",
    children: (
      <div style={{ padding: "36pt", fontFamily: "Georgia, serif" }}>
        <h1 style={{ fontSize: "36pt", marginBottom: "12pt" }}>Tabloid Page (11 × 17")</h1>
        <p style={{ fontSize: "10pt", lineHeight: 1.5 }}>
          Tabloid size for newspaper broadsheet printing.
        </p>
      </div>
    ),
  },
};
