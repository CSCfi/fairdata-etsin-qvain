{
/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */
}

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
