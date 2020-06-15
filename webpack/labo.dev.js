const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('../package.json');
const utils = require('../scripts/utils');
const { alias } = require('./common');

const port = process.env.PORT || 8081;
const host = process.env.HOST || '0.0.0.0';
const name = process.env.NAME || "labo";

const configPromise = async () => {
  const htmlPath = path.resolve(__dirname, `../assets/html/${name}.html`);
  let html = '';
  try {
  html = await utils.readFile(htmlPath, 'utf8') || '';
  } catch(e) {
    console.log('no html find to be inject in template');
  }
  return {
    mode: 'development',
    entry: [
      'webpack/hot/only-dev-server',
      `webpack-dev-server/client?http://${host}:${port}`,
      `./labo/index.js`,
    ],
    output: {
      filename: `${name}.js`,
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
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('developement'),
          ASSET_PATH: JSON.stringify('/assets'),
          NAME: JSON.stringify(name),
          MAIL: JSON.stringify(config.author.email),
        },
      }),
      new HtmlWebpackPlugin({
        title: name,
        filename: 'index.html',
        inject: 'body',
        base: '/assets',
        html,
        template: path.resolve(__dirname, './templates/labo.ejs'),
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
};

module.exports = configPromise;
