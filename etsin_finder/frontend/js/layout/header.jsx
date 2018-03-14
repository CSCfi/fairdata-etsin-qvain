import React from 'react'
import Translate from 'react-translate-component'
import Announcer from 'react-a11y-announcer'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import translate from 'counterpart'

import Navi from '../components/general/navigation'
import ErrorBoundary from '../components/general/errorBoundary'
import Accessibility from '../stores/view/accessibility'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      announcer: '',
    }
  }

  componentWillReceiveProps() {
    this.setState({
      announcer: Accessibility.navText,
    })
  }

  render() {
    return (
      <div className="header">
        <Announcer text={this.state.announcer} />
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

export default inject('Stores')(observer(Header))
