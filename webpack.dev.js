'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    hot: true
  },
  entry: './src/index.js',
  plugins: [
    new HtmlWebpackPlugin({
      template: './template/index.html'
    }),
  ],
})