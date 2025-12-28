import React from 'react';
import '../storybook/styles/index.css';

// Make React available globally for all stories
window.React = React;

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: {
      argTypesRegex: "^on[A-Z].*",
      disable: true, // Disable implicit actions globally
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
