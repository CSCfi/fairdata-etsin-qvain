import { useEffect } from 'react'
import { useLocation } from 'react-router'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import QvainLogin from '../components/qvain/views/main/qvainLogin'
import { useStores } from '../utils/stores'

const LoggedInRoute = ({ notLoggedIn, children, component, render }) => {
  const location = useLocation()
  const { Auth } = useStores()

  useEffect(() => {
    if (!Auth.cscUserLogged) {
      Auth.checkLogin() // trigger login check
    }
  }, [Auth, location])

  if (component) {
    console.warn('LoggedInRoute: "component" prop not supported')
  }
  if (render) {
    console.warn('LoggedInRoute: "render" prop not supported')
  }

  let output = children
  if (!Auth.cscUserLogged) {
    if (notLoggedIn) {
      output = notLoggedIn
    } else {
      output = <QvainLogin redirectPath={location.pathname} />
    }
  }

  return output
}

LoggedInRoute.propTypes = {
  children: PropTypes.node.isRequired,
  computedMatch: PropTypes.object,
  notLoggedIn: PropTypes.node, // render this if not logged in
  component: PropTypes.node,
  render: PropTypes.func,
}

LoggedInRoute.defaultProps = {
  computedMatch: undefined,
  notLoggedIn: null,
  component: null,
  render: null,
}

export default observer(LoggedInRoute)
