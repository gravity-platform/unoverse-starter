/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    "../storybook/atoms/**/*.stories.@(js|jsx|ts|tsx)",
    "../storybook/components/**/*.stories.@(js|jsx|ts|tsx)",
    "../storybook/templates/**/*.stories.@(js|jsx|ts|tsx)",
  ],

  addons: [],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  }
};

export default config;
