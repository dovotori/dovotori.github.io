const webpack = require('webpack');
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const utils = require('../scripts/utils');
const config = require('../package.json');
const { alias, optimization } = require('./common');

const name = process.env.NAME || "labo";

// const BUILD_PATH = path.resolve(__dirname, `../assets/js/${name}`);
const BUILD_PATH = path.resolve(__dirname, '../build');
// const SRC_ASSET_PATH = path.resolve(__dirname, '../assets');
const BUILD_ASSET_PATH = process.env.ASSET_PATH || '.';

const configPromise = async () => {
  const htmlPath = path.resolve(__dirname, `../assets/html/${name}.html`);
  let html = '';
  try {
  html = await utils.readFile(htmlPath, 'utf8') || '';
  } catch(e) {
    console.log('no html find to be inject in template');
  }
  return {
    mode: 'production',
    entry: path.resolve(__dirname, `../labo/index.js`),
    output: {
      path: BUILD_PATH,
      publicPath: `${BUILD_ASSET_PATH}/`,
      filename: `${name}.js`
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
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
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(jpe?g|png|gif)$/i,
          loader: 'url-loader?name=/img/[name].[ext]?[hash]?limit=100000',
        },
      ],
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
        html,
        template: path.resolve(__dirname, './templates/labo.ejs'),
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
          NAME: JSON.stringify(name),
          MAIL: JSON.stringify(config.author.email),
        },
      }),
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
      })
    ]
  };
};

module.exports = configPromise;
