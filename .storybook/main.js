// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { createRequire } from "node:module";
import webpack from "webpack";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const { alias } = require("../webpack/common");
const path = require("path");
const pathToInlineSvg = path.resolve(__dirname, "../public/svg/");

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
	stories: [
		"../src/components/stories/*.mdx",
		"../src/components/stories/*.stories.@(js|jsx|mjs|ts|tsx)",
	],
	addons: [
        "@storybook/addon-webpack5-compiler-swc",
        "@storybook/addon-onboarding",
        "@chromatic-com/storybook",
        "@storybook/addon-docs"
    ],
	framework: {
		name: "@storybook/react-webpack5",
	},
	webpackFinal: async (config) => {
		config.resolve.alias = alias;
		const rules = config.module.rules;
		const fileLoaderRule = rules.find((rule) => rule.test.test(".svg"));
		fileLoaderRule.exclude = pathToInlineSvg;
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
		config.plugins.push(
			new webpack.ProvidePlugin({
				React: "react",
			}),
		);
		return config;
	},
};
export default config;
