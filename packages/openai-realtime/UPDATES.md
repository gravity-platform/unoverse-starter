# OpenAI Realtime Package Updates

## Changes Made (2026-05-25)

### 1. Model Identifier ✅
- **Correct**: `gpt-realtime-2` (was already correct)

### 2. Turn Detection Options ✅
- Changed from `"server_vad" | "manual"` to `"server_vad" | "disabled"`
- Matches actual OpenAI Realtime API specification
- UI now shows: "Server VAD (automatic)" and "Disabled"

### 3. Node Naming ✅
- Changed from "ChatGPT Realtime Voice" to "OpenAI Realtime Voice"
- More accurate branding

### 4. Descriptions ✅
- Updated to mention `gpt-realtime-2` specifically
- Removed generic "GPT-4o" references

### 5. Voice Options ✅ (Already Correct)
All 8 voices per OpenAI API:
- alloy (default)
- ash
- ballad
- coral
- echo
- sage
- shimmer
- verse

### 6. VAD Configuration ✅ (Already Correct)
Default values in `constants.ts`:
```typescript
{
  type: "server_vad",
  threshold: 0.5,
  prefix_padding_ms: 300,
  silence_duration_ms: 500,
}
```

## Configuration Matches Screenshot

Based on https://developers.openai.com/api/docs/guides/realtime screenshot:

| Field | Value | Status |
|-------|-------|--------|
| Voice dropdown | "Alloy" | ✅ |
| Turn Detection | "Server VAD (automatic)" | ✅ |
| Temperature | 0.8 (range 0.0-1.0) | ✅ |

## Package Location

**Path**: `/packages/openai-realtime/`  
**Type**: Starter kit package (NOT marketplace)
- Ships with every deployment
- Loaded from local filesystem
- Part of root workspace

## API Details

**Model**: `gpt-realtime-2`  
**WebSocket**: `wss://api.openai.com/v1/realtime?model=gpt-realtime-2`  
**Auth**: Bearer token in WebSocket connection headers

## Next Steps

1. ✅ Package built successfully
2. Test with real OpenAI API key
3. Verify WebSocket connection
4. Test all 8 voices
5. Test server VAD vs disabled modes
6. Test MCP tool discovery
7. Verify audio streaming to Redis

## Differences from xAI Grok

| Feature | xAI Grok | OpenAI Realtime |
|---------|----------|-----------------|
| Model | grok-3 | gpt-realtime-2 |
| Voices | 5 | 8 |
| Turn Detection | server_vad / manual | server_vad / disabled |
| Credentials | ❌ Uses deprecated API | ✅ Field signature pattern |
| Event Format | Custom Grok events | OpenAI Realtime events |

## Build Status

✅ TypeScript compilation successful  
✅ All types validated  
✅ Documentation updated
