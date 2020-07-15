import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import Button from '../components/general/button'


const CookiesNotification = () => {
  const handleAcceptCookies = () =>
    console.log('Cookies accepted')

  const isVisible = () => true

  return (
    <Notification visible={isVisible()}>
      <div className="container row no-gutters">
        <div className="col-12 col-lg-7">
          <Translate component="p" content="general.cookies.infoText" />
          <a href="#"><Translate content="general.cookies.linkText" /></a>
        </div>
        <Actions className="col-12 col-lg-5">
          <Button>
            <Translate content="general.cookies.settings" />
          </Button>
          <Button onClick={handleAcceptCookies}>
            <Translate content="general.cookies.accept" />
          </Button>
        </Actions>
      </div>
    </Notification>
  )
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
