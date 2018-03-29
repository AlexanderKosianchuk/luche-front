'use strict';

const NODE_ENV = process.env.NODE_ENV || 'prod';

const webpack = require('webpack');
const path = require('path');
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    './index'
  ],
  devServer: {
    hot: true,
    historyApiFallback: true
  },
  context: resolve(__dirname, 'src'),
  output: {
    filename: 'bundle-[hash:6].js',
    path: resolve(__dirname, 'dist'),
    publicPath: '',
  },
  resolve: {
    modules: [
      resolve('./src'),
      resolve('./node_modules')
    ],
    extensions: ['.js', '.jsx'],
    alias: {
      'facade': path.join(__dirname, 'src/facade-to-prototypes.js'),
      'AxesWorker': path.join(__dirname, 'src/proto/chart/AxesWorker.proto.js'),
      'Chart': path.join(__dirname, 'src/proto/chart/Chart.proto.js'),
      'Coordinate': path.join(__dirname, 'src/proto/chart/Coordinate.proto.js'),
      'Exception': path.join(__dirname, 'src/proto/chart/Exception.proto.js'),
      'Legend': path.join(__dirname, 'src/proto/chart/Legend.proto.js'),
      'Param': path.join(__dirname, 'src/proto/chart/Param.proto.js'),
      'FlightUploader': path.join(__dirname, 'src/proto/flight/FlightUploader.proto.js'),
    },
  },
  devtool: (NODE_ENV == 'dev' ? 'source-map' : false),
  watch: NODE_ENV == 'dev',
  watchOptions: {
    aggregateTimeout: 300,
  },
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          plugins: ['react-hot-loader/babel'],
        }
      }, {
        test: /\.css$/,
        loader: 'css-loader?name=[name]-[hash:6].css'
      }, {
        test: /\.sass$/,
        exclude: /node_modules/,
        use: [
          'style-loader', {
            loader: 'css-loader',
            query: { sourceMaps: true }
          }, {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ],
      }, {
        test: /\.(jpe?g|png|svg|gif|ico)$/,
        loader:'file-loader?name=images/[name].[ext]'
      }, {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader:'file-loader?name=fonts/[name].[ext]'
      }, {
        test: /bootstrap\/dist\/js\/umd\//,
        loader: 'imports-loader?jQuery=jquery'
      },   {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: { minimize: false }
        }]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: 'body',
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify('dev'),
      REST_URL: JSON.stringify('http://local.luch15.com/'),
      INTERACTION_URL: JSON.stringify('http://localhost:1337/'),
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};
