import 'vite/modulepreload-polyfill'
import 'core-js/stable'

import './utils/extendYup'
import './utils/extendPromise'

import { createRoot } from 'react-dom/client'

import App from './app'

import './index.css'
import '../fairdata-ui/fairdata.css'

if (process.env.BUILD === 'development') {
  // REACT-AXE: Disabled for now, since it outputs a lot of error messages to the console
  // const axe = require('@axe-core/react')
  // window.setTimeout(() => axe(React, ReactDOM, 1500, {}), 1000)
}
const root = createRoot(document.getElementById('root'))
root.render(<App />)