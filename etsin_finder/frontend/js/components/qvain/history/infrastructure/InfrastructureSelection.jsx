import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Infrastructure } from '../../../../stores/view/qvain'
import SelectedItems from '../../general/selectedItems'
import Select from '../../general/select'
import AddButton from '../../general/addButton'

class InfrastructureSelection extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  handleSelectedItemClick = (item) => {
    this.props.Stores.Qvain.removeInfrastructure(item)
  }

  render() {
    const {
      setInfrastructure,
      infrastructure,
      setInfrastructures,
      infrastructures,
    } = this.props.Stores.Qvain
    return (
      <>
        <SelectedItems getter={infrastructures} handleClick={this.handleSelectedItemClick} noItems="qvain.history.infrastructure.noItems" />
        <Select
          name="infrastructure"
          getter={infrastructure}
          setter={setInfrastructure}
          model={Infrastructure}
          metaxIdentifier="research_infra"
        />
        <AddButton
          translation="qvain.history.infrastructure.addButton"
          setter={setInfrastructures}
          getter={infrastructures}
          selection={infrastructure}
          model={Infrastructure}
        />
      </>
    )
  }
}

export default inject('Stores')(observer(InfrastructureSelection))
