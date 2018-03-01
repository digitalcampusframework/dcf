// webpack.config.js
const path = require('path');
const webpack = require('webpack');

var styleLintPlugin = require('stylelint-webpack-plugin');
var extractTextPlugin = require('extract-text-webpack-plugin');

var core_js_config = {
  entry: {
    body: './core/js/loaders/core_body_js_loader.js',
    head: './core/js/loaders/core_head_js_loader.js'
  },
  output: {
    path: path.resolve(__dirname, './core/js'),
    filename: 'core-[name].js'
  },
  watch: true,
  watchOptions: {
    aggregateTimeout : 300,
    poll             : 1000
  }
}

// config for compiling head and body JS
var theme_js_config = function(env) {
  var theme = 'example';
  if (env && env.theme) {
    theme = env.theme;
  }

  return {
    entry: {
      body: './theme/' + theme + '/js/loaders/theme_body_js_loader.js',
      head: './theme/' + theme + '/js/loaders/theme_head_js_loader.js'
    },
    output: {
      path: path.resolve(__dirname, './theme/' + theme + '/js'),
      filename: theme + '-[name].js'
    },
    watch        : true,
    watchOptions : {
      aggregateTimeout : 300,
      poll             : 1000
    },
    module       : {
      rules : [
        {
          test : /\.scss$/,
          use  : extractTextPlugin.extract({
            fallback : 'style-loader',
            use      : ['css-loader', 'postcss-loader', {
              'loader': 'sass-loader',
              options: {
                includePaths: [__dirname+'/node_modules/modularscale-sass/stylesheets']
              }
            }]
          })
        },
        /*
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
        */
      ]
    },
    plugins      : [
      new styleLintPlugin({
        options: {
          syntax: 'scss'
        }
      }),
      new extractTextPlugin({
        filename  : '../css/all.css',
        disable   : false,
        allChunks : true
      })
    ]
  }
};

module.exports = [core_js_config, theme_js_config];
