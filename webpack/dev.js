const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const config = require('../package.json');

const port = process.env.PORT || 8080;
const host = process.env.HOST || '0.0.0.0';

module.exports = {
  mode: 'development',
  entry: [
    'webpack/hot/only-dev-server',
    `webpack-dev-server/client?http://${host}:${port}`,
    './src/index',
  ],
  output: {
    filename: `${config.name}.js`,
    publicPath: '/',
  },
  devtool: 'inline-source-map',
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
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'url-loader?name=/img/[name].[ext]?[hash]?limit=100000',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      Assets: path.resolve(__dirname, '../public/'),
    },
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('developement'),
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
      template: path.resolve(__dirname, '../src/templates/index.ejs'),
    }),
  ],
  devServer: {
    host,
    historyApiFallback: true,
    hot: true,
    inline: true,
    port,
    publicPath: '/',
  },
};
