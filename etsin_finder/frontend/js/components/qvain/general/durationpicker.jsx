import React, { Component } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { Label } from './form'
import { DatePicker, handleDatePickerChange, getDateFormatLocale } from './datepicker'

class DurationPicker extends Component {
  translations = {
    label: `${this.props.translationsRoot}.modal.${this.props.datum}Input.label`,
    startPlaceholder: `${this.props.translationsRoot}.modal.${this.props.datum}Input.startPlaceholder`,
    endPlaceholder: `${this.props.translationsRoot}.modal.${this.props.datum}Input.endPlaceholder`,
  }

  static propTypes = {
    Stores: PropTypes.object.isRequired,
    Field: PropTypes.object.isRequired,
    translationsRoot: PropTypes.string.isRequired,
    datum: PropTypes.string.isRequired,
  }

  handleDateChangeRaw = (e, datum) => {
    const { changeAttribute } = this.props.Field

    return e && handleDatePickerChange(e.target.value, date => changeAttribute(datum, date))
  }

  handleDateChange = (date, datum) => {
    const { changeAttribute } = this.props.Field

    return date ? handleDatePickerChange(date.toISOString(), d => changeAttribute(datum, d)) : null
  }

  render() {
    const { startDate, endDate } = this.props.Field.inEdit
    const { readonly } = this.props.Stores.Qvain
    const { lang } = this.props.Stores.Locale

    return (
      <DatePickerContainer>
        <Label htmlFor="period-of-time-input" style={{ width: '100%', marginBottom: 5 }}>
          <Translate content={this.translations.label} />
        </Label>
        <DatePickerStartWrapper>
          <Translate
            id="startTimeInput"
            component={DatePicker}
            selectsStart
            maxDate={endDate && new Date(endDate)}
            startDate={startDate && new Date(startDate)}
            endDate={endDate && new Date(endDate)}
            strictParsing
            selected={startDate ? new Date(startDate) : ''}
            onChangeRaw={e => this.handleDateChangeRaw(e, 'startDate')}
            onChange={date => this.handleDateChange(date, 'startDate')}
            locale={lang}
            attributes={{
              placeholderText: this.translations.startPlaceholder,
              ariaLabel: this.translations.startPlaceholder,
            }}
            dateFormat={getDateFormatLocale(lang)}
            disabled={readonly}
          />
        </DatePickerStartWrapper>
        <Translate
          id="endTimeInput"
          component={DatePicker}
          selectsEnd
          minDate={startDate && new Date(startDate)}
          startDate={startDate && new Date(startDate)}
          endDate={endDate && new Date(endDate)}
          strictParsing
          selected={endDate ? new Date(endDate) : ''}
          onChangeRaw={e => this.handleDateChangeRaw(e, 'endDate')}
          onChange={date => this.handleDateChange(date, 'endDate')}
          locale={lang}
          attributes={{
            placeholderText: this.translations.endPlaceholder,
            ariaLabel: this.translations.endPlaceholder,
          }}
          dateFormat={getDateFormatLocale(lang)}
          disabled={readonly}
        />
      </DatePickerContainer>
    )
  }
}

const DatePickerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`

const DatePickerStartWrapper = styled.span`
  margin-right: 0.5em;
`

export default inject('Stores')(observer(DurationPicker))
