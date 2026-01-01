import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import { __dirname, alias, getHtml, rules } from "./common.js";

const port = process.env.PORT || 8081;
const host = process.env.HOST || "0.0.0.0";

const configPromise = async (_env, _options, name = process.env.NAME || "labo") => {
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
      extensions: [".ts", ".tsx", ".js", ".jsx"],
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

export default configPromise;
