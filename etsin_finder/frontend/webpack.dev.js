const dotenv = require('dotenv').config()
const path = require('path')
const { DefinePlugin } = require('webpack')
const DotenvPlugin = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const { insertBeforeStyled } = require('./helpers')

const config = env => ({
  entry: './js/index.jsx',
  output: {
    // path of output
    path: path.join(__dirname, '/build'),
    publicPath: '/', // Needed in order to access frontend from nginx
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  devtool: 'eval-source-map',
  devServer: {
    host: '0.0.0.0', // Default IP (Docker)
    // inline: true,
    publicPath: '/', // This needs to be set for devServer
    contentBase: '/static/',
    public: '0.0.0.0', // Needs to be specified without port, for connection from sockjs-node (nginx)
    disableHostCheck: true, // Should be enabled when running inside a container
    hot: true,
    historyApiFallback: true,
    clientLogLevel: 'silent',
    port: 8080, // This is the port where webpack is available
    writeToDisk: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1500,
      ignored: /node_modules/,
    },
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
          options: {
            cacheDirectory: true,
          },
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
    new ReactRefreshWebpackPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // TODO: add manifest to new html
      chunksSortMode: 'none',
      filename: 'index.html',
      template: 'static/index.template.ejs',
      favicon: 'static/images/favicon.png',
      /* scriptLoading: 'defer', */
      MATOMO_URL: dotenv.parsed ? dotenv.parsed.MATOMO_URL : undefined,
      MATOMO_SITE_ID: dotenv.parsed ? dotenv.parsed.MATOMO_SITE_ID : undefined,
    }),
    new DotenvPlugin(),
    new DefinePlugin({
      BUILD: JSON.stringify(env.BUILD || process.env.NODE_ENV || 'production'),
    }),
  ],
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1500,
    ignored: /node_modules/,
  },
})
module.exports = config
