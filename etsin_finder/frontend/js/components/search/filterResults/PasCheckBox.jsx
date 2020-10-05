import React from 'react'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'

import { Checkbox, Label } from '../../qvain/general/modal/form'

export const PasCheckBox = props => {
  const { includePasDatasets, toggleIncludePasDatasets } = props.Stores.ElasticQuery
  if (props.aggr === 'data_catalog') {
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
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(PasCheckBox))
