import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import { Title, InfoText, FieldGroup } from '@/components/qvain/general/V2'
import Select from '@/components/qvain/general/V2/Select'
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
    <FieldGroup data-cy="restriction-grounds-select">
      <Translate
        component={Title}
        htmlFor="restrictionGrounds-select"
        content="qvain.rightsAndLicenses.restrictionGrounds.title"
      />
      <Translate
        component={Select}
        name="restrictionGrounds"
        metaxIdentifier="restriction_grounds"
        placeholder="qvain.rightsAndLicenses.restrictionGrounds.placeholder"
        model={Model}
        getter={restrictionGrounds}
        setter={setRestrictionGrounds}
        onBlur={validate}
        aria-autocomplete="list"
        attributes={{
          'aria-label': 'qvain.rightsAndLicenses.accessType.placeholder',
        }}
      />
      {validationError && <ValidationError>{validationError}</ValidationError>}
      <Translate component={InfoText} content="qvain.rightsAndLicenses.restrictionGrounds.text" />
    </FieldGroup>
  )
}

export default observer(RestrictionGrounds)
