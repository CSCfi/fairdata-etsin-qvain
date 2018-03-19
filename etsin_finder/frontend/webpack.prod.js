const sharedConfig = require('./webpack.config.shared')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const config = {
  entry: [path.join(__dirname, '/js/index.jsx')],
  output: {
    path: path.join(__dirname, '/static'),
    publicPath: '/static/',
    filename: 'bundle.js',
    chunkFilename: '[name].bundle.js',
  },
  resolve: {
    alias: sharedConfig.alias,
    extensions: ['.js', '.jsx', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        loader: 'babel-loader',
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
    new ExtractTextPlugin({
      // define where to save the extracted styles files
      filename: '[name].bundle.css',
      allChunks: true,
    }),
    new UglifyJSPlugin(),
  ],
}
module.exports = config
