const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

const config = {
    devtool: 'source-map',
    entry:  [__dirname + '/js/index.jsx', __dirname + '/scss/main.scss'],
    output: {
        path: __dirname + '/static',
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    module: {
      rules: [
        {
          test: /\.jsx?/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            plugins: [
              ["transform-decorators-legacy"],
              ["transform-class-properties"]
            ]
          }
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
          use: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
          use: "file-loader"
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin({ // define where to save the file
        filename: '[name].bundle.css',
        allChunks: true,
      }),
      new UglifyJSPlugin({
        sourceMap: true
      })
    ]
};
module.exports = config;