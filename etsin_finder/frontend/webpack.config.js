const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

const config = {
  entry: [
    'react-hot-loader/patch',
    path.join(__dirname, '/js/index.jsx'),
    path.join(__dirname, '/scss/main.scss'),
  ],
  output: {
    path: path.join(__dirname, '/static'),
    publicPath: (process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:9988/'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },
  devServer: {
    contentBase: './',
    hot: true,
    port: 9988,
  },
  module: {
    rules: [{
      test: /\.jsx?/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            plugins: [
              ['transform-decorators-legacy'],
              ['transform-class-properties'],
            ],
            presets: ['env'],
          },
        },
        {
          loader: 'eslint-loader',
        },
      ],
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'eslint-loader',
    },
    {
      test: /\.css$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract({
        use: 'css-loader?importLoaders=1',
      }),
    },
    {
      test: /\.(sass|scss)$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract(['css-loader', 'sass-loader']),
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
      use: 'file-loader',
    }],
  },
  plugins: [
    new ExtractTextPlugin({ // define where to save the file
      filename: '[name].bundle.css',
      allChunks: true,
    }),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/index.html'),
      title: 'Hot Module Replacement',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
module.exports = config;
