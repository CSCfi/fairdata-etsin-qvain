import { observer } from 'mobx-react'
import styled from 'styled-components'
import Card from '@/components/qvain/general/V2/card'
import { useStores } from '@/stores/stores'
import Translate from '@/utils/Translate'

const Container = styled(Card)`
  background-color: ${props => props.theme.color.primary};
  color: white;
  padding: 1rem 1rem 0.5rem 4rem;
  margin-bottom: -2rem;
`

export const OwnerBanner = () => {
  const {Qvain: { original}, Auth: { userName, user } } = useStores()

  const isOwner = original?.metadata_provider_user === userName
  const isQvainAdmin = user.admin_organizations?.some(org => org === original?.metadata_owner_admin_org)

  if (isOwner || !isQvainAdmin) {
    return null
  }

  let firstName = original?.metadata_provider_user
  let lastName = ""

  if (original?.metadata_provider_user_first_name && original?.metadata_provider_user_last_name) {
    firstName = original?.metadata_provider_user_first_name
    lastName = original?.metadata_provider_user_last_name
  }

  return (
      <Container>
        <Translate 
        component="h3"
        content="qvain.ownerBanner.adminOrg" 
        with={{ firstName, lastName }} 
        unsafe />
      </Container>
  )
}

export default observer(OwnerBanner)