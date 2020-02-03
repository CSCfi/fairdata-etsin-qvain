const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

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
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        // Enable file caching. Default path to cache directory: node_modules/.cache/terser-webpack-plugin.
        cache: true,
        // Use multi-process parallel running to improve the build speed.
        // Default number of concurrent runs: os.cpus().length - 1.
        parallel: true,
        terserOptions: {
          // Support Internet Explorer 8.
          ie8: true,
          // Support Safari 10 with work around for Safari 10/11 bugs in loop scoping and await
          safari10: true,
        },
      }),
    ],
  },
}
module.exports = config
