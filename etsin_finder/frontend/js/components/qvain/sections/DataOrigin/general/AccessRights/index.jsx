import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { Title, Divider } from '@/components/qvain/general/V2'

import License from './License'
import AccessType from './AccessType'
import AccessRightsDescription from './Description'
import ShowDataDetails from './ShowDataDetails'
import { useStores } from '@/stores/stores'
import { ACCESS_TYPE_URL, DATA_CATALOG_IDENTIFIER } from '@/utils/constants'

const AccessRights = () => {
  const {
    Qvain: {
      dataCatalog,
      AccessType: { value },
    },
  } = useStores()
  const isOpen = value?.url === ACCESS_TYPE_URL.OPEN
  const isIDA = dataCatalog === DATA_CATALOG_IDENTIFIER.IDA

  return (
    <>
      <Translate component={Title} content="qvain.rightsAndLicenses.accessRights" />
      <FormContainer>
        <License />
        <AccessType />
        <Divider />
        <AccessRightsDescription />
        <Divider />
        {!isOpen && isIDA && <ShowDataDetails />}
      </FormContainer>
    </>
  )
}

const FormContainer = styled.div`
  padding-left: 1rem;
`

export default AccessRights
