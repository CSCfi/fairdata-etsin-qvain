import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import moment from 'moment'
import parseDate from 'moment-parseformat'
import DatePicker from 'react-datepicker'
import Card from '../general/card'
import ValidationError from '../general/validationError'
import { LabelLarge } from '../general/form'
import { issuedDateSchema } from '../utils/formValidation';
import DateFormats from '../utils/date'

class IssuedDateField extends React.Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      focused: false,
      error: false,
      errorMessage: ''
    }
  }

  validate = () => {
    const { issuedDate } = this.props.Stores.Qvain
    issuedDateSchema.validate(issuedDate).then(() => {
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
    const { setIssuedDate } = this.props.Stores.Qvain
    const date = this.prepareDate(dateStr)
    setIssuedDate(date)
  }

  render() {
    const { issuedDate, readonly } = this.props.Stores.Qvain
    const { error, errorMessage } = this.state
    return (
      <Card bottomContent>
        <LabelLarge htmlFor="issuedDateInput">
          <Translate content="qvain.description.issuedDate.title" />
        </LabelLarge>
        <Translate component="p" content="qvain.description.issuedDate.infoText" />
        <DatePicker
          selected={issuedDate ? new Date(issuedDate) : null}
          onChangeRaw={(e) => this.handleDatePickerChange(e.target.value)}
          onChange={(date) => this.handleDatePickerChange(date.getUTCDate())}
          locale={this.props.Stores.Locale.lang}
          placeholderText={translate('qvain.description.issuedDate.placeholder')}
          dateFormat={'yyyy-MM-dd'}
          disabled={readonly}
        />
        <Fragment>
          {error && <ValidationError>{errorMessage}</ValidationError>}
        </Fragment>
      </Card>
    )
  }
}


export default inject('Stores')(observer(IssuedDateField))
