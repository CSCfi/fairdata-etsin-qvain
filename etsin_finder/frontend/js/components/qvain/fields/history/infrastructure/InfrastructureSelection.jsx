import React from 'react'
import { observer } from 'mobx-react'
import Select from '../../../general/input/select'

import { useStores } from '@/stores/stores'

const InfrastructureSelection = () => {
  const {
    Qvain: {
      Infrastructures: { storage, Model, set },
      original,
    },
  } = useStores()

  // adding new infrastructures is disabled for now, show only options already in dataset
  const usedInfras = original?.research_dataset?.infrastructure || []
  const usedInfraIdentifiers = new Set(usedInfras.map(v => v.identifier))
  const usedInfrasFilter = v => usedInfraIdentifiers.has(v._source.uri)

  return (
    <Select
      inputId="infrastructure-select"
      name="infrastructure"
      getter={storage}
      setter={set}
      isMulti
      isClearable={false}
      model={Model}
      metaxIdentifier="research_infra"
      filterFunc={usedInfrasFilter}
    />
  )
}

export default observer(InfrastructureSelection)
