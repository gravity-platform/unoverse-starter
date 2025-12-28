/**
 * Shared OpenAI Credential Definition
 * Used by OpenAI service package
 */

export const OpenAICredential = {
  name: "openAICredential",
  displayName: "OpenAI",
  description: "Credentials for OpenAI API",
  properties: [
    {
      name: "apiKey",
      displayName: "API Key",
      type: "string" as const,
      required: true,
      secret: true,
      description: "Your OpenAI API key",
      placeholder: "sk-..."
    },
    {
      name: "organizationId",
      displayName: "Organization ID",
      type: "string" as const,
      required: false,
      description: "Your OpenAI organization ID (optional)",
      placeholder: "org-..."
    },
    {
      name: "baseUrl",
      displayName: "Base URL",
      type: "string" as const,
      default: "https://api.openai.com/v1",
      required: false,
      description: "Custom API endpoint (optional)"
    }
  ]
};
