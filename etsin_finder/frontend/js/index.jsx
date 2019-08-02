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

import axe from 'react-axe'
import App from './app'

// setup react-axe
if (process.env.NODE_ENV !== 'production') {
  axe(React, ReactDOM, 1000)
}

global.Promise = require('bluebird')

Promise.config({
  warnings: {
    wForgottenReturn: false,
  },
})

ReactDOM.render(<App />, document.getElementById('root'))
