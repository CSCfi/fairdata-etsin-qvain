import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Navigate } from 'react-router-dom'
import Translate from '@/utils/Translate'
import Card from '../../general/card'
import LoginButton from '../../../general/navigation/loginButton'
import { useStores } from '../../utils/stores'

const QvainLogin = ({ redirectPath }) => {
  const {
    Auth: { cscUserLogged, loading },
  } = useStores()

  return (
    <Card className="container">
      {loading && !cscUserLogged && <p>Loading...</p>}
      {!loading && !cscUserLogged && (
        <>
          <Translate component="p" content="qvain.notLoggedIn" />
          <LoginButton loginThroughService="qvain" isLoggedInKey="cscUserLogged" />
        </>
      )}
      {cscUserLogged && <Navigate to={redirectPath} replace />}
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
