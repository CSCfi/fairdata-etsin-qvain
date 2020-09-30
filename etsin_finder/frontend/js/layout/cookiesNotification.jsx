import React, { Component } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import counterpart from 'counterpart'

import Button from '../components/general/button'


class CookiesNotification extends Component {
  state = {
    visible: !localStorage.getItem('cookiesAccepted'),
  }

  componentDidMount() {
    counterpart.onLocaleChange(this.onLanguageChange)
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

  handleAcceptCookies = () => {
    localStorage.setItem('cookiesAccepted', true)
    this.setState({ visible: false })
  }

  render() {
    return (
      <Notification visible={this.state.visible}>
        <div className="container row no-gutters">
          <div className="col-12 col-md-9">
            <Translate component="p" content="general.cookies.infoText" />
            <a href={this.getPrivacyUrl()} target="_blank" rel="noopener noreferrer"><Translate content="general.cookies.link" /></a>
          </div>
          <Actions className="col-12 col-md-3">
            <Button onClick={this.handleAcceptCookies}>
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
