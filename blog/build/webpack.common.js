//webpack.common.js
const path = require('path')
const chalk = require("chalk");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
module.exports = {
  entry: {
	main:path.resolve(__dirname,"../src/main.js"),
    article:path.resolve(__dirname, "../src/article.js")
  },
  output: {
    path:path.resolve(__dirname,'../dist'),
    filename: '[name].bundle.js',
	chunkFilename: '[name].js',
    clean:true 
  },
  plugins: [
    new ProgressBarPlugin({
      format: `  :msg [:bar] ${chalk.green.bold(":percent")} (:elapsed s)`,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
 optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
        },
      }
    }
  },
}
