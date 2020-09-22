import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import Card from '../general/card'
import ValidationError from '../general/errors/validationError'
import { LabelLarge } from '../general/modal/form'
import { issuedDateSchema } from '../utils/formValidation'
import {
  DatePicker,
  handleDatePickerChange,
  getDateFormatLocale,
} from '../general/input/datepicker'
import Tooltip from '../../general/tooltipHover'

class IssuedDateField extends React.Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      focused: false,
      error: false,
      errorMessage: '',
    }
  }

  validate = () => {
    const { issuedDate } = this.props.Stores.Qvain
    issuedDateSchema
      .validate(issuedDate)
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
    const { setIssuedDate, issuedDate, readonly } = this.props.Stores.Qvain
    const { lang } = this.props.Stores.Locale
    const { error, errorMessage } = this.state

    return (
      <Card bottomContent>
        <>
          <LabelLarge htmlFor="issuedDateInput">
            <Tooltip
              title={translate('qvain.description.fieldHelpTexts.requiredToPublish', {
                locale: lang,
              })}
              position="right"
            >
              <Translate content="qvain.description.issuedDate.title" /> *
            </Tooltip>
          </LabelLarge>
          <Translate component="p" content="qvain.description.issuedDate.infoText" />
          <DatePicker
            strictParsing
            selected={issuedDate ? new Date(issuedDate) : new Date()}
            onChangeRaw={e => e && handleDatePickerChange(e.target.value, setIssuedDate)}
            onChange={date => date && handleDatePickerChange(date.toISOString(), setIssuedDate)}
            locale={lang}
            placeholderText={translate('qvain.description.issuedDate.placeholder')}
            dateFormat={getDateFormatLocale(lang)}
            disabled={readonly}
          />
          <Fragment>{error && <ValidationError>{errorMessage}</ValidationError>}</Fragment>
        </>
      </Card>
    )
  }
}

export default inject('Stores')(observer(IssuedDateField))
