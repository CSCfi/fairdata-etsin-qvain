// import shared config files
const sharedConfig = require('./webpack.config.shared')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = {
  entry: [path.join(__dirname, '/js/index.jsx')],
  output: {
    // path of output
    path: path.join(__dirname, '/static'),
    // publicPath is used in dynamic chunk loading
    publicPath: '/static/',
    filename: 'bundle.js',
    chunkFilename: '[name].bundle.js',
  },
  resolve: {
    // adds aliases for common locations in app
    // (../../../utils/checkDataLang => Utils/checkDataLang)
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
        test: /\.(woff|woff2|eot|ttf|otf|svg|jpg|png)$/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    // minimal plugins = fast development builds
    new ExtractTextPlugin({
      // define where to save the extracted styles file
      filename: '[name].bundle.css',
      allChunks: true,
    }),
  ],
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/,
  },
}
module.exports = config
