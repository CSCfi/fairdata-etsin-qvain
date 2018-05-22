const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// const criticalCSS = new ExtractTextPlugin('critical.css')

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
    extensions: ['.js', '.jsx', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      // {
      //   // this doesn't work correctly
      //   include: [path.resolve(__dirname, 'critical.css')],
      //   use: criticalCSS.extract({
      //     use: ExtractTextPlugin.extract(['css-loader', 'sass-loader']),
      //   }),
      // },
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
    // criticalCSS,
    new ExtractTextPlugin({
      // define where to save the extracted styles file
      filename: '[name].bundle.css',
      allChunks: true,
    }),
  ],
  watch: false,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/,
  },
}
module.exports = config
