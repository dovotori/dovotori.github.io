const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SwCachePlugin = require('sw-cache-plugin');

const config = require('../package.json');
const { alias, optimization, minify, rules, compression } = require('./common');

const BUILD_PATH = path.resolve(__dirname, '../build');
const SRC_ASSET_PATH = path.resolve(__dirname, '../public');
const BUILD_ASSET_PATH = process.env.ASSET_PATH || '/public';

module.exports = {
  mode: 'production',
  entry: {
    polyfill: '@babel/polyfill',
    [config.name]: path.resolve(__dirname, '../src/index.jsx'),
  },
  output: {
    path: `${BUILD_PATH}/public/js/`,
    publicPath: `${BUILD_ASSET_PATH}/js/`,
    filename: '[name].js',
  },
  target: 'web',
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias,
  },
  optimization,
  plugins: [
    new HtmlWebpackPlugin({
      title: config.name,
      filename: `${BUILD_PATH}/index.html`,
      inject: 'body',
      base: BUILD_ASSET_PATH,
      template: path.resolve(__dirname, './templates/index.ejs'),
      minify,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
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
      cacheName: 'v1',
      ignore: [/.*\.map$/],
      include: ['/'],
    }),
    ...compression,
  ],
};
