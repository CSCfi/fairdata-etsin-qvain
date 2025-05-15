const path = require('path')
const { DefinePlugin, ProvidePlugin } = require('webpack')
const DeadCodePlugin = require('webpack-deadcode-plugin')
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
    allowedHosts: 'all', // Allow any host when running inside a container
    hot: true,
    historyApiFallback: true,
    port: 8080, // This is the port where webpack is available
    static: {
      directory: '/static/',
      watch: {
        aggregateTimeout: 300,
        poll: 1500,
        ignored: /node_modules/,
      },
    },
    devMiddleware: {
      publicPath: '/', // This needs to be set for devServer
      writeToDisk: false,
    },
    webSocketServer: 'ws',
    client: {
      logging: 'none',
      webSocketURL: 'wss://0.0.0.0:443/ws',
    },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': '/js',
    },
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
  optimization: {
    usedExports: true,
  },
  plugins: [
    new DeadCodePlugin({
      patterns: ['js/**/*.(js|jsx|css)'],
      detectUnusedExport: false, // disable as too noisy
    }),
    new ReactRefreshWebpackPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // TODO: add manifest to new html
      chunksSortMode: 'none',
      filename: 'index.html',
      template: 'static/index.template.ejs',
      favicon: 'static/images/favicon.png',
      /* scriptLoading: 'defer', */
    }),
    new DefinePlugin({
      BUILD: JSON.stringify(env.BUILD || process.env.NODE_ENV || 'production'),
    }),
    new ProvidePlugin({
      process: 'process/browser.js',
    }),
  ],
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1500,
    ignored: /node_modules/,
  },
})
module.exports = config
