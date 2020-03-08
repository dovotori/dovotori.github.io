const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const config = require('../package.json');

const BUILD_PATH = path.resolve(__dirname, '../build');
const ASSET_PATH = process.env.ASSET_PATH || '/public';

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, '../src/index.jsx'),
  output: {
    path: `${BUILD_PATH}/public/js/`,
    publicPath: `${ASSET_PATH}/js/`,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'url-loader?name=/img/[name].[ext]?[hash]?limit=100000',
      },
      {
        test: /\.svg$/,
        use: {
          loader: '@svgr/webpack',
          options: {
            svgo: false,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      Assets: path.resolve(__dirname, '../assets/'),
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6,
          warnings: false,
          sourceMap: false,
        },
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: config.name,
      filename: `${BUILD_PATH}/index.html`,
      inject: 'body',
      base: ASSET_PATH,
      template: path.resolve(__dirname, '../src/templates/index.ejs'),
      minify: {
        collapseWhitespace: true,
        preserveLineBreaks: false,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
      },
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        ASSET_PATH: JSON.stringify(ASSET_PATH),
        NAME: JSON.stringify(config.name),
      },
    }),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, '../src/utils/serviceWorker.js'),
    }),
    new CopyWebpackPlugin([{ from: './assets/', to: '../' }]),
    new CompressionPlugin({
      test: /\.(js|css|svg|jpg|png|html)$/,
      algorithm: 'gzip',
      deleteOriginalAssets: false,
      filename: '[path].gz[query]',
      threshold: 0,
      minRatio: 1,
    }),
    new CompressionPlugin({
      test: /\.(js|css|svg|jpg|png|html)$/,
      algorithm: 'brotliCompress',
      deleteOriginalAssets: false,
      filename: '[path].br[query]',
      threshold: 0,
      minRatio: 1,
    }),
  ],
};
