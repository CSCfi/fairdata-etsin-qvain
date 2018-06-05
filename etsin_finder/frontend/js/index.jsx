import React from 'react'
import ReactDOM from 'react-dom'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'

import App from './app'

OfflinePluginRuntime.install()

global.Promise = require('bluebird')
Promise.config({
  warnings: {
    wForgottenReturn: false,
  },
})

ReactDOM.render(<App />, document.getElementById('root'))
