import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types';
import Translate from 'react-translate-component'
import moment from 'moment'
import parseDate from 'moment-parseformat'
import DatePicker from 'react-datepicker'
import translate from 'counterpart'
import { Label } from '../general/form'
import { embargoExpDateSchema } from '../utils/formValidation';
import ValidationError from '../general/validationError';
import DateFormats from '../utils/date'

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
    const { embargoExpDate, readonly } = this.props.Stores.Qvain
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
          disabled={readonly}
        />
        {error && <ValidationError>{errorMessage}</ValidationError>}
        <Translate component="p" content="qvain.rightsAndLicenses.embargoDate.help" />
      </Fragment>
    );
  }
}

export default inject('Stores')(observer(EmbargoExpires))
