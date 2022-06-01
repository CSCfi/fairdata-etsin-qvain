import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import {
  DatePicker,
  handleDatePickerChange,
  getDateFormatLocale,
} from '@/components/qvain/general/input/datepicker'
import { Title, InfoText, FieldGroup } from '@/components/qvain/general/V2'
import ValidationError from '@/components/qvain/general/errors/validationError'
import { useStores } from '@/stores/stores'

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
    <FieldGroup>
      <Translate component={Title} content="qvain.rightsAndLicenses.embargoDate.label" />
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
      <Translate component={InfoText} content="qvain.rightsAndLicenses.embargoDate.help" />
    </FieldGroup>
  )
}

export default observer(EmbargoExpires)
