'use strict';

const NODE_ENV = process.env.NODE_ENV || 'prod';
const webpack = require('webpack');
const path = require('path');
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

const DEV_PORT = 9000;

module.exports = {
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:'+DEV_PORT,
    'webpack/hot/only-dev-server',
    './front/index'
  ],
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    publicPath: path.join(__dirname, 'public'),
    historyApiFallback: true,
    compress: true,
    hot: true,
    inline: true,
    port: DEV_PORT
  },
  output: {
    path: path.join(__dirname, '/public'),
    publicPath: (NODE_ENV == 'dev' ? '/' : '/public'),
    filename: '[name][hash:6].js',
  },
  resolve: {
    modules: [
      path.resolve('./front'),
      path.resolve('./node_modules')
    ],
    extensions: ['.js', '.jsx'],
    alias: {
      'facade': path.join(__dirname, 'front/facade-to-prototypes.js'),
      'AxesWorker': path.join(__dirname, 'front/proto/chart/AxesWorker.proto.js'),
      'Chart': path.join(__dirname, 'front/proto/chart/Chart.proto.js'),
      'Coordinate': path.join(__dirname, 'front/proto/chart/Coordinate.proto.js'),
      'Exception': path.join(__dirname, 'front/proto/chart/Exception.proto.js'),
      'Legend': path.join(__dirname, 'front/proto/chart/Legend.proto.js'),
      'Param': path.join(__dirname, 'front/proto/chart/Param.proto.js'),
      'FlightUploader': path.join(__dirname, 'front/proto/flight/FlightUploader.proto.js'),
    },
  },
  watch: NODE_ENV == 'dev',
  watchOptions: {
    aggregateTimeout: 300,
  },
  devtool: (NODE_ENV == 'dev' ? 'source-map' : false),
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: 'babel-loader',
        exclude: /node_modules/,
      }, {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
      }, {
        test: /\.sass$/,
        exclude: /node_modules/,
        use: [
          'style-loader', {
            loader: 'css-loader',
            query: {
              sourceMaps: NODE_ENV == 'dev'
            }
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: NODE_ENV == 'dev'
            }
          }
        ]
      }, {
        test: /\.(jpe?g|png|svg|gif)$/i,
        loader:'file-loader?name=images/[name].[ext]'
      }, {
        test: /\.(ttf|eot|woff|woff2)$/i,
        loader:'file-loader?name=fonts/[name].[ext]'
      }, {
        test: /bootstrap\/dist\/js\/umd\//,
        loader: 'imports-loader?jQuery=jquery'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      ENTRY_URL: JSON.stringify('/'),
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new WebpackCleanupPlugin(),
    new HtmlWebpackPlugin({
      template: 'front/index.html'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],

};
