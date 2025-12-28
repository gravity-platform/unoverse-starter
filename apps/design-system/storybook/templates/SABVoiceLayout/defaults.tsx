/**
 * Default values for SABVoiceLayout Storybook demos
 */

import { createMockClients } from "../core";

// SABVoiceLayout doesn't render components from history - it's a voice-only template
export const { mockClientInitial } = createMockClients([]);

// Base defaults
const baseDefaults = {
  assistantName: "SAB Assistant",
  assistantSubtitle: "Your AI Voice Assistant",
  brandName: "SAB Voice",
  logoUrl:
    "https://res.cloudinary.com/sonik/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1765613643/gravity/face.webp",
};

// Story-specific defaults
export const SABVoiceLayoutDefaults = baseDefaults;

export const SABVoiceLayoutConnected = {
  ...baseDefaults,
  _storybook_connected: true,
};

export const SABVoiceLayoutSpeaking = {
  ...baseDefaults,
  _storybook_connected: true,
  _storybook_speaking: true,
};

export const SABVoiceLayoutListening = {
  ...baseDefaults,
  _storybook_connected: true,
  _storybook_listening: true,
};
