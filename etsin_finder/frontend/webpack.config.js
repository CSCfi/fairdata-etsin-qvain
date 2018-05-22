const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  entry: [path.join(__dirname, '/js/index.jsx')],
  output: {
    // path of output
    path: path.join(__dirname, '/build'),
    // publicPath is used in dynamic chunk loading
    publicPath: '/build/',
    filename: 'bundle.js',
    chunkFilename: '[name].[chunkhash].js',
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
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg|jpg|png)$/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Etsin | Tutkimusaineistojen hakupalvelu',
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
