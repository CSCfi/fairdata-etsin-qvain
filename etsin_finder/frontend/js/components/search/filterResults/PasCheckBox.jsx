import React from 'react'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import { Checkbox, Label } from '../../qvain/general/modal/form'
import { useStores } from '../../../utils/stores'

export const PasCheckBox = ({ aggr }) => {
  const {
    ElasticQuery: { includePasDatasets, toggleIncludePasDatasets },
  } = useStores()
  if (aggr === 'data_catalog') {
    return (
      <>
        <Label htmlFor="pasCheckbox">
          <Checkbox
            id="pasCheckbox"
            checked={includePasDatasets}
            onChange={toggleIncludePasDatasets}
          />
          <Translate content="home.includePas" />
        </Label>
      </>
    )
  }
  return null
}

PasCheckBox.propTypes = {
  aggr: PropTypes.string.isRequired,
}

export default observer(PasCheckBox)
