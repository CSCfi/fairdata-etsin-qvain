import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Translate from 'react-translate-component'
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment'
import { Label } from '../general/form'

class EmbargoExpires extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    focused: false
  }

  render() {
    const { embargoExpDate } = this.props.Stores.Qvain
    return (
      <Fragment>
        <Translate component={Label} content="qvain.rightsAndLicenses.embargoDate.label" />
        <DatePickerWrapper>
          <Translate
            component={SingleDatePicker}
            date={embargoExpDate ? moment(embargoExpDate) : null}
            onDateChange={date => {
              if (date === null) {
                this.props.Stores.Qvain.embargoExpDate = undefined
              } else {
                this.props.Stores.Qvain.embargoExpDate = date.utc().format()
              }
            }}
            focused={this.state.focused}
            onFocusChange={({ focused }) => this.setState({ focused })}
            id="embargo_expiration_date_field_id"
            showClearDate
            attributes={{ placeholder: 'qvain.rightsAndLicenses.embargoDate.placeholder' }}
          />
        </DatePickerWrapper>
        <Translate component="p" content="qvain.rightsAndLicenses.embargoDate.help" />
      </Fragment>
    );
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
    border: 1px solid #eceeef;
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

export default inject('Stores')(observer(EmbargoExpires))
