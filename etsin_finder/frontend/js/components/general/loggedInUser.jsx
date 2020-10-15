import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { withStores } from '../../stores/stores'

const LoggedInUser = ({ Stores }) => {
  const { user, userLogged } = Stores.Auth
  const { firstName, lastName } = user

  const User = (
    <UserWrapper>
      <UserIcon icon={faUser} /> <Name>{firstName || lastName}</Name>
    </UserWrapper>
  )
  return userLogged ? User : null
}

const UserWrapper = styled.span`
  padding: 5px;
`
const UserIcon = styled(FontAwesomeIcon)`
  color: ${p => p.theme.color.white};
`
const Name = styled.span`
  color: ${p => p.theme.color.white};
`

LoggedInUser.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default withStores(observer(LoggedInUser))
