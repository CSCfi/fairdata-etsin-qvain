// import shared config files
const sharedConfig = require('../webpack.config.shared')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = {
  resolve: {
    // adds aliases for common locations in app
    // (../../../utils/checkDataLang => Utils/checkDataLang)
    alias: sharedConfig.alias,
    extensions: ['.js', '.jsx', '.css'],
  },
}

module.exports = config
