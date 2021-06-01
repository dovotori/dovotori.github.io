const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = require('../package.json');
const { alias, optimization, minify, rules, laboEntries, compression } = require('./common');

const BUILD_PATH = path.resolve(__dirname, '../build');
const SRC_ASSET_PATH = path.resolve(__dirname, '../public');
const BUILD_ASSET_PATH = process.env.ASSET_PATH || '/public';

module.exports = {
  mode: 'production',
  entry: {
    polyfill: '@babel/polyfill',
    [config.name]: path.resolve(__dirname, '../src/index.jsx'),
    ...laboEntries,
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
            ignore: [
              `${SRC_ASSET_PATH}/app/*.xml`,
              `${SRC_ASSET_PATH}/app/*.json`,
              `${SRC_ASSET_PATH}/app/*.webapp`,
            ],
          },
        },
        {
          from: `${SRC_ASSET_PATH}/app/browserconfig.xml`,
          to: `${BUILD_PATH}/public/app/browserconfig.xml`,
        },
        {
          from: `${SRC_ASSET_PATH}/app/manifest.json`,
          to: `${BUILD_PATH}/public/app//manifest.json`,
        },
        {
          from: `${SRC_ASSET_PATH}/app/manifest.webapp`,
          to: `${BUILD_PATH}/public/app//manifest.webapp`,
        },
      ],
    }),
    ...compression,
  ],
};
