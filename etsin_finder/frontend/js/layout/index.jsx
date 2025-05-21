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

import { createRef, Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import ErrorBoundary from '../components/general/errorBoundary'
import KeepAlive from '../components/general/keepAlive'
import AnnounceAndReset from '../components/general/announceAndReset'
import SkipToContent from '../components/general/skipToContent'
import Header from '../components/header'
import Footer from './footer'
import Content from './content'
import QvainHeader from '../components/qvain/general/header'
import { withStores } from '../stores/stores'
import LoginErrorModal from './LoginErrorModal'

class Layout extends Component {
  constructor(props) {
    super(props)
    this.focusContent = this.focusContent.bind(this)
    this.content = createRef()
  }

  focusContent() {
    this.content.current.focus()
  }

  render() {
    const { isQvain } = this.props.Stores.Env

    return (
      <ErrorBoundary>
        <KeepAlive loginThroughService={isQvain ? 'qvain' : 'etsin'} />
        <AnnounceAndReset />
        <header>
          <SkipToContent callback={this.focusContent} />
          {isQvain ? <QvainHeader /> : <Header />}
        </header>
        <Content contentRef={this.content} />
        <Footer />
        <LoginErrorModal />
      </ErrorBoundary>
    )
  }
}

Layout.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default withStores(observer(Layout))
