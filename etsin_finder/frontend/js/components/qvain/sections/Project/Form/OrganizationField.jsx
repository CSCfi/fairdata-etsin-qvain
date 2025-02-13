import React from 'react'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import { useStores } from '@/stores/stores'
import ModalFieldList from '@/components/qvain/general/V2/ModalFieldList'
import { Title, FieldGroup } from '@/components/qvain/general/V2'
import { ValidationError } from '@/components/qvain/general/errors'
import { BoxedContainer } from './CommonOrgComponents'
import OrganizationSelect from './OrganizationSelect'

const OrganizationField = () => {
  const {
    Qvain: {
      readonly,
      ProjectV2: {
        inEdit: { organizations: storageOrg },
        editOrg,
        saveOrg,
        removeOrg,
        orgValidationError,
      },
    },
  } = useStores()
  return (
    <FieldGroup>
      <BoxedContainer>
        <FieldGroup>
          <Translate component={Title} content="qvain.projectV2.organizations.title" />
          <Translate component="p" content={`qvain.projectV2.organizations.infoText`} />
          <ModalFieldList
            storage={storageOrg}
            edit={editOrg}
            save={saveOrg}
            readonly={readonly}
            remove={removeOrg}
            translationsRoot={'qvain.projectV2.organizations'}
          />
          <OrganizationSelect />
          {orgValidationError && <ValidationError>{orgValidationError}</ValidationError>}
        </FieldGroup>
      </BoxedContainer>
    </FieldGroup>
  )
}

export default observer(OrganizationField)
