import styled from 'styled-components'
import { useEffect } from 'react'
import { observer } from 'mobx-react'
import Select from 'react-select'

import Section from '@/components/qvain/general/V2/Section'
import { TitleSmall, Required, InfoText } from '@/components/qvain/general/V2'
import { Checkbox } from '@/components/qvain/general/modal/form'
import { useStores } from '@/stores/stores'
import Translate from '@/utils/Translate'

function AdminOrgSelector() {
  const {
    Qvain: {
      AdminOrg: {
        setSelectedAdminOrg,
        selectedAdminOrg,
        setConfirmationSelected,
        confirmationSelected,
        adminOrgOptions,
        selectDefaultAdminOrg,
      },
      draftOfDataset,
      readonly,
      Submit: { prevalidate },
    },
  } = useStores()

  const disabled = readonly || draftOfDataset

  useEffect(() => {
    if (selectedAdminOrg === undefined && adminOrgOptions.length > 0) {
      selectDefaultAdminOrg()
    }
  }, [selectedAdminOrg, selectDefaultAdminOrg, adminOrgOptions])

  const onChange = option => {
    setSelectedAdminOrg?.(option)
  }

  const onConfirmationChange = () => {
    setConfirmationSelected?.(!confirmationSelected)
    prevalidate?.()
  }

  return (
    <Section sectionName="AdminOrg" isGray>
      <TitleSmall htmlFor="admin-org-select" required>
        <Translate content="qvain.adminOrg.title" />
        <Required />
      </TitleSmall>

      {!disabled ? (
        <Translate component={InfoText} content="qvain.adminOrg.infoText" />
      ) : (
        <Translate component={InfoText} content="qvain.adminOrg.draftOfInfoText" />
      )}
      <Translate
        component={Select}
        inputId="admin-org-select"
        name="adminOrg"
        options={adminOrgOptions}
        onChange={onChange}
        value={selectedAdminOrg}
        isDisabled={disabled}
      />
      <CheckBoxRow>
        <ConfirmationCheckbox
          id="admin-org-confirmation"
          onChange={onConfirmationChange}
          checked={confirmationSelected}
          disabled={disabled}
        />
        <Translate
          component={InfoText}
          as="label"
          htmlFor="admin-org-confirmation"
          content="qvain.adminOrg.confirmationText"
        />
      </CheckBoxRow>
    </Section>
  )
}

const CheckBoxRow = styled.div`
  display: flex;
  align-items: center;
`

const ConfirmationCheckbox = styled(Checkbox)`
  flex-shrink: 0;
  margin-top: 0;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export default observer(AdminOrgSelector)
