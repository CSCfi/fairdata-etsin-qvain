import React, { Component } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import counterpart from 'counterpart'
import closeCookiesNotification from '../../static/images/closeCookiesNotification.svg'
import closeCookiesNotificationHover from '../../static/images/closeCookiesNotificationHover.svg'

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
        <Content className="container">
          <Text>
            <Translate component="p" content="general.cookies.infoText" />
            <Translate
              component={StyledLink}
              href={this.getPrivacyUrl()}
              target="_blank"
              rel="noopener noreferrer"
              content="general.cookies.link"
            />
          </Text>
          <Translate
            component={CloseNotificationButton}
            onClick={this.fdSSODismissNotification}
            attributes={{ 'aria-label': 'general.cookies.close' }}
          />
        </Content>
      </Translate>
    )
  }
}

const Notification = styled.section`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: ${props => (props.visible ? 'flex' : 'none')};
  justify-content: center;
  z-index: 1;
  background-color: #f3f2f1;
`

const Content = styled.div.attrs(() => ({ className: 'container' }))`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 3rem;
`

const Text = styled.div`
  max-width: 40em;
  flex-grow: 1;
  p {
    margin: 0;
  }
  color: #000;
`

const StyledLink = styled.a`
  // Set color with contrast ratio 4.61
  color: #0075a3;
  text-decoration: underline;
`

const CloseNotificationButtonBase = styled.img.attrs(() => ({
  src: closeCookiesNotification,
}))``

const CloseNotificationButtonHover = styled.img.attrs(() => ({
  src: closeCookiesNotificationHover,
}))`
  opacity: 0;
  transition: opacity 0.15s linear;
  position: absolute;
  left: 0;
  top: 0;
`

const CloseNotificationButton = props => (
  <StyledCloseNotificationButton type="button" {...props}>
    <CloseNotificationButtonBase alt="" />
    <CloseNotificationButtonHover alt="" />
  </StyledCloseNotificationButton>
)

const StyledCloseNotificationButton = styled.button`
  flex-grow: 0;
  padding: 0;
  cursor: pointer;
  position: relative;
  border: none;
  background: none;
  line-height: 0;

  :hover ${CloseNotificationButtonHover} {
    opacity: 1;
  }
`

export default CookiesNotification
