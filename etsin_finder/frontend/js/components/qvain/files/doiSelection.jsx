import React from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import { DATA_CATALOG_IDENTIFIER } from '../../../utils/constants'
import { Checkbox, HelpField } from '../general/form'

function DoiSelection(props) {
  const handleDoiCheckboxChange = event => {
    const { setUseDoi } = props.Stores.Qvain
    setUseDoi(event.target.checked)
  }

  const { dataCatalog, original, useDoi } = props.Stores.Qvain
  const isNewDraft = original && original.state === 'draft' && !original.draft_of
  const canSelectDoi = (!original || isNewDraft) && dataCatalog === DATA_CATALOG_IDENTIFIER.IDA
  if (!canSelectDoi) {
    return null
  }
  return (
    <DoiSelectionContainer>
      <CheckBoxRow>
        <DoiCheckbox
          id="doiSelector"
          onChange={handleDoiCheckboxChange}
          disabled={original !== undefined && !isNewDraft}
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

DoiSelection.propTypes = {
  Stores: PropTypes.object.isRequired,
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

export default inject('Stores')(observer(DoiSelection))
