require('@babel/polyfill')
const path = require('path')
const { DefinePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { insertBeforeStyled } = require('./helpers')

const config = env => ({
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
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: [{ loader: 'style-loader', options: { insert: insertBeforeStyled } }, 'css-loader'],
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
    new DefinePlugin({
      BUILD: JSON.stringify(env.BUILD || process.env.NODE_ENV || 'production'),
    }),
  ],
  watch: false,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/,
  },
})
module.exports = config
