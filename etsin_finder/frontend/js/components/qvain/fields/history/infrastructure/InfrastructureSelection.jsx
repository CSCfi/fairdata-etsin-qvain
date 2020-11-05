import React from 'react'
import { observer } from 'mobx-react'
import Select from '../../../general/input/searchSelect'

import { useStores } from '../../../utils/stores'

const InfrastructureSelection = () => {
  const {
    Qvain: {
      Infrastructures: { storage, Model, set },
    },
  } = useStores()
  return (
    <Select
      name="infrastructure"
      getter={storage}
      setter={set}
      isMulti
      isClearable={false}
      model={Model}
      metaxIdentifier="research_infra"
    />
  )
}

export default observer(InfrastructureSelection)
