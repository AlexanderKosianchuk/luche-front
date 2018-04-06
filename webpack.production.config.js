'use strict';

const NODE_ENV = 'production';

const webpack = require('webpack');
const path = require('path');
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: [
    './index'
  ],
  context: resolve(__dirname, 'src'),
  output: {
    filename: 'bundle-[hash:6].js',
    path: resolve(__dirname, 'dist'),
    publicPath: '/',
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
  devtool: 'cheap-module-source-map',
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }, {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader?name=[name]-[hash:6].css']
      }, {
        test: /\.sass$/,
        exclude: /node_modules/,
        use: [
          'style-loader', {
            loader: 'css-loader',
            query: {
              sourceMaps: false
            }
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: false
            }
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
      }, {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: { minimize: true }
        }]
      }, {
        test: /\.htaccess$/,
        loader: 'file-loader?name=.htaccess'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin('dist', {
      verbose: true,
      dry: false
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
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
      minimize: true,
      debug: false,
    }),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify('production'),
      REST_URL: JSON.stringify('http://rest.luche.com/'),
      INTERACTION_URL: JSON.stringify('http://localhost:1337/'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[hash:6].css',
      chunkFilename: '[id]-[hash:6].css'
    })
  ],

};
