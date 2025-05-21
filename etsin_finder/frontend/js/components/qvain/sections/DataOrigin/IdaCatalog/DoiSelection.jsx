import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { FieldGroup, Title } from '@/components/qvain/general/V2'
import { Checkbox } from '@/components/qvain/general/modal/form'
import { DATA_CATALOG_IDENTIFIER } from '@/utils/constants'
import { useStores } from '@/utils/stores'

function DoiSelection() {
  const {
    Qvain: { dataCatalog, original, useDoi, setUseDoi, readonly, isNewVersion },
  } = useStores()
  const isNewDraft = original && original.state === 'draft' && !original.draft_of
  const canSelectDoi =
    (!original || isNewDraft || isNewVersion) && dataCatalog === DATA_CATALOG_IDENTIFIER.IDA

  const handleDoiCheckboxChange = event => {
    setUseDoi(event.target.checked)
  }

  if (!canSelectDoi) {
    return null
  }

  return (
    <FieldGroup>
      <Title htmlFor="doiSelector">
        <Translate content="qvain.files.dataCatalog.doi" />
      </Title>
      <CheckBoxRow>
        <DoiCheckbox
          id="doiSelector"
          onChange={handleDoiCheckboxChange}
          disabled={readonly || (original !== undefined && !isNewDraft && !isNewVersion)}
          checked={useDoi}
        />
        <DoiLabel htmlFor="doiSelector">
          <Translate content="qvain.files.dataCatalog.doiSelection" />
        </DoiLabel>
      </CheckBoxRow>
    </FieldGroup>
  )
}

export const DoiCheckbox = styled(Checkbox)`
  flex-shrink: 0;
`

const CheckBoxRow = styled.div`
  display: flex;
  align-items: center;
`

const DoiLabel = styled.label`
  margin-right: auto;
  padding-left: 4px;
  display: inline-block;
`

export default observer(DoiSelection)
