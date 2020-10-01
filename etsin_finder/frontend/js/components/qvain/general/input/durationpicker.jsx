import React from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { Label } from '../modal/form'
import { DatePicker, handleDatePickerChange, getDateFormatLocale } from './datepicker'

const DurationPicker = ({ Stores, Field, translationsRoot, datum }) => {
  const translations = {
    label: `${translationsRoot}.modal.${datum}Input.label`,
    startPlaceholder: `${translationsRoot}.modal.${datum}Input.startPlaceholder`,
    endPlaceholder: `${translationsRoot}.modal.${datum}Input.endPlaceholder`,
  }
  const { startDate, endDate } = Field.inEdit
  const { changeAttribute } = Field
  const { readonly } = Stores.Qvain
  const { lang } = Stores.Locale

  const handleDateChangeRaw = (e, propName) =>
    e && handleDatePickerChange(e.target.value, date => changeAttribute(propName, date))

  const handleDateChange = (date, propName) =>
    date && handleDatePickerChange(date.toISOString(), d => changeAttribute(propName, d))

  return (
    <>
      <Label htmlFor="period-of-time-input" style={{ width: '100%', marginBottom: 5 }}>
        <Translate content={translations.label} />
      </Label>
      <DatePickerContainer>
        <Translate
          id="startTimeInput"
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
          id="endTimeInput"
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
  Stores: PropTypes.object.isRequired,
  Field: PropTypes.object.isRequired,
  translationsRoot: PropTypes.string.isRequired,
  datum: PropTypes.string.isRequired,
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

export default inject('Stores')(observer(DurationPicker))
