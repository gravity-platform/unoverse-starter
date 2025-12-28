/**
 * Shared AWS Credential Definition
 * Used by all AWS-based service packages (Nova, Bedrock, etc.)
 */

export const AWSCredential = {
  name: "awsCredential",
  displayName: "AWS Credentials",
  description: "AWS credentials for AWS services (Bedrock, Nova, etc.)",
  properties: [
    {
      name: "accessKeyId",
      displayName: "Access Key ID",
      type: "string" as const,
      required: true,
      secret: true,
      description: "Your AWS Access Key ID",
      placeholder: "AKIAIOSFODNN7EXAMPLE"
    },
    {
      name: "secretAccessKey",
      displayName: "Secret Access Key",
      type: "string" as const,
      required: true,
      secret: true,
      description: "Your AWS Secret Access Key",
      placeholder: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
    },
    {
      name: "region",
      displayName: "AWS Region",
      type: "string" as const,
      default: "us-east-1",
      required: false,
      description: "AWS region for services",
      placeholder: "us-east-1"
    },
  ],
};
