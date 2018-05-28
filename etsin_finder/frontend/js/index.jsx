import React from 'react'
import ReactDOM from 'react-dom'

import App from './app'

global.Promise = require('bluebird')

ReactDOM.render(<App />, document.getElementById('root'))

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  navigator.serviceWorker
    .register('./static/service-worker.js')
    .then(registration => {
      console.log('Registration successful, scope is:', registration.scope)
    })
    .catch(error => {
      console.log('Service worker registration failed, error:', error)
    })
}
