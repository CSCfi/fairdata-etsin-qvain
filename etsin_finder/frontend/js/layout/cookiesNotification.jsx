import React, { Component } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import counterpart from 'counterpart'

import Button from '../components/general/button'

class CookiesNotification extends Component {
  state = {
    displayCookieNotification: true,
  }

  componentDidMount() {
    counterpart.onLocaleChange(this.onLanguageChange)
    if (this.fdSSOGetCookie('fd_sso_notification_shown')) {
      this.setState({
        displayCookieNotification: false,
      })
    }
  }

  componentWillUnmount() {
    counterpart.offLocaleChange(this.onLanguageChange)
  }

  onLanguageChange = () => {
    this.setState({
      lang: counterpart.getLocale(),
    })
  }

  getPrivacyUrl() {
    return this.state.lang === 'en'
      ? 'https://www.fairdata.fi/en/contracts-and-privacy/'
      : 'https://www.fairdata.fi/sopimukset/'
  }

  fdSSODismissNotification = () => {
    this.fdSSOSetCookie('fd_sso_notification_shown', true)
  }

  fdSSOGetDomainName() {
    const hostname = window.location.hostname
    const domain = hostname.substring(hostname.indexOf('.') + 1) // Check indexOf ".f" in local_dev
    return domain
  }

  fdSSOGetPrefixedCookieName(name) {
    let domain = this.fdSSOGetDomainName()
    domain = domain.replace(/[^a-zA-Z0-9]/g, '_')
    return `${domain} ${name}`
  }

  fdSSOGetCookie(name) {
    const cookieName = this.fdSSOGetPrefixedCookieName(name)
    const nameEQ = `${cookieName}=`
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i += 1) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  fdSSOSetCookie(name, value) {
    const cookieName = this.fdSSOGetPrefixedCookieName(name)
    const expiryDate = new Date()
    expiryDate.setTime(expiryDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    const expires = `; expires=${expiryDate.toUTCString()}`
    document.cookie = `${cookieName}=${
      value || ''
    }${expires}; path=/; domain=.${this.fdSSOGetDomainName()}; secure`
    this.setState({
      displayCookieNotification: false,
    })
  }

  render() {
    return (
      <Translate
        component={Notification}
        visible={this.state.displayCookieNotification}
        attributes={{ 'aria-label': 'general.cookies.section' }}
      >
        <div className="container row no-gutters">
          <div className="col-12 col-md-9">
            <Translate component="p" content="general.cookies.infoText" />
            <Translate
              component={StyledLink}
              href={this.getPrivacyUrl()}
              target="_blank"
              rel="noopener noreferrer"
              content="general.cookies.link"
            />
          </div>
          <Actions className="col-12 col-md-3">
            <Button onClick={this.fdSSODismissNotification}>
              <Translate content="general.cookies.accept" />
            </Button>
          </Actions>
        </div>
      </Translate>
    )
  }
}

const Notification = styled.section`
  display: ${props => (props.visible ? 'flex' : 'none')};
  position: fixed;
  justify-content: center;
  align-items: center;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #f3f2f1;
  padding: 2rem 3rem;
  z-index: 1;

  p {
    margin: 0;
  }
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;

  @media only screen and (max-width: 992px) {
    padding-top: 1.5rem;
  }

  @media only screen and (max-width: 576px) {
    padding: 0.5rem;
    flex-direction: column;
    align-items: initial;
  }
`

const StyledLink = styled.a`
  // Set color with contrast ratio 4.61
  color: #0075a3;
`

export default CookiesNotification
