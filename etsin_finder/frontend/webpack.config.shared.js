const path = require('path')

module.exports = {
  alias: {
    Utils: path.resolve(__dirname, 'js/utils/'),
    Components: path.resolve(__dirname, 'js/components/'),
    Routes: path.resolve(__dirname, 'js/routes/'),
    Stores: path.resolve(__dirname, 'js/stores/'),
  },
}
