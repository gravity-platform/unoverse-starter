# Credential Management

**The One Rule: Nodes NEVER touch credentials. Services read credentials from `credentialContext.credentials`.**

## ✅ CORRECT Pattern

The platform resolves credentials into `context.credentials` before execution. Services read them directly from there — no async fetch required.

### 1. Node Level (Executor)

```typescript
// ✅ CORRECT: Build credential context and pass to service
protected async executeNode(inputs, config, context) {
  const credentialContext = this.buildCredentialContext(context);
  const result = await myService(config, credentialContext, context.api);
  return { __outputs: result };
}

private buildCredentialContext(context: NodeExecutionContext) {
  const { workflowId, executionId, nodeId } = this.validateAndGetContext(context);
  return {
    workflowId, executionId, nodeId,
    nodeType: this.nodeType,
    config: context.config,
    credentials: context.credentials || {},
  };
}
```

### 2. Service Level

```typescript
// ✅ CORRECT: Read directly from credentialContext.credentials
export async function myService(config: any, credentialContext: any, api?: any) {
  const available = credentialContext.credentials || {};

  // Find your credential by a known field signature
  let creds: any;
  for (const val of Object.values(available)) {
    if ((val as any)?.apiKey) { creds = val; break; }
  }

  if (!creds?.apiKey) {
    throw new Error("myCredential missing apiKey");
  }

  // Use the credential
  return await externalAPI.call(creds.apiKey, config.data);
}

// ❌ WRONG: api.getNodeCredentials() does not reliably return credentials
// const creds = await api.getNodeCredentials(credentialContext, "myCredential");
```

## Real Example — OpenAI

```typescript
// packages/openai/src/shared/openaiStream/client/openaiClient.ts
export async function initializeOpenAIClient(context: any, logger: any, api?: any) {
  const availableCredentials = context.credentials || {};

  let credentials: OpenAICredentials | undefined;
  for (const [name, cred] of Object.entries(availableCredentials)) {
    if ((cred as any)?.apiKey) {
      credentials = cred as OpenAICredentials;
      break;
    }
  }

  if (!credentials?.apiKey) {
    throw new Error("OpenAI API key not found in credentials");
  }

  return new OpenAI({ apiKey: credentials.apiKey });
}
```

## 🏗️ Credential Context Structure

```typescript
interface CredentialContext {
  workflowId: string;
  executionId: string;
  nodeId: string;
  nodeType: string;
  config: any;
  credentials: Record<string, any>; // Platform-resolved credential values, keyed by credential name
}
```

## 📋 Complete Implementation

### 1. Node Definition — Declare Credentials

```typescript
export const MyNode: EnhancedNodeDefinition = {
  type: "MyNode",
  // ...
  credentials: [
    {
      name: "myCredential",
      type: "myCredentialType",
      required: true,
    },
  ],
};
```

### 2. Credential Definition

```typescript
// src/credentials/index.ts
export const MyCredential = {
  name: "myCredential",
  displayName: "My Service",
  description: "Credentials for My Service",
  properties: [
    {
      name: "apiKey",
      displayName: "API Key",
      type: "string" as const,
      required: true,
      secret: true,
      description: "Your API key",
    },
  ],
};
```

### 3. Service — Read Credentials

```typescript
export async function myService(config: any, credentialContext: any, api?: any) {
  const available = credentialContext.credentials || {};

  let creds: any;
  for (const val of Object.values(available)) {
    if ((val as any)?.apiKey) { creds = val; break; }
  }

  if (!creds?.apiKey) throw new Error("API key not found in credentials");

  const response = await fetch(config.apiEndpoint, {
    headers: { Authorization: `Bearer ${creds.apiKey}` },
  });

  return response.json();
}
```

## 🚨 Common Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| `"Credentials are required"` | Missing `credentials: [...]` on node definition | Add credential declaration |
| `"Credential not found"` | Config missing credential ID | Populate credential ID in node config UI |
| Empty/undefined credential values | Using `api.getNodeCredentials()` | Read from `credentialContext.credentials` directly |

## 🔗 Study Real Implementations

- `@gravity-platform/openai` — `openaiClient.ts` — canonical pattern for reading from `context.credentials`
- `@gravity-platform/miro-bridge` — `mcpHandlers.ts` — same pattern for bearer token auth

---

**Next**: [Troubleshooting](./05-troubleshooting.md)