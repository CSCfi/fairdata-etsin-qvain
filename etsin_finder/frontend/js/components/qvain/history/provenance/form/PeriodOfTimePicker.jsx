import React, { Component } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { Label } from '../../../general/form'
import { DatePicker, handleDatePickerChange, getDateFormatLocale } from '../../../general/datepicker'

class PeriodOfTimePicker extends Component {
    static propTypes = {
        Stores: PropTypes.object.isRequired
    }

    translations = {
      label: 'qvain.history.provenance.modal.periodOfTimeInput.label',
      startPlaceholder: 'qvain.history.provenance.modal.periodOfTimeInput.startPlaceholder',
      endPlaceholder: 'qvain.history.provenance.modal.periodOfTimeInput.endPlaceholder',
    }

    handleDateChangeRaw = (e, datum) => {
        const { changeAttribute } = this.props.Stores.Qvain.Provenances

        return e && handleDatePickerChange(
            e.target.value,
            (date) => changeAttribute(datum, date)
        )
    }

    handleDateChange = (date, datum) => {
        const { changeAttribute } = this.props.Stores.Qvain.Provenances

        return date ? handleDatePickerChange(
            date.toISOString(),
            (d) => changeAttribute(datum, d)
        ) : null;
    }

    render() {
        const { startDate, endDate } = this.props.Stores.Qvain.Provenances.inEdit
        const { readonly } = this.props.Stores.Qvain
        const { lang } = this.props.Stores.Locale

        return (
          <DatePickerContainer>
            <Label htmlFor="period-of-time-input" style={{ width: '100%', marginBottom: 5 }}>
              <Translate content={this.translations.label} />
            </Label>
            <div id="period-of-time-input">
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
                  onChangeRaw={(e) => this.handleDateChangeRaw(e, 'startDate')}
                  onChange={(date) => this.handleDateChange(date, 'startDate')}
                  locale={lang}
                  attributes={{ placeholderText: this.translations.startPlaceholder }}
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
                onChangeRaw={(e) => this.handleDateChangeRaw(e, 'endDate')}
                onChange={(date) => this.handleDateChange(date, 'endDate')}
                locale={lang}
                attributes={{ placeholderText: this.translations.endPlaceholder }}
                dateFormat={getDateFormatLocale(lang)}
                disabled={readonly}
              />
            </div>
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
  margin-right: 15px;
`

export default inject('Stores')(observer(PeriodOfTimePicker))
