import type { StorybookConfig } from "@storybook/react-webpack5";
//https://storybook.js.org/addons/@storybook/addon-postcss

const config: StorybookConfig = {
  staticDirs : ["../images"],
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    {
      /**
       * Fix Storybook issue with PostCSS@8
       * @see https://github.com/storybookjs/storybook/issues/12668#issuecomment-773958085
       */
      name: "@storybook/addon-postcss",
      options: {
        postcssLoaderOptions: {
          implementation: require("postcss"),
        },
      },
    },
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-styling-webpack",
    // "@storybook/addon-styling",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
};
export default config;
