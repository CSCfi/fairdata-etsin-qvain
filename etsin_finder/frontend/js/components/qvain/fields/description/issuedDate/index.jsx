import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import { withFieldErrorBoundary } from '../../../general/errors/fieldErrorBoundary'
import Card from '../../../general/card'
import ValidationError from '../../../general/errors/validationError'
import { LabelLarge } from '../../../general/modal/form'
import {
  DatePicker,
  handleDatePickerChange,
  getDateFormatLocale,
} from '../../../general/input/datepicker'
import Tooltip from '../../../../general/tooltipHover'
import { useStores } from '../../../utils/stores'

const IssuedDateField = () => {
  const {
    Qvain: {
      original,
      useDoi,
      readonly,
      IssuedDate: { value: issuedDate, set: setIssuedDate, validationError, validate },
    },
    Locale: { lang },
  } = useStores()

  const publishedWithDoi = !!(useDoi && original)

  return (
    <Card bottomContent>
      <LabelLarge htmlFor="issuedDateInput">
        <Translate
          component={Tooltip}
          position="right"
          attributes={{
            title: 'qvain.description.fieldHelpTexts.requiredToPublish',
          }}
        >
          <Translate content="qvain.description.issuedDate.title" /> *
        </Translate>
      </LabelLarge>
      <Translate component="p" content="qvain.description.issuedDate.infoText" />
      <DatePicker
        id="issuedDateInput"
        strictParsing
        selected={issuedDate ? new Date(issuedDate) : new Date()}
        onChangeRaw={e => {
          if (e) handleDatePickerChange(e.target.value, setIssuedDate)
          validate()
        }}
        onChange={date => {
          if (date) handleDatePickerChange(date.toISOString(), setIssuedDate)
          validate()
        }}
        locale={lang}
        placeholderText={translate('qvain.description.issuedDate.placeholder')}
        dateFormat={getDateFormatLocale(lang)}
        disabled={readonly || publishedWithDoi}
        required
      />
      <>{validationError && <ValidationError>{validationError}</ValidationError>}</>
    </Card>
  )
}

export default withFieldErrorBoundary(
  observer(IssuedDateField),
  'qvain.description.issuedDate.title'
)
