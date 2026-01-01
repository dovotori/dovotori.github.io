import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import config from "../package.json" with { type: "json" };
import { __dirname, alias, rules } from "./common.js";

const port = process.env.PORT || 8080;
const host = process.env.HOST || "0.0.0.0";

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify("development"),
      ASSET_PATH: JSON.stringify("/public"),
      NAME: JSON.stringify(config.name),
      MAIL: JSON.stringify(config.author.email),
    },
  }),
  new HtmlWebpackPlugin({
    title: config.name,
    filename: "index.html",
    inject: "body",
    base: "/public",
    chunks: ["polyfill", "hot", "devserver", "main"],
    template: path.resolve(__dirname, "./templates/index.ejs"),
  }),
];

export default {
  mode: "development",
  entry: {
    polyfill: "@babel/polyfill",
    main: "./src/index",
  },
  target: "web",
  output: {
    publicPath: "/",
    filename: "[name].js",
  },
  devtool: "inline-source-map",
  module: {
    rules,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias,
  },
  plugins,
  devServer: {
    server: "https",
    host,
    historyApiFallback: true,
    port,
    static: {
      directory: path.join(__dirname, "../public"),
      publicPath: "/public/",
      watch: false,
    },
  },
};
