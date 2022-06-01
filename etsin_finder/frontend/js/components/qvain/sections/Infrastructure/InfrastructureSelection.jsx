import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import Select from '@/components/qvain/general/input/select'

import { useStores } from '@/stores/stores'
import { FieldGroup, InfoText, InfoTextLarge } from '@/components/qvain/general/V2'

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
    <FieldGroup>
      <Translate component={InfoTextLarge} content="qvain.infrastructure.addingDisabled" />
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
      <Translate component={InfoText} content="qvain.infrastructure.selectInfoText" />
    </FieldGroup>
  )
}

export default observer(InfrastructureSelection)
