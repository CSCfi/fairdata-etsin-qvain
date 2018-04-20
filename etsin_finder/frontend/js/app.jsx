import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { ThemeProvider } from 'styled-components'

import SkipToContent from 'Components/general/skipToContent'
import Layout from './layout'
import etsinTheme from './theme'

import Stores from './stores'

if (process.env.NODE_ENV === 'test') {
  console.log('We are in test')
} else if (process.env.NODE_ENV === 'development') {
  console.log('We are in development')
} else if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!')
}

export default class App extends Component {
  constructor() {
    super()
    this.focusContent = this.focusContent.bind(this)
  }

  focusContent() {
    this.content.focus()
  }

  render() {
    return (
      <div className="app">
        <SkipToContent callback={this.focusContent} />
        <Provider Stores={Stores}>
          <Router history={Stores.history}>
            <ThemeProvider theme={etsinTheme}>
              <Layout
                contentRef={content => {
                  this.content = content
                }}
              />
            </ThemeProvider>
          </Router>
        </Provider>
      </div>
    )
  }
}

// don't show outline when user is not using tab to navigate
const handleFirstTab = e => {
  if (e.keyCode === 9) {
    document.body.classList.add('user-is-tabbing')
    Stores.Accessibility.toggleTabbing()

    window.removeEventListener('keydown', handleFirstTab)
    /* eslint-disable-next-line no-use-before-define */
    window.addEventListener('mousedown', handleMouseDownOnce)
  }
}

const handleMouseDownOnce = () => {
  document.body.classList.remove('user-is-tabbing')
  Stores.Accessibility.toggleTabbing()
  window.removeEventListener('mousedown', handleMouseDownOnce)
  window.addEventListener('keydown', handleFirstTab)
}

window.addEventListener('keydown', handleFirstTab)
