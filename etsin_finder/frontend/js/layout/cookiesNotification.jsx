import React, { Component } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import counterpart from 'counterpart'

import Button from '../components/general/button'


class CookiesNotification extends Component {
  state = {
    displayCookieNotification: true
  }

  componentDidMount() {
    counterpart.onLocaleChange(this.onLanguageChange)
    if (Boolean(this.fdSSOGetCookie('fd_sso_notification_shown'))) {
      this.setState({
          displayCookieNotification: false
        }
      )
    }
  }

  componentWillUnmount() {
    counterpart.offLocaleChange(this.onLanguageChange)
  }

  fdSSOGetDomainName() {
    let hostname = window.location.hostname;
    let domain = hostname.substring(hostname.indexOf(".") + 1); // Check indexOf ".f" in local_dev
    return domain
}

 fdSSOGetPrefixedCookieName(name) {
    let domain = this.fdSSOGetDomainName();
    domain = domain.replace(/[^a-zA-Z0-9]/g, "_")
    return domain + "_" + name
}

 fdSSOGetCookie(name) {
    name = this.fdSSOGetPrefixedCookieName(name)
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

 fdSSOSetCookie(name, value) {
    name = this.fdSSOGetPrefixedCookieName(name);
    let expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (7*24*60*60*1000));
    let expires = "; expires=" + expiryDate.toUTCString();
    document.cookie = name + "=" + (value || "")  + expires + "; path=/" + "; domain=." + this.fdSSOGetDomainName();
}

 fdSSODismissNotification() {
   this.fdSSOSetCookie("fd_sso_notification_shown", true)
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

  render() {
    return (
      <Notification visible={this.state.displayCookieNotification}>
        <div className="container row no-gutters">
          <div className="col-12 col-md-9">
            <Translate component="p" content="general.cookies.infoText" />
            <a href={this.getPrivacyUrl()} target="_blank" rel="noopener noreferrer"><Translate content="general.cookies.link" /></a>
          </div>
          <Actions className="col-12 col-md-3">
            <Button onClick={this.fdSSODismissNotification()}>
              <Translate content="general.cookies.accept" />
            </Button>
          </Actions>
        </div>
      </Notification>
    )
  }
}

const Notification = styled.div`
  display: ${props => (props.visible ? 'flex' : 'none')};
  position: fixed;
  justify-content: center;
  align-items: center;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #F3F2F1;
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
    padding: .5rem;
    flex-direction: column;
    align-items: initial;
  }
`

export default CookiesNotification
