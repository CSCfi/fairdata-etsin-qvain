import React from 'react'
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
      <Translate component={Label} content="qvain.rightsAndLicenses.embargoDate.label" />
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

export default observer(EmbargoExpires)
