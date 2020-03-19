import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { SingleDatePicker } from 'react-dates';
import styled from 'styled-components'
import Translate from 'react-translate-component'
import moment from 'moment'
import Button from '../../general/button'
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

  render() {
    const { readonly, issuedDate, setIssuedDate } = this.props.Stores.Qvain
    const { error, errorMessage } = this.state
    return (
      <Card bottomContent>
        <LabelLarge htmlFor="issuedDateInput">
          <Translate content="qvain.description.issuedDate.title" />
        </LabelLarge>
        <Translate component="p" content="qvain.description.issuedDate.infoText" />
        <Fragment>
            <DatePickerWrapper>
            <Translate
              component={SingleDatePicker}
              hideKeyboardShortcutsPanel
              date={issuedDate ? moment.utc(issuedDate) : null}
              disabled={readonly}
              onDateChange={
                date => {
                  if (date === null) {
                      setIssuedDate(undefined)
                  } else {
                      setIssuedDate(date.utc().format(DateFormats.ISO8601_DATE_FORMAT))
                  }
                }
              }
              focused={this.state.focused}
              onFocusChange={({ focused }) => this.setState({ focused })}
              id="issued_date_field_id"
              showClearDate
              isOutsideRange={() => false}
              attributes={{ placeholder: 'qvain.description.issuedDate.placeholder' }}
              onClose={this.validate}
              displayFormat={DateFormats.ISO8601_DATE_FORMAT}
            />
            </DatePickerWrapper>
            {error && <ValidationError>{errorMessage}</ValidationError>}
        </Fragment>
      </Card>
    )
  }
}

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
`

export default inject('Stores')(observer(IssuedDateField))
