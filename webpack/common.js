const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const alias = {
  Assets: path.resolve(__dirname, '../assets/'),
  Labo: path.resolve(__dirname, '../labo/'),
};

const optimization = {
  splitChunks: {
    chunks: 'async',
    minSize: 30000,
    maxSize: 0,
    minChunks: 1,
    maxAsyncRequests: 6,
    maxInitialRequests: 4,
    automaticNameDelimiter: '~',
    cacheGroups: {
      defaultVendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true
      }
    }
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
        comments: false
      },
    }),
  ],
};

module.exports = { alias, optimization };
