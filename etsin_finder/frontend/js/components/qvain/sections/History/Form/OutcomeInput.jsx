import React from 'react'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'

import { useStores } from '@/stores/stores'
import { Outcome } from '@/stores/view/qvain.provenances'
import Select from '@/components/qvain/general/input/select'
import { Label } from '@/components/qvain/general/modal/form'

const OutcomeInput = () => {
  const {
    Qvain: {
      Provenances: { changeAttribute, outcome },
    },
  } = useStores()
  const setOutcome = value => changeAttribute('outcome', value)
  const translations = {
    label: 'qvain.history.provenance.modal.outcomeInput.label',
    placeholder: 'qvain.history.provenance.modal.outcomeInput.placeholder',
  }
  return (
    <>
      <Label htmlFor="location-input">
        <Translate content={translations.label} />
      </Label>
      <Select
        name="infrastructure"
        getter={outcome}
        setter={setOutcome}
        model={Outcome}
        metaxIdentifier="event_outcome"
        inModal
      />
    </>
  )
}

export default observer(OutcomeInput)
