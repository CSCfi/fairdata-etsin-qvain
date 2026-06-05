import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Navigate } from 'react-router'
import Translate from '@/utils/Translate'
import Card from '../../general/card'
import LoginButton from '../../../general/navigation/loginButton'
import { useStores } from '../../utils/stores'

const QvainLogin = ({ redirectPath }) => {
  const {
    Auth: { isAuthenticated, loading },
  } = useStores()

  return (
    <Card className="container">
      {loading && !isAuthenticated && <p>Loading...</p>}
      {!loading && !isAuthenticated && (
        <>
          <Translate component="p" content="qvain.notLoggedIn" />
          <LoginButton loginThroughService="qvain" />
        </>
      )}
      {isAuthenticated && <Navigate to={redirectPath} replace />}
    </Card>
  )
}

QvainLogin.propTypes = {
  redirectPath: PropTypes.string,
}

QvainLogin.defaultProps = {
  redirectPath: '/',
}

export default observer(QvainLogin)
