import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types';
import Translate from 'react-translate-component'
import moment from 'moment'
import parseDate from 'moment-parseformat'
import DatePicker, { registerLocale } from 'react-datepicker'
import fi from 'date-fns/locale/fi'
import en from 'date-fns/locale/en-GB'
import translate from 'counterpart'
import { Label } from '../general/form'
import { embargoExpDateSchema } from '../utils/formValidation';
import ValidationError from '../general/validationError';
import DateFormats from '../utils/date'

import 'react-datepicker/dist/react-datepicker.css'

registerLocale('fi', fi)
registerLocale('en', en)

class EmbargoExpires extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    focused: false,
    error: false,
    errorMessage: ''
  }

  validate = () => {
    const { embargoExpDate } = this.props.Stores.Qvain
    embargoExpDateSchema.validate(embargoExpDate).then(() => {
      this.setState({ error: false, errorMessage: '' })
    }).catch(err => {
      this.setState({ error: true, errorMessage: err.errors })
    })
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (!this.state.focused && prevState.focused) {
      this.validate()
    }
  }

  prepareDate = (dateStr) => {
    const date = moment(dateStr, parseDate(dateStr))
    if (date.isValid) return date.format(DateFormats.ISO8601_DATE_FORMAT)
    return null
  }

  handleDatePickerChange = dateStr => {
    const { setEmbargoExpDate } = this.props.Stores.Qvain
    const date = this.prepareDate(dateStr)
    setEmbargoExpDate(date)
  }

  render() {
    const { embargoExpDate } = this.props.Stores.Qvain
    const { error, errorMessage } = this.state
    return (
      <Fragment>
        <Translate component={Label} content="qvain.rightsAndLicenses.embargoDate.label" />
        <DatePicker
          selected={embargoExpDate ? new Date(embargoExpDate) : null}
          onChangeRaw={(e) => this.handleDatePickerChange(e.target.value)}
          onChange={(date) => this.handleDatePickerChange(date.getUTCDate())}
          locale={this.props.Stores.Locale.lang}
          placeholderText={translate('qvain.rightsAndLicenses.embargoDate.placeholder')}
          dateFormat={'yyyy-MM-dd'}
        />
        {error && <ValidationError>{errorMessage}</ValidationError>}
        <Translate component="p" content="qvain.rightsAndLicenses.embargoDate.help" />
      </Fragment>
    );
  }
}

/*
<DatePickerWrapper>
<Translate
  component={SingleDatePicker}
  hideKeyboardShortcutsPanel
  date={embargoExpDate ? moment.utc(embargoExpDate) : null}
  disabled={readonly}
  onDateChange={date => {
    if (date === null) {
      setEmbargoExpDate(undefined)
    } else {
      setEmbargoExpDate(date.utc().format(DateFormats.ISO8601_DATE_FORMAT))
    }
  }}
  focused={this.state.focused}
  onFocusChange={({ focused }) => this.setState({ focused })}
  id="embargo_expiration_date_field_id"
  showClearDate
  attributes={{ placeholder: 'qvain.rightsAndLicenses.embargoDate.placeholder' }}
  onClose={this.validate}
  displayFormat={DateFormats.ISO8601_DATE_FORMAT}
/>
</DatePickerWrapper>


const DatePickerWrapper = styled.div`
  width: 100%;
  font-family: inherit;
  & .SingleDatePicker {
    width: 100%;
  };
  & .SingleDatePickerInput {
    border-radius: 3px;
    border: 1px solid #cccccc;
    width: 100%;
  };
  & .DateInput {
    width: 100%;
  }
  & .DateInput_input {
    font-weight: inherit;
    font-size: inherit;
    padding: 8px;
    line-height: inherit;
  };
  & .DateInput_input__focused {
    border: inherit;
    border-radius: inherit;
  };
  & .SingleDatePickerInput_clearDate_svg {
    vertical-align: inherit;
  }
`;
*/

export default inject('Stores')(observer(EmbargoExpires))
