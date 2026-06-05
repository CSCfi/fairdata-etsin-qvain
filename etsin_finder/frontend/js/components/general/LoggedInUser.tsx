import { observer } from 'mobx-react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { useStores } from '@/stores/stores'

const LoggedInUser = () => {
  const {
    Auth: { user, isAuthenticated },
  } = useStores()
  const { firstName, lastName, name } = user

  const User = (
    <UserWrapper>
      <UserIcon icon={faUser} /> <Name>{firstName || lastName || name}</Name>
    </UserWrapper>
  )
  return isAuthenticated ? User : null
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

export default observer(LoggedInUser)
