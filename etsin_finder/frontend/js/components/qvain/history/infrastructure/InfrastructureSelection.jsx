import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Select from '../../general/searchSelect'

import { Infrastructure } from '../../../../stores/view/qvain'

const InfrastructureSelection = ({ Stores }) => {
  const { infrastructureArray, setInfrastructureArray } = Stores.Qvain
  return (
    <Select
      name="infrastructure"
      getter={infrastructureArray}
      setter={setInfrastructureArray}
      isMulti
      isClearable={false}
      model={Infrastructure}
      metaxIdentifier="research_infra"
    />
  )
}

InfrastructureSelection.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(InfrastructureSelection))
