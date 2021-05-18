import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import { LabelLarge } from '../../general/modal/form'
import Select from '../../general/input/select'
import ValidationError from '../../general/errors/validationError'
import { useStores } from '../../utils/stores'

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
    <RestrictionGroundsContainer>
      <Translate
        component={LabelLarge}
        htmlFor="restrictionGrounds-select"
        content="qvain.rightsAndLicenses.restrictionGrounds.title"
      />
      <Translate
        name="restrictionGrounds"
        metaxIdentifier="restriction_grounds"
        component={Select}
        attributes={{ placeholder: 'qvain.rightsAndLicenses.restrictionGrounds.placeholder' }}
        model={Model}
        getter={restrictionGrounds}
        setter={setRestrictionGrounds}
        onBlur={validate}
      />
      {validationError && <ValidationError>{validationError}</ValidationError>}
      <Text>
        <Translate content="qvain.rightsAndLicenses.restrictionGrounds.text" />
      </Text>
    </RestrictionGroundsContainer>
  )
}

const RestrictionGroundsContainer = styled.div`
  margin-top: 20px;
`
const Text = styled.p`
  margin-top: 10px;
`

export default observer(RestrictionGrounds)
