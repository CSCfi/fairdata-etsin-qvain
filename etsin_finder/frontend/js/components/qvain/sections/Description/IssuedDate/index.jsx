import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import { withFieldErrorBoundary } from '@/components/qvain/general/errors/fieldErrorBoundary'
import ValidationError from '@/components/qvain/general/errors/validationError'
import {
  FieldGroup,
  FieldWrapper,
  Title,
  InfoText,
  Required,
  RequiredText,
} from '@/components/qvain/general/V2'
import {
  DatePicker,
  handleDatePickerChange,
  getDateFormatLocale,
} from '@/components/qvain/general/input/datepicker'
import Tooltip from '@/components/general/tooltipHover'
import { useStores } from '@/stores/stores'

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
    <FieldGroup>
      <FieldWrapper>
        <Title htmlFor="issuedDateInput">
          <Translate
            component={Tooltip}
            position="right"
            attributes={{
              title: 'qvain.description.fieldHelpTexts.requiredToPublish',
            }}
          >
            <Translate content="qvain.description.issuedDate.title" />
            <Required />
          </Translate>
        </Title>
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
      </FieldWrapper>
      <RequiredText />
      <Translate component={InfoText} content="qvain.description.issuedDate.infoText" />
      <>{validationError && <ValidationError>{validationError}</ValidationError>}</>
    </FieldGroup>
  )
}

export default withFieldErrorBoundary(
  observer(IssuedDateField),
  'qvain.description.issuedDate.title'
)
