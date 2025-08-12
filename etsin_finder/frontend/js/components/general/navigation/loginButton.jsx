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

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import Button from '../button'
import Loader from '../loader'
import NoticeBar from '../noticeBar'
import LoggedInUser from '../loggedInUser'
import { Dropdown, DropdownItem } from '../dropdown'
import { useStores } from '@/stores/stores'
import { useLocation } from 'react-router-dom'

const Login = ({
  margin = '0 0 0 0.4em',
  width,
  isLoggedInKey = 'userLogged',
  fontSize = 'inherit',
  borderColor = '',
  loginThroughService = '',
}) => {
  const [showNotice, setShowNotice] = useState(false)
  const [loading, setLoading] = useState(false)
  const {
    Auth,
    Locale: { translate },
  } = useStores()

  const location = useLocation()

  const pageShowHandler = () => {
    setLoading(false)
  }

  useEffect(() => {
    window.addEventListener('pageshow', pageShowHandler)
    return () => window.removeEventListener('pageshow', pageShowHandler)
  }, [])

  const redirectToLogin = (location, loginThroughService) => {
    const query = location.search
    setLoading(true)
    window.location = `/login/${loginThroughService}?relay=${location.pathname}${encodeURIComponent(
      query
    )}`
  }

  const logout = () => {
    setShowNotice(true)
    window.location = `/logout/${loginThroughService}`
  }

  if (!Auth[isLoggedInKey]) {
    return (
      <>
        <Cont $width={width} $margin={margin}>
          <LoaderCont $active={loading}>
            <Loader active color="white" size="1.1em" spinnerSize="3px" />
          </LoaderCont>
          <LoginButton
            width={width}
            margin="0"
            onClick={() => redirectToLogin(location, loginThroughService)}
            borderColor={borderColor}
          >
            <LoginText $visible={!loading} $fontSize={fontSize}>
              {translate('nav.login')}
            </LoginText>
          </LoginButton>
        </Cont>
        {showNotice && (
          <NoticeBar
            border
            z="100"
            position="fixed"
            border_color="primary"
            color="white"
            bg="primary"
            duration={4000}
          >
            {translate('nav.logoutNotice')}
          </NoticeBar>
        )}
      </>
    )
  }
  return (
    <Dropdown buttonComponent={LoginButton} buttonContent={<LoggedInUser />}>
      <DropdownItem onClick={logout}>{translate('nav.logout')}</DropdownItem>
    </Dropdown>
  )
}

Login.propTypes = {
  margin: PropTypes.string,
  width: PropTypes.string,
  isLoggedInKey: PropTypes.string,
  fontSize: PropTypes.string,
  borderColor: PropTypes.string,
  loginThroughService: PropTypes.string,
}

const Cont = styled.div`
  width: ${p => p.$width || ''};
  margin: ${p => p.$margin || ''};
  position: relative;
`

const LoginButton = styled(Button)`
  white-space: nowrap;
  width: fit-content;
  ${props =>
    props.borderColor &&
    `
  border-color: ${props.theme.color[props.borderColor]};
  &:hover {
    border-color: ${props.theme.color[props.borderColor]};
  }
  `}
`

const LoaderCont = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
  visibility: ${p => (p.$active ? 'initial' : 'hidden')};
`
const LoginText = styled.span`
  visibility: ${p => (p.$visible ? 'initial' : 'hidden')};
  font-size: ${p => p.$fontSize};
`

export default observer(Login)
