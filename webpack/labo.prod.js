import path from "node:path";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import { __dirname, alias, compression, getHtml, minify, optimization, rules } from "./common.js";

const BUILD_ASSET_PATH = process.env.ASSET_PATH || "/public";
const SRC_ASSET_PATH = path.resolve(__dirname, "../public");

const configPromise = async (_env, _options, name = process.env.NAME || "labo") => {
  const html = await getHtml(name);
  const BUILD_PATH = path.resolve(__dirname, `../build/`);
  return {
    mode: "production",
    entry: ["@babel/polyfill", path.resolve(__dirname, `../labo/${name}/standalone.js`)],
    output: {
      path: BUILD_PATH,
      publicPath: "/",
      filename: "[name].js",
    },
    target: "web",
    module: {
      rules,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      alias,
    },
    optimization,
    plugins: [
      new HtmlWebpackPlugin({
        title: name,
        filename: `${BUILD_PATH}/index.html`,
        inject: "body",
        html,
        base: BUILD_ASSET_PATH,
        template: path.resolve(__dirname, "./templates/labo.ejs"),
        minify,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: SRC_ASSET_PATH,
            to: `${BUILD_PATH}${BUILD_ASSET_PATH}`,
            globOptions: {
              dot: true,
              ignore: [`${SRC_ASSET_PATH}/app/`],
            },
          },
        ],
      }),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production"),
          ASSET_PATH: JSON.stringify(BUILD_ASSET_PATH),
          NAME: JSON.stringify(name),
        },
      }),
      ...compression,
    ],
  };
};

export default configPromise;
