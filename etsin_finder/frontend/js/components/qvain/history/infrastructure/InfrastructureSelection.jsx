import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Select from '../../general/searchSelect'

import { Infrastructure } from '../../../../stores/view/qvain'

class InfrastructureSelection extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  handleSelectedItemClick = item => {
    this.props.Stores.Qvain.removeInfrastructure(item)
  }

  render() {
    const { infrastructureArray, setInfrastructureArray } = this.props.Stores.Qvain
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
}

export default inject('Stores')(observer(InfrastructureSelection))
