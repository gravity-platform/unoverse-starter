import type { Meta, StoryObj } from "@storybook/react";
import ListPicker from "./ListPicker";

const meta: Meta<typeof ListPicker> = {
  title: "Components/ListPicker",
  component: ListPicker,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ListPicker>;

// Language selector (Amazon Connect style)
export const LanguageSelector: Story = {
  args: {
    title: "Select your language",
    elements: [{ title: "English" }, { title: "عربي" }, { title: "Español" }, { title: "Français" }],
    onSelect: (element) => console.log("Selected:", element.title),
  },
};

// Menu options with subtitles
export const MenuOptions: Story = {
  args: {
    title: "How can we help?",
    subtitle: "Choose an option below",
    elements: [
      { title: "Check order status", subtitle: "Track your recent orders" },
      { title: "Return an item", subtitle: "Start a return or exchange" },
      { title: "Speak to an agent", subtitle: "Connect with customer support" },
    ],
    onSelect: (element) => console.log("Selected:", element.title),
  },
};

// With images
export const WithImages: Story = {
  args: {
    title: "Select a product",
    elements: [
      {
        title: "Premium Plan",
        subtitle: "$29/month",
        imageUrl: "https://via.placeholder.com/40/667eea/ffffff?text=P",
      },
      {
        title: "Basic Plan",
        subtitle: "$9/month",
        imageUrl: "https://via.placeholder.com/40/10b981/ffffff?text=B",
      },
    ],
    onSelect: (element) => console.log("Selected:", element.title),
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    title: "Options",
    elements: [{ title: "Option 1" }, { title: "Option 2" }],
    disabled: true,
  },
};
