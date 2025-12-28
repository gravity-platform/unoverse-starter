import type { Meta, StoryObj } from "@storybook/react";
import AccountTransferWidget from "./AccountTransferWidget";
import {
  defaultTransferData,
  defaultAvailableAccounts,
  defaultBeneficiaries,
  completedTransferData,
  internationalTransferData,
} from "./defaults";

const meta: Meta<typeof AccountTransferWidget> = {
  title: "Components/AccountTransferWidget",
  component: AccountTransferWidget,
  parameters: {
    layout: "fullscreen",
    workflowSize: { width: 900, height: 600 },
  },
  tags: ["autodocs"],
  argTypes: {
    displayState: {
      control: "select",
      options: ["inline", "focused"],
      description: "Display state for focus mode",
      workflowInput: false,
    },
    transferData: {
      control: "object",
      description: "Transfer data object populated by AI",
      workflowInput: true,
    },
    availableAccounts: {
      control: "object",
      description: "Available source accounts to choose from",
      workflowInput: true,
    },
    beneficiaries: {
      control: "object",
      description: "Saved beneficiaries to choose from",
      workflowInput: true,
    },
    heroImage: {
      control: "text",
      description: "Hero image URL for the widget",
      workflowInput: true,
    },
    editable: {
      control: "boolean",
      description: "Whether the widget is editable",
      workflowInput: false,
    },
    onTransferChange: {
      action: "transfer changed",
      workflowInput: false,
    },
    onConfirm: {
      action: "transfer confirmed",
      workflowInput: false,
    },
    onCancel: {
      action: "transfer cancelled",
      workflowInput: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================
// STANDARD FOCUS MODE STATES
// All focusable components should have these
// ============================================

// Inline - compact card shown in chat history
export const Inline: Story = {
  args: {
    displayState: "inline",
    transferData: defaultTransferData,
    availableAccounts: defaultAvailableAccounts,
    beneficiaries: defaultBeneficiaries,
  },
  parameters: {
    layout: "padded",
    workflowSize: { width: 400, height: 120 },
  },
};

// Focused - full widget when user opens focus mode
export const Focused: Story = {
  args: {
    displayState: "focused",
    transferData: defaultTransferData,
    availableAccounts: defaultAvailableAccounts,
    beneficiaries: defaultBeneficiaries,
    editable: true,
  },
};

// ============================================
// COMPONENT-SPECIFIC VARIATIONS
// ============================================

// Empty state - no data pre-filled
export const Empty: Story = {
  args: {
    displayState: "focused",
    transferData: {},
    availableAccounts: defaultAvailableAccounts,
    beneficiaries: defaultBeneficiaries,
    editable: true,
  },
};

// International transfer
export const International: Story = {
  args: {
    displayState: "focused",
    transferData: internationalTransferData,
    availableAccounts: defaultAvailableAccounts,
    beneficiaries: defaultBeneficiaries,
    editable: true,
  },
};

// Completed transfer
export const Completed: Story = {
  args: {
    displayState: "focused",
    transferData: completedTransferData,
    availableAccounts: defaultAvailableAccounts,
    beneficiaries: defaultBeneficiaries,
    editable: false,
  },
};
