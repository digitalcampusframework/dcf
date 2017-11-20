// webpack.config.js
const path = require('path');
const webpack = require('webpack');

// var styleLintPlugin = require('stylelint-webpack-plugin');
var extractTextPlugin = require('extract-text-webpack-plugin');

var baseConfig = {
  context: path.resolve(__dirname, './theme/example'),
  entry: {
    main: './js/index.js'
  },
  output: {
    path: path.resolve(__dirname, './theme/example/js'),
    filename: 'debug.js'
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  module: {
    rules: [
//       {
//         test: /\.scss$/,
//         use: extractTextPlugin.extract({
//           fallback: 'style-loader',
//           use: ['css-loader','postcss-loader','sass-loader']
//         })
//       },

      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 2 }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },

    ]
  },
  plugins: [
//     new styleLintPlugin({
//       options: {
//         syntax: 'scss'
//       }
//     }),
    new extractTextPlugin({
      filename: '../css/core.css',
      disable: false,
      allChunks: true
    })
  ]
};

module.exports = baseConfig;
