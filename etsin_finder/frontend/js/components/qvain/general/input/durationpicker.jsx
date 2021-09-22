import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { Label } from '../modal/form'
import { DatePicker, handleDatePickerChange, getDateFormatLocale } from './datepicker'
import { useStores } from '../../utils/stores'

const DurationPicker = ({ Field, datum, id }) => {
  const { startDate, endDate } = Field.inEdit
  const { changeAttribute, translationsRoot } = Field
  const {
    Qvain: { readonly },
    Locale: { lang },
  } = useStores()
  const translations = {
    label: `${translationsRoot}.modal.${datum}Input.label`,
    startPlaceholder: `${translationsRoot}.modal.${datum}Input.startPlaceholder`,
    endPlaceholder: `${translationsRoot}.modal.${datum}Input.endPlaceholder`,
  }

  const handleDateChangeRaw = (e, propName) =>
    e && handleDatePickerChange(e.target.value, date => changeAttribute(propName, date))

  const handleDateChange = (date, propName) =>
    date && handleDatePickerChange(date.toISOString(), d => changeAttribute(propName, d))

  return (
    <>
      <Label style={{ width: '100%', marginBottom: 5 }}>
        <Translate content={translations.label} />
      </Label>
      <DatePickerContainer>
        <Translate
          id={`${id}-start`}
          component={DatePicker}
          selectsStart
          maxDate={endDate && new Date(endDate)}
          startDate={startDate && new Date(startDate)}
          endDate={endDate && new Date(endDate)}
          strictParsing
          selected={startDate ? new Date(startDate) : ''}
          onChangeRaw={e => handleDateChangeRaw(e, 'startDate')}
          onChange={date => handleDateChange(date, 'startDate')}
          locale={lang}
          attributes={{
            placeholderText: translations.startPlaceholder,
            ariaLabel: translations.startPlaceholder,
          }}
          dateFormat={getDateFormatLocale(lang)}
          disabled={readonly}
        />
        <Translate
          id={`${id}-end`}
          component={DatePicker}
          selectsEnd
          minDate={startDate && new Date(startDate)}
          startDate={startDate && new Date(startDate)}
          endDate={endDate && new Date(endDate)}
          strictParsing
          selected={endDate ? new Date(endDate) : ''}
          onChangeRaw={e => handleDateChangeRaw(e, 'endDate')}
          onChange={date => handleDateChange(date, 'endDate')}
          locale={lang}
          attributes={{
            placeholderText: translations.endPlaceholder,
            ariaLabel: translations.endPlaceholder,
          }}
          dateFormat={getDateFormatLocale(lang)}
          disabled={readonly}
        />
      </DatePickerContainer>
    </>
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
  margin: -0.25em -0.25em calc(-0.25em + 1.25em) -0.25em;

  & > * {
    margin: 0.25em;
  }

  input[type='text'] {
    margin: 0;
  }
`

export default observer(DurationPicker)
