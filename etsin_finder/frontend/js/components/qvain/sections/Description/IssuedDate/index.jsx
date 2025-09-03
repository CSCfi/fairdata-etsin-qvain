import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

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
} from '@/components/qvain/general/V2/Datepicker'
import Tooltip from '@/components/general/tooltipHover'
import { useStores } from '@/stores/stores'

const IssuedDateField = () => {
  const {
    Qvain: {
      readonly,
      IssuedDate: { value: issuedDate, set: setIssuedDate, validationError, validate },
      hasBeenPublishedWithDoi,
    },
    Locale: { lang, translate },
  } = useStores()

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
          onChange={date => {
            handleDatePickerChange(date, setIssuedDate)
            validate()
          }}
          locale={lang}
          placeholderText={translate('qvain.description.issuedDate.placeholder')}
          dateFormat={getDateFormatLocale(lang)}
          disabled={readonly || hasBeenPublishedWithDoi}
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
