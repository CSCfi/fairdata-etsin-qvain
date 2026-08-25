import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { useLocation } from 'react-router'

import QvainLogin from '../components/qvain/views/main/qvainLogin'
import { useStores } from '../utils/stores'

type LoggedInRouteProps = {
  children: React.ReactNode
  notLoggedIn?: React.ReactNode | null
}

const LoggedInRoute = ({ children, notLoggedIn = null }: LoggedInRouteProps) => {
  const location = useLocation()
  const { Auth } = useStores()

  useEffect(() => {
    if (!Auth.isAuthenticated) {
      Auth.checkLogin() // trigger login check
    }
  }, [Auth, location])

  let output = children
  if (!Auth.isAuthenticated) {
    if (notLoggedIn) {
      output = notLoggedIn
    } else {
      output = <QvainLogin redirectPath={location.pathname} />
    }
  }

  return output
}

export default observer(LoggedInRoute)
