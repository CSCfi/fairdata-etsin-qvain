import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import { DATA_CATALOG_IDENTIFIER } from '../../../utils/constants'
import { Checkbox, HelpField } from '../general/modal/form'
import { useStores } from '../utils/stores'

function DoiSelection() {
  const {
    Qvain: { dataCatalog, original, useDoi, setUseDoi, readonly },
  } = useStores()
  const isNewDraft = original && original.state === 'draft' && !original.draft_of
  const canSelectDoi = (!original || isNewDraft) && dataCatalog === DATA_CATALOG_IDENTIFIER.IDA

  const handleDoiCheckboxChange = event => {
    setUseDoi(event.target.checked)
  }

  if (!canSelectDoi) {
    return null
  }

  return (
    <DoiSelectionContainer>
      <CheckBoxRow>
        <DoiCheckbox
          id="doiSelector"
          onChange={handleDoiCheckboxChange}
          disabled={readonly || (original !== undefined && !isNewDraft)}
          checked={useDoi}
        />
        <DoiLabel htmlFor="doiSelector">
          <Translate content="qvain.files.dataCatalog.doiSelection" />
        </DoiLabel>
      </CheckBoxRow>
      {useDoi && (
        <Translate component={DoiHelpField} content="qvain.files.dataCatalog.doiSelectedHelp" />
      )}
    </DoiSelectionContainer>
  )
}

export const DoiCheckbox = styled(Checkbox)`
  flex-shrink: 0;
`

const DoiHelpField = styled(HelpField)`
  display: block;
  margin-top: 0.5rem;
`

const CheckBoxRow = styled.div`
  display: flex;
  align-items: center;
`

const DoiSelectionContainer = styled.div`
  margin-top: 20px;
`

const DoiLabel = styled.label`
  margin-right: auto;
  padding-left: 4px;
  display: inline-block;
`

export default observer(DoiSelection)
