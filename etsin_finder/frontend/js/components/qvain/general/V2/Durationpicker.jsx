import styled from 'styled-components'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from '@/utils/Translate'
import { Title, FieldGroup, InfoText } from './index'
import { DatePicker, handleDatePickerChange, getDateFormatLocale } from './Datepicker'
import { useStores } from '@/stores/stores'

const DurationPicker = ({ Field, datum, id }) => {
  const { startDate, endDate } = Field.inEdit
  const { changeAttribute, translationsRoot } = Field
  const {
    Qvain: { readonly },
    Locale: { lang },
  } = useStores()
  const translations = {
    label: `${translationsRoot}.${datum}.label`,
    infoText: `${translationsRoot}.${datum}.infoText`,
    startInfoText: `${translationsRoot}.${datum}.startInfoText`,
    endInfoText: `${translationsRoot}.${datum}.endInfoText`,
  }

  const handleDateChange = (date, propName) =>
    date && handleDatePickerChange(date, d => changeAttribute(propName, d))

  return (
    <FieldGroup>
      <Title style={{ width: '100%', marginBottom: 5 }}>
        <Translate content={translations.label} />
      </Title>
      <DatePickerContainer>
        <FieldGroup>
          <Translate
            id={`${id}-start`}
            component={DatePicker}
            selectsStart
            maxDate={endDate && new Date(endDate)}
            startDate={startDate && new Date(startDate)}
            endDate={endDate && new Date(endDate)}
            strictParsing
            selected={startDate ? new Date(startDate) : ''}
            onChange={date => handleDateChange(date, 'startDate')}
            locale={lang}
            attributes={{
              ariaLabel: translations.startInfoText,
            }}
            dateFormat={getDateFormatLocale(lang)}
            disabled={readonly}
          />
          <Translate component={InfoText} content={translations.startInfoText} />
        </FieldGroup>
        <FieldGroup>
          <Translate
            id={`${id}-end`}
            component={DatePicker}
            selectsEnd
            minDate={startDate && new Date(startDate)}
            startDate={startDate && new Date(startDate)}
            endDate={endDate && new Date(endDate)}
            strictParsing
            selected={endDate ? new Date(endDate) : ''}
            onChange={date => handleDateChange(date, 'endDate')}
            locale={lang}
            attributes={{
              ariaLabel: translations.endInfoText,
            }}
            dateFormat={getDateFormatLocale(lang)}
            disabled={readonly}
          />
          <Translate component={InfoText} content={translations.endInfoText} />
        </FieldGroup>
      </DatePickerContainer>
    </FieldGroup>
  )
}

DurationPicker.propTypes = {
  Field: PropTypes.object.isRequired,
  datum: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}

const DatePickerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-left: -0.25em;

  & > * {
    margin: 0.25em;
  }

  input[type='text'] {
    margin: 0;
  }
`

export default observer(DurationPicker)
