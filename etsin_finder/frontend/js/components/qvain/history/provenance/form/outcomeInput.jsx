import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { observer, inject } from 'mobx-react'
import Select from '../../../general/select'
import { Outcome } from '../../../../../stores/view/qvain.provenances'
import { Label } from '../../../general/form'

const OutcomeInput = ({ Stores }) => {
  const setOutcome = value => Stores.Qvain.Provenances.changeAttribute('outcome', value)
  const translations = {
    label: 'qvain.history.provenance.modal.outcomeInput.label',
    placeholder: 'qvain.history.provenance.modal.outcomeInput.placeholder'
  }
  return (
    <>
      <Label htmlFor="location-input">
        <Translate content={translations.label} />
      </Label>
      <Select
        name="infrastructure"
        getter={Stores.Qvain.Provenances.outcome}
        setter={setOutcome}
        model={Outcome}
        metaxIdentifier="event_outcome"
        inModal
      />
    </>
  )
}

OutcomeInput.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(OutcomeInput))
