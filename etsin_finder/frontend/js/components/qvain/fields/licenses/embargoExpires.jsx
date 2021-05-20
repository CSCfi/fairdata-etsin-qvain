import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import {
  DatePicker,
  handleDatePickerChange,
  getDateFormatLocale,
} from '../../general/input/datepicker'
import { Label } from '../../general/modal/form'
import ValidationError from '../../general/errors/validationError'
import { useStores } from '../../utils/stores'

const EmbargoExpires = () => {
  const {
    Qvain: {
      EmbargoExpDate: {
        value: embargoExpDate,
        set: setEmbargoExpDate,
        readonly,
        validationError,
        validate,
      },
    },
    Locale: { lang },
  } = useStores()

  return (
    <>
      <Translate component={ExpirationLabel} content="qvain.rightsAndLicenses.embargoDate.label" />
      <DatePicker
        strictParsing
        selected={embargoExpDate ? new Date(embargoExpDate) : null}
        onChangeRaw={e => e && handleDatePickerChange(e.target.value, setEmbargoExpDate)}
        onChange={date => date && handleDatePickerChange(date.toISOString(), setEmbargoExpDate)}
        locale={lang}
        placeholderText={translate('qvain.rightsAndLicenses.embargoDate.placeholder')}
        dateFormat={getDateFormatLocale(lang)}
        disabled={readonly}
        onBlur={validate}
      />
      {validationError && <ValidationError>{validationError}</ValidationError>}
      <Translate component="p" content="qvain.rightsAndLicenses.embargoDate.help" />
    </>
  )
}

const ExpirationLabel = styled(Label)`
  margin-top: 1rem;
  padding: 0;
`

export default observer(EmbargoExpires)
