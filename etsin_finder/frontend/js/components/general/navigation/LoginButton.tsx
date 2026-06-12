import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import Button from '../Button'
import Loader from '../Loader'
import LoggedInUser from '../LoggedInUser'
import { Dropdown, DropdownItem } from '../dropdown'
import { useStores } from '@/stores/stores'
import { useLocation, type Location } from 'react-router'
import type { Color } from '@/styles/theme'

const Login = ({
  margin = '0 0 0 0.4em',
  width,
  fontSize = 'inherit',
  borderColor = undefined,
  loginThroughService = '',
}: {
  margin: string
  width: string
  fontSize: string
  borderColor?: Color
  loginThroughService: string
}) => {
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
    globalThis.addEventListener('pageshow', pageShowHandler)
    return () => window.removeEventListener('pageshow', pageShowHandler)
  }, [])

  const redirectToLogin = (location: Location, loginThroughService: string) => {
    const query = location.search
    setLoading(true)
    globalThis.location.href = `/login/${loginThroughService}?relay=${location.pathname}${encodeURIComponent(
      query
    )}`
  }

  const logout = () => {
    globalThis.location.href = `/logout/${loginThroughService}`
  }
  if (!Auth.isAuthenticated) {
    return (
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
  fontSize: PropTypes.string,
  borderColor: PropTypes.string,
  loginThroughService: PropTypes.string,
}

interface ContProps {
  $width?: string
  $margin?: string
}

const Cont = styled.div<ContProps>`
  width: ${p => p.$width || ''};
  margin: ${p => p.$margin || ''};
  position: relative;
`

interface LoginButtonProps {
  borderColor?: Color
}

const LoginButton = styled(Button)<LoginButtonProps>`
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

interface LoaderContProps {
  $active?: boolean
}

const LoaderCont = styled.div<LoaderContProps>`
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
  visibility: ${p => (p.$active ? 'initial' : 'hidden')};
`

interface LoginTextProps {
  $visible?: boolean
  $fontSize?: string
}

const LoginText = styled.span<LoginTextProps>`
  visibility: ${p => (p.$visible ? 'initial' : 'hidden')};
  font-size: ${p => p.$fontSize};
`

export default observer(Login)
