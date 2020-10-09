import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import Card from '../general/card'
import ValidationError from '../general/errors/validationError'
import { LabelLarge } from '../general/modal/form'
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

  validate = () => this.props.Stores.Qvain.IssuedDate.validate()

  render() {
    const {
      original,
      value,
      set,
      useDoi,
      validationError,
      readonly,
    } = this.props.Stores.Qvain.IssuedDate
    const { lang } = this.props.Stores.Locale
    const publishedWithDoi = !!(useDoi && original)
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
            selected={value ? new Date(value) : new Date()}
            onChangeRaw={e => e && handleDatePickerChange(e.target.value, set)}
            onChange={date => date && handleDatePickerChange(date.toISOString(), set)}
            locale={lang}
            onBlur={this.validate}
            placeholderText={translate('qvain.description.issuedDate.placeholder')}
            dateFormat={getDateFormatLocale(lang)}
            disabled={readonly || publishedWithDoi}
          />
          <ValidationError>{validationError}</ValidationError>
        </>
      </Card>
    )
  }
}

export default inject('Stores')(observer(IssuedDateField))
