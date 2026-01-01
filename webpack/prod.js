import path from "node:path";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import SwCachePlugin from "sw-cache-plugin";
import webpack from "webpack";
import config from "../package.json" with { type: "json" };
import { __dirname, alias, compression, minify, optimization, rules } from "./common";

const BUILD_PATH = path.resolve(__dirname, "../build");
const SRC_ASSET_PATH = path.resolve(__dirname, "../public");
const BUILD_ASSET_PATH = process.env.ASSET_PATH || "/public";

export default {
  mode: "production",
  entry: {
    polyfill: "@babel/polyfill",
    [config.name]: path.resolve(__dirname, "../src/index.jsx"),
  },
  output: {
    path: `${BUILD_PATH}/public/js/`,
    publicPath: `${BUILD_ASSET_PATH}/js/`,
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
      title: config.name,
      filename: `${BUILD_PATH}/index.html`,
      inject: "body",
      base: BUILD_ASSET_PATH,
      template: path.resolve(__dirname, "./templates/index.ejs"),
      minify,
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
        ASSET_PATH: JSON.stringify(BUILD_ASSET_PATH),
        NAME: JSON.stringify(config.name),
        MAIL: JSON.stringify(config.author.email),
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: SRC_ASSET_PATH,
          to: `${BUILD_PATH}${BUILD_ASSET_PATH}`,
          globOptions: {
            dot: true,
            ignore: [`**/sw.js`],
          },
        },
        {
          from: `${SRC_ASSET_PATH}/sw.js`,
          to: `${BUILD_PATH}/sw.js`,
        },
      ],
    }),
    new SwCachePlugin({
      cacheName: `v${config.version}`,
      ignore: [/.*\.map$/],
      include: ["/"],
      additionalCode: `
    // App version: ${config.version}
    const APP_VERSION = '${config.version}';
    
    // Force update on new versions
    self.addEventListener('install', event => self.skipWaiting());
    self.addEventListener('activate', event => {
      // Clean up old caches
      event.waitUntil(
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              if (cacheName !== 'v${config.version}') {
                return caches.delete(cacheName);
              }
            })
          );
        })
      );
      
      // Take control of uncontrolled clients
      return self.clients.claim();
    });
  `,
    }),
    ...compression,
  ],
};
