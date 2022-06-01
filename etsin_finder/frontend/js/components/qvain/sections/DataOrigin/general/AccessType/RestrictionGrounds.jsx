import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import { Title, InfoText, FieldGroup } from '@/components/qvain/general/V2'
import Select from '@/components/qvain/general/input/select'
import ValidationError from '@/components/qvain/general/errors/validationError'
import { useStores } from '@/stores/stores'

const RestrictionGrounds = () => {
  const {
    Qvain: {
      RestrictionGrounds: {
        value: restrictionGrounds,
        set: setRestrictionGrounds,
        Model,
        validate,
        validationError,
      },
    },
  } = useStores()

  return (
    <FieldGroup>
      <Translate
        component={Title}
        htmlFor="restrictionGrounds-select"
        content="qvain.rightsAndLicenses.restrictionGrounds.title"
      />
      <Select
        name="restrictionGrounds"
        metaxIdentifier="restriction_grounds"
        placeholder="qvain.rightsAndLicenses.restrictionGrounds.placeholder"
        model={Model}
        getter={restrictionGrounds}
        setter={setRestrictionGrounds}
        onBlur={validate}
        aria-autocomplete="list"
      />
      {validationError && <ValidationError>{validationError}</ValidationError>}
      <Translate component={InfoText} content="qvain.rightsAndLicenses.restrictionGrounds.text" />
    </FieldGroup>
  )
}

export default observer(RestrictionGrounds)
