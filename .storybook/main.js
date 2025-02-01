import webpack from 'webpack';

const { alias } = require('../webpack/common');
const path = require('path');
const pathToInlineSvg = path.resolve(__dirname, '../public/svg/');

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: [
    '../src/components/stories/*.mdx',
    '../src/components/stories/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-onboarding',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
  },
  webpackFinal: async (config) => {
    config.resolve.alias = alias;
    const rules = config.module.rules;
    const fileLoaderRule = rules.find((rule) => rule.test.test('.svg'));
    fileLoaderRule.exclude = pathToInlineSvg;
    rules.push({
      test: /\.svg$/,
      include: pathToInlineSvg,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,
            svgo: false,
          },
        },
        {
          loader: 'url-loader',
        },
      ],
    });
    config.plugins.push(
      new webpack.ProvidePlugin({
        React: 'react',
      }),
    );
    return config;
  },
};
export default config;
