const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')

const config = {
  entry: [
    path.join(__dirname, '/js/index.jsx'),
    path.join(__dirname, '/scss/main.scss'),
  ],
  output: {
    path: path.join(__dirname, '/static'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
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
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new ExtractTextPlugin({
      // define where to save the file
      filename: '[name].bundle.css',
      allChunks: true,
    }),
    new UglifyJSPlugin({
      sourceMap: true,
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
    }),
  ],
}
module.exports = config
