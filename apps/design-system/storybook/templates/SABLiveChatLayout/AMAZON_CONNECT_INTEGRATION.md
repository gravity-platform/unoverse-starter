# Amazon Connect Integration for ChatLayoutCompact

<!-- LLM: This document describes how to integrate Amazon Connect live agent chat with the ChatLayoutCompact template. The template is a self-contained micro-app that manages its own Amazon Connect connection while using shared Zustand history. -->

## Overview

`ChatLayoutCompact` is a **self-contained template** that can operate in two modes:

1. **AI Mode** - Messages route to Gravity workflow (standard)
2. **Live Agent Mode** - Messages route to Amazon Connect (via client-side SDK)

**Key Architecture Decision**: The template owns the Amazon Connect connection, but writes to **shared Zustand history**. This enables seamless hot-swapping between templates while maintaining conversation continuity.

---

## Core Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SHARED STATE (Zustand / GravityClient)                                 │
│                                                                          │
│  history: [                                                              │
│    { type: "user_message", content: "What's my balance?" }              │
│    { type: "assistant_response", ... }  ← AI                            │
│    { type: "user_message", content: "Talk to someone" }                 │
│    { type: "assistant_response", ... }  ← AI                            │
│    { type: "user_message", content: "Hi, I need help" }                 │
│    { type: "assistant_response", ... }  ← Agent (same format!)          │
│  ]                                                                       │
│                                                                          │
│  ↑ Same history, same format, seamless conversation                     │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  ChatLayoutCompact (Self-Contained Template / Micro-App)                │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  useGravityClient(client)                                           ││
│  │  ├─ history (read from Zustand)                                     ││
│  │  ├─ addUserMessage() (write to Zustand)                             ││
│  │  └─ addResponse() (write to Zustand)                                ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  useAmazonConnect(config)  ← Template's own hook                    ││
│  │  ├─ amazon-connect-chatjs SDK                                       ││
│  │  ├─ Session management                                              ││
│  │  ├─ Connection lifecycle                                            ││
│  │  └─ onAgentMessage → addResponse() (writes to shared history)       ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  Message Routing:                                                        │
│  ├─ if (isConnected) → sendToAgent() → Amazon Connect                  │
│  └─ else → sendToGravity() → WebSocket → Workflow                      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Why This Architecture is Powerful

### 1. Seamless Template Hot-Swap

Templates can be swapped mid-conversation. History persists in Zustand.

```typescript
// Client app can swap templates freely
{
  isLiveAgentMode ? <ChatLayoutCompact client={client} amazonConnectConfig={config} /> : <ChatLayout client={client} />;
}
// Same history renders in both!
```

### 2. Unified History Format

AI and agent messages use identical `AssistantResponse` structure:

```typescript
// AI response (from workflow)
{
  type: "assistant_response",
  components: [{ type: "AIResponse", props: { content: "Your balance is $1,234" } }]
}

// Agent response (from Amazon Connect) - SAME FORMAT
{
  type: "assistant_response",
  components: [{ type: "AIResponse", props: { content: "Hi! I can help with that." } }]
}
```

### 3. Template is Self-Contained

The template owns its Amazon Connect connection:

- No workflow node needed
- No server-side complexity
- SDK runs client-side (as designed)
- Template manages session lifecycle

### 4. Future Platform Support

Same pattern works for other platforms:

- `ChatLayoutCompact` + Salesforce config → Salesforce Live Agent
- `ChatLayoutCompact` + Zendesk config → Zendesk Chat
- Just swap the hook implementation

---

## Handoff Flow Example

```
1. User: "What's my balance?"
   → ChatLayout (AI mode)
   → Gravity workflow responds
   → History: [user, ai_response]

2. User: "I want to speak to someone"
   → ChatLayout (AI mode)
   → Workflow responds: "Connecting you..."
   → Workflow triggers template switch (metadata)
   → Client swaps to ChatLayoutCompact
   → Template connects to Amazon Connect
   → History: [user, ai, user, ai] (intact!)

3. User: "Hi, I have a question"
   → ChatLayoutCompact (Live Agent mode)
   → Message goes to Amazon Connect
   → Agent responds
   → History: [user, ai, user, ai, user, agent] (seamless!)

4. Agent ends chat
   → Template disconnects
   → Client swaps back to ChatLayout
   → History: still intact, continuous conversation
```

---

## Alignment with Template Patterns

Per `/templates/README.md`:

### ✅ History Is Universal

> "Same history works for any template. Client can switch templates mid-conversation."

**Implementation**: Template writes to shared Zustand via `client.history.addResponse()`. Agent messages use same `AssistantResponse` format as AI.

### ✅ Templates Are Composable

> "Can fetch their own data (e.g., booking engine fetches room types)"

**Implementation**: Template manages its own Amazon Connect connection. This is similar to how a booking template might manage its own booking engine connection.

### ✅ Component Data Lives in Zustand

> "Components = Pure React components. Templates = Can use components anywhere."

**Implementation**: History lives in Zustand, template just renders it. Template can be swapped without losing state.

---

## Template Implementation

### File Structure

```
ChatLayoutCompact/
├── ChatLayoutCompact.tsx           # Main template
├── ChatLayoutCompact.module.css    # Styles
├── types.ts                        # Props interface
├── defaults.tsx                    # Storybook defaults
├── components/
│   ├── ChatHistory.tsx             # Renders unified history
│   ├── ChatInput.tsx               # Input (routes based on mode)
│   └── LiveAgentBanner.tsx         # Connection status
├── hooks/
│   └── useAmazonConnect.ts         # Amazon Connect SDK wrapper
└── lib/
    ├── amazonConnectSession.ts     # Session management
    └── messageTransformer.ts       # AC message → AssistantResponse
```

### Core Hook: `useAmazonConnect`

```typescript
// hooks/useAmazonConnect.ts
import "amazon-connect-chatjs";

interface AmazonConnectConfig {
  apiGatewayEndpoint: string;
  contactFlowId: string;
  instanceId: string;
  region: string;
}

interface CustomerInfo {
  name: string;
  email?: string;
}

export function useAmazonConnect(config: AmazonConnectConfig, onAgentMessage: (response: AssistantResponse) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = async (customerInfo: CustomerInfo) => {
    setIsConnecting(true);
    setError(null);

    try {
      // 1. Get participant token via API Gateway
      const response = await fetch(config.apiGatewayEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactFlowId: config.contactFlowId,
          instanceId: config.instanceId,
          participantDetails: { DisplayName: customerInfo.name },
        }),
      });

      const { ContactId, ParticipantId, ParticipantToken } = await response.json();

      // 2. Initialize ChatJS session
      const chatSession = connect.ChatSession.create({
        chatDetails: { ContactId, ParticipantId, ParticipantToken },
        type: "CUSTOMER",
        region: config.region,
      });

      // 3. Subscribe to agent messages
      chatSession.onMessage((event) => {
        if (event.data.ParticipantRole === "AGENT") {
          const response = transformToAssistantResponse(event.data);
          onAgentMessage(response);
        }
      });

      chatSession.onEnded(() => {
        setIsConnected(false);
        setSession(null);
      });

      await chatSession.connect();
      setSession(chatSession);
      setIsConnected(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!session) return;
    await session.sendMessage({ content, contentType: "text/plain" });
  };

  const disconnect = () => {
    session?.disconnectParticipant();
    setIsConnected(false);
    setSession(null);
  };

  return { isConnected, isConnecting, error, connect, sendMessage, disconnect };
}
```

### Message Transformer

```typescript
// lib/messageTransformer.ts
import { AssistantResponse, ResponseComponent } from "../../core/types";

export function transformToAssistantResponse(acMessage: any): AssistantResponse {
  const content = parseContent(acMessage.Content, acMessage.ContentType);

  return {
    id: `ac-${acMessage.Id}`,
    type: "assistant_response",
    role: "assistant",
    streamingState: "complete",
    timestamp: new Date(acMessage.AbsoluteTime).toISOString(),
    components: [
      {
        id: `comp-${acMessage.Id}`,
        componentType: "AIResponse",
        props: { content },
      },
    ],
  };
}

function parseContent(content: string, contentType: string): string {
  // Handle interactive messages (ListPicker, TimePicker, etc.)
  if (contentType === "application/vnd.amazonaws.connect.message.interactive") {
    const parsed = JSON.parse(content);
    if (parsed.templateType === "ListPicker") {
      // Could return structured data for a ListPicker component
      return parsed.data.content.title;
    }
  }
  return content;
}
```

### Template Usage

```typescript
// ChatLayoutCompact.tsx
export default function ChatLayoutCompact({ client, amazonConnectConfig }: ChatLayoutCompactProps) {
  const { history, addUserMessage, addResponse } = useGravityClient(client);

  // Template's own Amazon Connect hook
  const amazonConnect = useAmazonConnect(amazonConnectConfig, (response) => {
    // Agent message → write to shared history
    addResponse(response);
  });

  const handleSend = (message: string) => {
    addUserMessage(message);

    if (amazonConnect.isConnected) {
      amazonConnect.sendMessage(message); // → Amazon Connect
    } else {
      client.websocket.sendUserAction("message", { content: message }); // → Workflow
    }
  };

  return (
    <div className={styles.container}>
      {amazonConnect.isConnected && <LiveAgentBanner />}
      {amazonConnect.isConnecting && <ConnectingBanner />}
      <ChatHistory history={history} />
      <ChatInput onSend={handleSend} />
    </div>
  );
}
```

---

## Backend Requirements

### API Gateway + Lambda

Amazon Connect requires server-side token generation:

```
Client → API Gateway → Lambda → Amazon Connect StartChatContact API
                                       ↓
                              Returns ParticipantToken
                                       ↓
Client ← Uses token with ChatJS SDK
```

**Lambda function** (simplified):

```javascript
const AWS = require("aws-sdk");
const connect = new AWS.Connect();

exports.handler = async (event) => {
  const { contactFlowId, instanceId, participantDetails } = JSON.parse(event.body);

  const response = await connect
    .startChatContact({
      ContactFlowId: contactFlowId,
      InstanceId: instanceId,
      ParticipantDetails: participantDetails,
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
```

---

## Session Lifecycle

```
1. User clicks "Talk to Agent"
   → Template shows customer info form (name/email)

2. Form submits
   → connect(customerInfo)
   → API Gateway → Lambda → Amazon Connect
   → Returns tokens
   → ChatJS connects
   → isConnected = true

3. User sends message
   → handleSend() routes to amazonConnect.sendMessage()
   → Message goes to agent

4. Agent replies
   → onMessage callback fires
   → transformToAssistantResponse()
   → addResponse() writes to shared Zustand history
   → Template re-renders with new message

5. Agent ends chat
   → onEnded callback fires
   → isConnected = false
   → Template continues with AI mode
   → History remains intact
```

---

## Dependencies

**Template package.json**:

```json
{
  "dependencies": {
    "amazon-connect-chatjs": "^1.5.0"
  }
}
```

---

## Configuration

### Props

```typescript
interface ChatLayoutCompactProps extends GravityTemplateProps {
  placeholder?: string;
  autoScroll?: boolean;

  // Amazon Connect configuration (optional)
  amazonConnectConfig?: {
    apiGatewayEndpoint: string;
    contactFlowId: string;
    instanceId: string;
    region: string;
  };
}
```

### Environment Variables

These match the legacy yodaBank config structure:

```bash
# Amazon Connect Configuration
VITE_CONTACT_FLOW_ID=arn:aws:connect:region:account:instance/xxx/contact-flow/xxx
VITE_INSTANCE_ID=arn:aws:connect:region:account:instance/xxx
VITE_API_GATEWAY_ENDPOINT=https://xxx.execute-api.region.amazonaws.com/prod/start-chat
VITE_CONNECT_REGION=us-east-1

# Optional: Additional endpoints from legacy
VITE_APS_CUSTOMER_ENDPOINT=https://xxx.awsapps.com/connect/api
VITE_CLOUDFRONT_ENDPOINT=https://xxx.cloudfront.net
```

### Config Object (matches legacy `appSyncConfig.amazonConnectConfig`)

```typescript
const amazonConnectConfig = {
  contactFlowId: import.meta.env.VITE_CONTACT_FLOW_ID,
  instanceId: import.meta.env.VITE_INSTANCE_ID,
  apiGatewayEndpoint: import.meta.env.VITE_API_GATEWAY_ENDPOINT,
  region: import.meta.env.VITE_CONNECT_REGION,
};
```

---

## Implementation Checklist

### Phase 1: Template Hook & Lib ✅ COMPLETE

- [x] Create `hooks/useAmazonConnect.ts`
- [x] Create `lib/messageTransformer.ts`
- [x] Create template `package.json` with `amazon-connect-chatjs` dependency

### Phase 2: Template Integration ✅ COMPLETE

- [x] Update `ChatLayoutCompact.tsx` to use `useAmazonConnect`
- [x] Add `amazonConnectConfig` to props interface
- [x] Implement message routing in `handleSend()`
- [x] Add `LiveAgentBanner` component
- [x] Add `ConnectToAgentButton` component

---

## Template as Micro-App

This template is a **self-contained micro-app** with its own dependencies.

### File Structure

```
ChatLayoutCompact/
├── package.json                    # Template-specific deps (amazon-connect-chatjs)
├── ChatLayoutCompact.tsx           # Main template component
├── ChatLayoutCompact.module.css
├── types.ts                        # AmazonConnectConfig, ConnectionStatus
├── hooks/
│   └── useAmazonConnect.ts         # SDK wrapper hook
├── lib/
│   └── messageTransformer.ts       # AC → AssistantResponse converter
├── components/
│   ├── LiveAgentBanner.tsx         # Connection status UI
│   ├── ConnectToAgentButton.tsx    # Connect trigger with form
│   └── ...
└── AMAZON_CONNECT_INTEGRATION.md   # This document
```

### Template Dependencies

The template has its own `package.json`:

```json
{
  "name": "@gravityai-dev/template-chat-layout-compact",
  "version": "1.0.0",
  "dependencies": {
    "amazon-connect-chatjs": "^1.5.0"
  }
}
```

**Why?**

- `amazon-connect-chatjs` is a specialized SDK not needed by other templates
- Keeps the core design-system package lean
- Template is self-contained and portable

### Installation

When using workspaces, run from the monorepo root:

```bash
npm install
```

This will install all template dependencies including `amazon-connect-chatjs`.

### Phase 3: Backend (If Not Exists)

- [ ] Create API Gateway endpoint
- [ ] Create Lambda for `StartChatContact`
- [ ] Configure CORS for client domain

### Phase 4: Storybook

- [ ] Add `LiveAgentConnecting` story
- [ ] Add `LiveAgentConnected` story
- [ ] Create mock client with agent messages

---

## Open Questions

1. **Customer info form** - Where does it live?

   - Option A: Template renders form when `connect()` is called
   - Option B: Workflow sends a form component first
   - Option C: Client app shows modal before loading template

2. **Agent avatar** - Differentiate from AI?

   - Could add `source: "agent" | "ai"` to `AssistantResponse` metadata
   - Template renders different avatar based on source

3. **Interactive messages** - ListPicker, TimePicker?
   - Phase 1: Render as plain text
   - Phase 2: Transform to Gravity components

---

## Legacy Reference

Key files from `/GenStack/lib/clients/yodaBank/src/`:

| Legacy File                             | Purpose                          |
| --------------------------------------- | -------------------------------- |
| `lib/amazonConnect/AC_chatManager.jsx`  | Session manager singleton        |
| `lib/amazonConnect/AC_chatSession.jsx`  | ChatJS wrapper                   |
| `context/amazonConnectContext.jsx`      | React context + message handling |
| `components/genui-talkToRealPerson.jsx` | Connection form UI               |

---

## Summary

**Architecture**: Template is a self-contained micro-app that:

1. Manages its own Amazon Connect connection (via `useAmazonConnect` hook)
2. Writes agent messages to shared Zustand history (same format as AI)
3. Routes user messages based on connection state
4. Enables seamless hot-swap between templates

**Key Benefits**:

- ✅ **Seamless handoff** - AI → Agent → AI with continuous history
- ✅ **Template hot-swap** - Switch templates mid-conversation
- ✅ **Unified history** - Same `AssistantResponse` format for all sources
- ✅ **Self-contained** - No workflow node needed, SDK runs client-side
- ✅ **Future-proof** - Same pattern for Salesforce, Zendesk, etc.
