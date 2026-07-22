---
sidebarTitle: "Create Your First Agent"
---

# Create Your First Agent

Build a chat Agent in Canvas: a trigger that receives the message, a model that thinks, and a response that streams back. Ten minutes, no code.

## Before you begin

The platform is running (`unoverse dev`) and Canvas is open at http://localhost:3001. You have an OpenAI API key.

## Build it

<Steps>
<Step title="Add your OpenAI credential">

Open **Credentials** (http://localhost:3001/credentials) and click **Add Credential**. Select the **OpenAI API** type, name it, paste your API key, and save. Nodes never read keys from config or env files; they request credentials at execution time, decrypted and injected by the platform.

</Step>
<Step title="Create a workflow">

Click **Create New Workflow** and name it. An empty canvas opens.

</Step>
<Step title="Add three nodes">

Drag these onto the canvas and connect them left to right:

1. **InputTrigger** receives the user's message.
2. **OpenAIStream** sends it to the model and streams the reply.
3. **AIResponse** displays the reply to the user.

Connect InputTrigger's output to OpenAIStream's input, and OpenAIStream's output to AIResponse's input.

<Note>
Every node instance gets an id: its type, lowercased, plus a number. Your three nodes are `inputtrigger1`, `openaistream1`, and `airesponse1`. Downstream nodes read upstream outputs through these ids: `signal.<nodeId>.<output>`.
</Note>

</Step>
<Step title="Configure the model">

Click the OpenAIStream node to open its config panel:

- **Model**: pick a GPT-5.6 variant.
- **System Prompt**: `You are a helpful assistant.`
- **User Prompt**: `{{{signal.inputtrigger1.output.message}}}`

The triple braces are a Handlebars reference: at run time it resolves to the message the trigger received.

</Step>
<Step title="Configure the response">

Click the AIResponse node:

- **Main response text**: `return signal.openaistream1.chunk`

This field takes JavaScript. `chunk` is the model's streaming output, so text appears live as the model writes. The complete reply is also available as `signal.openaistream1.text` once the node finishes.

<Note>
Config fields accept two syntaxes: Handlebars (`{{{signal...}}}`) for templating text, and JavaScript (`return signal...`) for computing a value. Use either; don't mix them in one field.
</Note>

</Step>
<Step title="Save and test">

Save the workflow. Click **Test Inputs**, enter a message such as `What can you help me with?`, and set a test user id. Then run it: play each node one at a time to inspect its output, or run the whole workflow at once. Watch the reply stream into AIResponse.

</Step>
</Steps>

## Have Claude Code build it

Everything above, Claude Code can drive through the platform's builder MCP, registered by this repo's `.mcp.json`:

1. With the platform running, open this repo in Claude Code and approve the `unoverse-builder` server when it asks.
2. In Canvas, create a new empty workflow and copy the `wf-xxxxxx` id from the URL.
3. Ask:

> Bind workflow wf-xxxxxx, then build a chat agent: input trigger → OpenAI → response display. Test each stage with runTest before adding the next.

Claude binds to that one canvas, builds stage by stage, and runs each stage while you watch the nodes appear live. It can't see or touch any other workflow.

## Next steps

<Card title="Create your first node" icon="box" href="./03-create-your-first-node.md" horizontal>
Extend the platform with your own logic.
</Card>

<Card title="Ingest content to Spatial" icon="globe" href="./04-ingest-content-to-spatial.md" horizontal>
Ground your Agent's answers in your own content.
</Card>
