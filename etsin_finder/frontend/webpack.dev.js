require('@babel/polyfill')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const config = {
  entry: './js/index.jsx',
  output: {
    // path of output
    path: path.resolve(__dirname, '/build'),
    // publicPath is used in dynamic chunk loading
    publicPath: '/',
    filename: 'bundle.[hash].js',
    chunkFilename: '[name].[chunkhash].js',
  },
  devtool: 'source-map',
  devServer: {
    publicPath: '/',
    contentBase: './static',
    public: 'etsin-finder.local',
    hot: true,
    historyApiFallback: true,
    clientLogLevel: 'silent',
    port: 8080,
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
    }),
  ],
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1500,
    ignored: /node_modules/,
  },
}
module.exports = config
