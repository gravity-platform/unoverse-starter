import { createMockClients } from "../core";

export const { mockClientInitial } = createMockClients([]);

const baseDefaults = {
  assistantName: "Aiya",
  assistantSubtitle: "MIRO Assistant",
  brandName: "Aiya",
  logoUrl:
    "https://res.cloudinary.com/sonik/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1742546227/BookSwipe/girl.jpg",
};

export const MiroChatDefaults = baseDefaults;

export const MiroChatConnected = {
  ...baseDefaults,
  _storybook_connected: true,
};

export const MiroChatSpeaking = {
  ...baseDefaults,
  _storybook_connected: true,
  _storybook_speaking: true,
};

export const MiroChatListening = {
  ...baseDefaults,
  _storybook_connected: true,
  _storybook_listening: true,
};
