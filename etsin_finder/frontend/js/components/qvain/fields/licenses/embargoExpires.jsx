import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import {
  DatePicker,
  handleDatePickerChange,
  getDateFormatLocale,
} from '../../general/input/datepicker'
import { Label } from '../../general/modal/form'
import { embargoExpDateSchema } from '../../utils/formValidation'
import ValidationError from '../../general/errors/validationError'

class EmbargoExpires extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    focused: false,
    error: false,
    errorMessage: '',
  }

  validate = () => {
    const { embargoExpDate } = this.props.Stores.Qvain
    embargoExpDateSchema
      .validate(embargoExpDate)
      .then(() => {
        this.setState({ error: false, errorMessage: '' })
      })
      .catch(err => {
        this.setState({ error: true, errorMessage: err.errors })
      })
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (!this.state.focused && prevState.focused) {
      this.validate()
    }
  }

  render() {
    const { setEmbargoExpDate, embargoExpDate, readonly } = this.props.Stores.Qvain
    const { lang } = this.props.Stores.Locale
    const { error, errorMessage } = this.state

    return (
      <Fragment>
        <Translate component={Label} content="qvain.rightsAndLicenses.embargoDate.label" />
        <DatePicker
          strictParsing
          selected={embargoExpDate ? new Date(embargoExpDate) : null}
          onChangeRaw={e => e && handleDatePickerChange(e.target.value, setEmbargoExpDate)}
          onChange={date => date && handleDatePickerChange(date.toISOString(), setEmbargoExpDate)}
          locale={lang}
          placeholderText={translate('qvain.rightsAndLicenses.embargoDate.placeholder')}
          dateFormat={getDateFormatLocale(lang)}
          disabled={readonly}
        />
        {error && <ValidationError>{errorMessage}</ValidationError>}
        <Translate component="p" content="qvain.rightsAndLicenses.embargoDate.help" />
      </Fragment>
    )
  }
}

export default inject('Stores')(observer(EmbargoExpires))
