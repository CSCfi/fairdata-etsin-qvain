import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Select from '../../general/input/searchSelect'

import { InfrastructureModel } from '../../../../stores/view/qvain.infrastructure'

const InfrastructureSelection = ({ Stores }) => {
  const { infrastructures, set } = Stores.Qvain.Infrastructures
  return (
    <Select
      name="infrastructure"
      getter={infrastructures}
      setter={set}
      isMulti
      isClearable={false}
      model={InfrastructureModel}
      metaxIdentifier="research_infra"
    />
  )
}

InfrastructureSelection.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(InfrastructureSelection))
