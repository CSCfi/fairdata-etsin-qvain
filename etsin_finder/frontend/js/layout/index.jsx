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

import React, { Component } from 'react'

import ErrorBoundary from '../components/general/errorBoundary'
import KeepAlive from '../components/general/keepAlive'
import AnnounceAndReset from '../components/general/announceAndReset'
import SkipToContent from '../components/general/skipToContent'
import Header from './header'
import Footer from './footer'
import Content from './content'

export default class Layout extends Component {
  constructor(props) {
    super(props)
    this.focusContent = this.focusContent.bind(this)
    this.content = React.createRef();
  }

  focusContent() {
    this.content.current.focus()
  }

  render() {
    return (
      <ErrorBoundary>
        <KeepAlive />
        <AnnounceAndReset />
        <SkipToContent callback={this.focusContent} />
        <Header />
        <Content contentRef={this.content} />
        <Footer />
      </ErrorBoundary>
    )
  }
}
