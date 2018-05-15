import React from 'react'
import Translate from 'react-translate-component'
import { Link, withRouter } from 'react-router-dom'
import translate from 'counterpart'

import Navi from '../components/general/navigation'
import ErrorBoundary from '../components/general/errorBoundary'
import Accessibility from '../stores/view/accessibility'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.NavButton = React.createRef()
    this.NavContainer = null
    this.setContainerRef = element => {
      this.NavContainer = element
    }
  }

  toggleNavi = () => {
    if (this.NavButton.current.classList.contains('open')) {
      this.NavButton.current.classList.remove('open')
    } else {
      this.NavButton.current.classList.add('open')
    }
    console.log(this.NavContainer)
    if (this.NavContainer.classList.contains('open')) {
      this.NavContainer.classList.remove('open')
    } else {
      this.NavContainer.classList.add('open')
    }
  }

  render() {
    return (
      <div className="header">
        <ErrorBoundary>
          <div className="container">
            <div className="row header-row">
              <Link
                to="/"
                onClick={() => {
                  Accessibility.setNavText(translate('changepage', { page: translate('nav.home') }))
                }}
              >
                <img alt="Etsin -logo" className="logo" src="../../static/images/etsin_logo.png" />
              </Link>
              <p className="slogan">
                <Translate content="slogan" />
              </p>
              <button
                id="nav-icon"
                className="btn btn-transparent"
                name="Navigation"
                aria-label="Navigation"
                ref={this.NavButton}
                onClick={this.toggleNavi}
              >
                <span />
                <span />
                <span />
              </button>
            </div>
            <Navi closeNavi={this.toggleNavi} navRef={this.setContainerRef} />
          </div>
        </ErrorBoundary>
      </div>
    )
  }
}

export default withRouter(Header)
