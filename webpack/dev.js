const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const config = require('../package.json');
const { alias, rules } = require('./common');

const port = process.env.PORT || 8080;
const host = process.env.HOST || '0.0.0.0';
const withAnalyze = process.env.ANALYZE || false;

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('development'),
      ASSET_PATH: JSON.stringify('/public'),
      NAME: JSON.stringify(config.name),
      MAIL: JSON.stringify(config.author.email),
    },
  }),
  new HtmlWebpackPlugin({
    title: config.name,
    filename: 'index.html',
    inject: 'body',
    base: '/public',
    chunks: ['polyfill', 'hot', 'devserver', 'main'],
    template: path.resolve(__dirname, './templates/index.ejs'),
  }),
];

if (withAnalyze) {
  plugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
  mode: 'development',
  entry: {
    polyfill: '@babel/polyfill',
    main: './src/index',
  },
  target: 'web',
  output: {
    publicPath: '/',
    filename: '[name].js',
  },
  devtool: 'inline-source-map',
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias,
  },
  plugins,
  devServer: {
    host,
    https: true,
    historyApiFallback: true,
    hot: true,
    inline: true,
    port,
    publicPath: '/',
  },
};
