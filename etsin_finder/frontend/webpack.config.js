require('@babel/polyfill')
const env = require('dotenv').config()
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const config = {
  entry: [path.join(__dirname, '/js/index.jsx')],
  output: {
    // path of output
    path: path.join(__dirname, '/build'),
    // publicPath is used in dynamic chunk loading
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
        use: {
          loader: 'file-loader',
        },
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
      MATOMO_URL: env.parsed ? env.parsed.MATOMO_URL : undefined,
      MATOMO_SITE_ID: env.parsed ? env.parsed.MATOMO_SITE_ID : undefined,
    }),
  ],
  devServer: {
    hot: true,

  },
  watch: false,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/,
  },
}
module.exports = config
