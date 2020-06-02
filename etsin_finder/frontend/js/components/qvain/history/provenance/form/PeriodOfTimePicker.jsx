import React, { Component } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import translate from 'counterpart'
import Translate from 'react-translate-component'
import { Label } from '../../../general/form'
import { DatePicker, handleDatePickerChange, getDateFormatLocale } from '../../../general/datepicker'

class PeriodOfTimePicker extends Component {
    static propTypes = {
        Stores: PropTypes.object.isRequired
    }

    handleDateChangeRaw = (e, datum) => {
        const { changeProvenanceAttribute } = this.props.Stores.Qvain.Provenances

        console.log(e)
        return e && handleDatePickerChange(
            e.target.value,
            (date) => changeProvenanceAttribute(datum, date)
        )
    }

    handleDateChange = (date, datum) => {
        const { changeProvenanceAttribute } = this.props.Stores.Qvain.Provenances

        return date ? handleDatePickerChange(
            date.toISOString(),
            (d) => changeProvenanceAttribute(datum, d)
        ) : null;
    }

    render() {
        const { startDate, endDate } = this.props.Stores.Qvain.Provenances.provenanceInEdit
        const { readonly } = this.props.Stores.Qvain
        const { lang } = this.props.Stores.Locale

        return (
          <DatePickerContainer>
            <div>
              <Label htmlFor="startTimeInput">
                <Translate content="qvain.description.issuedDate.title" />
              </Label>

              <DatePicker
                id="startTimeInput"
                selectsStart
                maxDate={endDate && new Date(endDate)}
                startDate={startDate && new Date(startDate)}
                endDate={endDate && new Date(endDate)}
                strictParsing
                selected={startDate ? new Date(startDate) : ''}
                onChangeRaw={(e) => this.handleDateChangeRaw(e, 'startDate')}
                onChange={(date) => this.handleDateChange(date, 'startDate')}
                locale={lang}
                placeholderText={translate('qvain.description.issuedDate.placeholder')}
                dateFormat={getDateFormatLocale(lang)}
                disabled={readonly}
              />
            </div>
            <div>
              <Label htmlFor="endTimeInput">
                <Translate content="qvain.description.issuedDate.title" />
              </Label>
              <DatePicker
                id="endTimeInput"
                selectsEnd
                minDate={startDate && new Date(startDate)}
                startDate={startDate && new Date(startDate)}
                endDate={endDate && new Date(endDate)}
                strictParsing
                selected={endDate ? new Date(endDate) : ''}
                onChangeRaw={(e) => this.handleDateChangeRaw(e, 'endDate')}
                onChange={(date) => this.handleDateChange(date, 'endDate')}
                locale={lang}
                placeholderText={translate('qvain.description.issuedDate.placeholder')}
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
  justify-content: space-evenly;
`

export default inject('Stores')(observer(PeriodOfTimePicker))
