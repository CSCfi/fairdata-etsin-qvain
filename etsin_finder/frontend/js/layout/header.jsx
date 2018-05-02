import React from 'react'
import Translate from 'react-translate-component'
import { Link, withRouter } from 'react-router-dom'
import translate from 'counterpart'

import Navi from '../components/general/navigation'
import ErrorBoundary from '../components/general/errorBoundary'
import Accessibility from '../stores/view/accessibility'

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <ErrorBoundary>
          <div className="container">
            <div className="row top-logo">
              <div className="container align-left row">
                <Link
                  to="/"
                  onClick={() => {
                    Accessibility.setNavText(
                      translate('changepage', { page: translate('nav.home') })
                    )
                  }}
                >
                  <img alt="Etsin -logo" src="../../static/images/etsin_logo.png" />
                </Link>
                <p className="slogan">
                  <Translate content="slogan" />
                </p>
              </div>
            </div>
            <Navi />
          </div>
        </ErrorBoundary>
      </div>
    )
  }
}

export default withRouter(Header)
