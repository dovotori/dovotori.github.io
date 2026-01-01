import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import webpack from "webpack";
import { alias } from "../webpack/common.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pathToInlineSvg = path.resolve(__dirname, "../public/svg/");

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: [
    "../src/components/stories/*.mdx",
    "../src/components/stories/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  staticDirs: ["../public"],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-webpack5",
  },
  docs: {
    defaultName: "Documentation",
  },
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = alias;
    const rules = config.module.rules;
    const fileLoaderRule = rules.find(
      (rule) => rule.test && rule.test.test && rule.test.test(".svg")
    );
    if (fileLoaderRule) fileLoaderRule.exclude = pathToInlineSvg;
    rules.push({
      test: /\.svg$/,
      include: pathToInlineSvg,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            svgo: false,
          },
        },
        {
          loader: "url-loader",
        },
      ],
    });
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.ProvidePlugin({
        React: "react",
      })
    );
    return config;
  },
};

export default config;
