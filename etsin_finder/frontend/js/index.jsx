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

require('@babel/polyfill')

import React from 'react'
import ReactDOM from 'react-dom'

import App from './app'


global.Promise = require('bluebird')

Promise.config({
  warnings: false,
  cancellation: true
})

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require
  const axe = require('react-axe')
  axe(React, ReactDOM, 1000)
}
ReactDOM.render(<App />, document.getElementById('root'))
