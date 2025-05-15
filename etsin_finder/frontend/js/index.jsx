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

import 'core-js/stable'

import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './app'

import './index.css'
import '../fairdata-ui/fairdata.css'

if (BUILD === 'development') {
  // REACT-AXE: Disabled for now, since it outputs a lot of error messages to the console
  // eslint-disable-next-line global-require
  // const axe = require('@axe-core/react')
  // window.setTimeout(() => axe(React, ReactDOM, 1500, {}), 1000)
}
const root = createRoot(document.getElementById('root'))
root.render(<App />)
