import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import {
  DatePicker,
  handleDatePickerChange,
  getDateFormatLocale,
} from '@/components/qvain/general/V2/Datepicker'
import { InfoText, FieldGroup, TitleSmall } from '@/components/qvain/general/V2'
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
    Locale: { lang, translate },
  } = useStores()

  return (
    <FieldGroup>
      <Translate
        component={TitleSmall}
        content="qvain.rightsAndLicenses.embargoDate.label"
        htmlFor="embargo-date"
      />
      <DatePicker
        id="embargo-date"
        strictParsing
        selected={embargoExpDate ? new Date(embargoExpDate) : null}
        onChange={date => handleDatePickerChange(date, setEmbargoExpDate)}
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
