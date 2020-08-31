import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Infrastructure } from '../../../../stores/view/qvain'
import SelectedItems from '../../general/selectedItems'
import Select from '../../general/select'
import AddButton from '../../general/addButton'

const InfrastructureSelection = ({ Stores }) => {
  const {
    removeInfrastructure,
    setInfrastructure,
    infrastructure,
    setInfrastructures,
    infrastructures,
  } = Stores.Qvain
  return (
    <>
      <SelectedItems
        getter={infrastructures}
        handleClick={removeInfrastructure}
        noItems="qvain.history.infrastructure.noItems"
      />
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

InfrastructureSelection.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(InfrastructureSelection))
