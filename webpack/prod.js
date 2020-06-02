const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const config = require('../package.json');

const BUILD_PATH = path.resolve(__dirname, '../build');
const SRC_ASSET_PATH = path.resolve(__dirname, '../assets');
const BUILD_ASSET_PATH = process.env.ASSET_PATH || '/public';

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, '../src/index.jsx'),
  output: {
    path: `${BUILD_PATH}/public/js/`,
    publicPath: `${BUILD_ASSET_PATH}/js/`,
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
        loader: 'url-loader?name=/img/[name].[ext]?[hash]',
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: false,
            },
          },
          {
            loader: 'url-loader'
          }
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      Assets: SRC_ASSET_PATH,
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
      base: BUILD_ASSET_PATH,
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        ASSET_PATH: JSON.stringify(BUILD_ASSET_PATH),
        NAME: JSON.stringify(config.name),
        MAIL: JSON.stringify(config.author.email),
      },
    }),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, '../src/utils/serviceWorker.js'),
    }),
    new CopyWebpackPlugin([{ from: SRC_ASSET_PATH, to: BUILD_PATH, ignore: [ `${SRC_ASSET_PATH  }/app/*.xml`,  `${SRC_ASSET_PATH  }/app/*.json`,  `${SRC_ASSET_PATH  }/app/*.webapp`] },
      { from: `${SRC_ASSET_PATH  }/app/browserconfig.xml`, to: `${BUILD_PATH  }/browserconfig.xml` },
      { from: `${SRC_ASSET_PATH  }/app/manifest.json`, to: `${BUILD_PATH  }/manifest.json` },
      { from: `${SRC_ASSET_PATH  }/app/manifest.webapp`, to: `${BUILD_PATH  }/manifest.webapp` },
    ]),
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
