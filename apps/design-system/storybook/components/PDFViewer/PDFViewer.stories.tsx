import type { Meta, StoryObj } from "@storybook/react";
import PDFViewer from "./PDFViewer";
import { defaultProps } from "./defaults";

const meta: Meta<typeof PDFViewer> = {
  title: "Components/PDFViewer",
  component: PDFViewer,
  parameters: {
    layout: "padded",
    workflowSize: { width: 600, height: 800 },
  },
  argTypes: {
    url: {
      control: "text",
      description: "URL of the PDF to display",
      workflowInput: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof PDFViewer>;

export const Default: Story = {
  args: {
    url: "https://res.cloudinary.com/sonik/image/upload/v1768111406/gravity/pdfTemplate.pdf",
  },
};

export const NoUrl: Story = {
  args: defaultProps,
};
