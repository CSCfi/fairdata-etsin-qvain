import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import {
  DatePicker,
  handleDatePickerChange,
  getDateFormatLocale,
} from '../general/input/datepicker'
import { Label } from '../general/modal/form'
import ValidationError from '../general/errors/validationError'

class EmbargoExpires extends Component {
  validate = this.props.Stores.Qvain.EmbargoExpDate.validate

  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  render() {
    const { set, value, readonly, validationError } = this.props.Stores.Qvain.EmbargoExpDate
    const { lang } = this.props.Stores.Locale

    return (
      <Fragment>
        <Translate component={Label} content="qvain.rightsAndLicenses.embargoDate.label" />
        <DatePicker
          strictParsing
          selected={value ? new Date(value) : null}
          onChangeRaw={e => e && handleDatePickerChange(e.target.value, set)}
          onChange={date => date && handleDatePickerChange(date.toISOString(), set)}
          onBlur={this.validate}
          locale={lang}
          placeholderText={translate('qvain.rightsAndLicenses.embargoDate.placeholder')}
          dateFormat={getDateFormatLocale(lang)}
          disabled={readonly}
        />
        {<ValidationError>{validationError}</ValidationError>}
        <Translate component="p" content="qvain.rightsAndLicenses.embargoDate.help" />
      </Fragment>
    )
  }
}

export default inject('Stores')(observer(EmbargoExpires))
