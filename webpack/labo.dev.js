const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { alias, rules, getHtml } = require("./common");

const port = process.env.PORT || 8081;
const host = process.env.HOST || "0.0.0.0";

const configPromise = async (
  env,
  options,
  name = process.env.NAME || "labo",
) => {
  const html = await getHtml(name);
  return {
    mode: "development",
    entry: {
      polyfill: "@babel/polyfill",
      [name]: path.resolve(__dirname, `../labo/${name}/standalone.js`),
    },
    output: {
      filename: "[name].js",
      publicPath: "/",
    },
    target: "web",
    devtool: "inline-source-map",
    module: {
      rules,
    },
    resolve: {
      extensions: [".js"],
      alias,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("development"),
          ASSET_PATH: JSON.stringify("/public"),
          NAME: JSON.stringify(name),
        },
      }),
      new HtmlWebpackPlugin({
        title: name,
        filename: "index.html",
        inject: "body",
        base: "/public",
        html,
        template: path.resolve(__dirname, "./templates/labo.ejs"),
      }),
    ],
    devServer: {
      server: "https",
      host,
      historyApiFallback: true,
      port,
      static: {
        directory: path.join(__dirname, "../public"),
        publicPath: "/public/",
        watch: false,
      },
    },
  };
};

module.exports = configPromise;
