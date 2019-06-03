const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const config = {
  entry: [path.join(__dirname, '/js/index.jsx')],
  output: {
    path: path.join(__dirname, '/build'),
    publicPath: '/build/',
    filename: 'bundle.[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg|jpg|png)$/,
        use: 'file-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // TODO: add manifest to new html
      chunksSortMode: 'none',
      filename: 'index.html',
      template: 'static/index.template.ejs',
      favicon: 'static/images/favicon.png',
    }),
    new UglifyJSPlugin(),
  ],
}
module.exports = config
