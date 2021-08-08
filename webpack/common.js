const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');

const utils = require('../scripts/utils');

const alias = {
  Assets: path.resolve(__dirname, '../public/'),
  Labo: path.resolve(__dirname, '../labo/'),
};

const optimization = {
  splitChunks: {
    chunks: 'async',
    minSize: 30000,
    maxSize: 240000,
    minChunks: 1,
    maxAsyncRequests: 6,
    maxInitialRequests: 4,
    automaticNameDelimiter: '~',
    cacheGroups: {
      defaultVendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
      },
    },
  },
  minimize: true,
  minimizer: [
    new TerserPlugin({
      extractComments: false,
      parallel: true,
      terserOptions: {
        ecma: 6,
        warnings: false,
        sourceMap: false,
        compress: {
          drop_console: true,
        },
      },
    }),
  ],
};

const rules = [
  {
    test: /\.(js|jsx)$/i,
    exclude: /node_modules/,
    loader: 'babel-loader',
  },
  {
    test: /\.svg$/i,
    use: [
      {
        loader: '@svgr/webpack',
        options: {
          svgo: false,
        },
      },
      {
        loader: 'url-loader',
      },
    ],
  },
  {
    test: /\.css$/i,
    use: ['style-loader', 'css-loader'],
  },
  {
    test: /\.html$/i,
    loader: 'html-loader',
  },
  {
    test: /\.(jpe?g|png|gif)$/i,
    loader: 'url-loader',
    options: {
      name: '/img/[name].[ext]?[hash]',
      limit: 100000,
    },
  },
];

const minify = {
  collapseWhitespace: true,
  preserveLineBreaks: false,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  minifyCSS: true,
};

const getHtml = async (name) => {
  const htmlPath = path.resolve(__dirname, `../labo/${name}/inject.html`);
  let html = '';
  try {
    html = (await utils.readFile(htmlPath, 'utf8')) || '';
  } catch (e) {
    console.log('no html find to be inject in template');
  }
  return html;
};

const compression = [
  new CompressionPlugin({
    test: /\.(js|css|svg|jpg|png|html)$/,
    algorithm: 'gzip',
    deleteOriginalAssets: false,
    filename: '[path][base].gz[query]',
    threshold: 0,
    minRatio: 1,
  }),
  new CompressionPlugin({
    test: /\.(js|css|svg|jpg|png|html)$/,
    algorithm: 'brotliCompress',
    deleteOriginalAssets: false,
    filename: '[path][base].br[query]',
    threshold: 0,
    minRatio: 1,
    compressionOptions: {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
      },
    },
  }),
];

module.exports = { alias, optimization, rules, minify, getHtml, compression };
