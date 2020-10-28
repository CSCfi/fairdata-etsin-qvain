import React from 'react'
import { observer } from 'mobx-react'
import Select from '../../general/input/searchSelect'

import { Infrastructure } from '../../../../stores/view/qvain'
import { useStores } from '../../utils/stores'

const InfrastructureSelection = () => {
  const {
    Qvain: { infrastructureArray, setInfrastructureArray },
  } = useStores()
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

export default observer(InfrastructureSelection)
