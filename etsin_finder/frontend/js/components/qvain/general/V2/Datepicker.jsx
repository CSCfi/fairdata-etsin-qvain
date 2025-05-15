import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactDatePicker from 'react-datepicker'
import moment from 'moment'
import parseDate from 'moment-parseformat'
import DateFormats from '@/components/qvain/utils/date'

export const StyledCustomDatePicker = styled(ReactDatePicker)`
  display: inline-block;
  border-radius: 3px;
  border: 1px solid rgb(204, 204, 204);
  padding: 8px;
  font-size: 16px;
  box-sizing: border-box;
  margin-bottom: 0;'
  width: 8rem;
`

export const DatePicker = props => {
  const onKeyDown = e => {
    // Close calendar on escape and prevent event from being propagated so modal doesn't close
    if (e.key === 'Escape' && open) {
      e.stopPropagation()
      return false
    }
    // Process keyDown normally
    return true
  }

  // Pass ariaLabel prop to the input element
  const ariaLabel = props.ariaLabel

  return (
    <div>
      <StyledCustomDatePicker
        customInput={<input aria-label={ariaLabel} />}
        enableTabLoop={false}
        onKeyDown={onKeyDown}
        onPopperKeyDown={onKeyDown}
        {...props}
      />
    </div>
  )
}

DatePicker.propTypes = {
  ariaLabel: PropTypes.string,
}

DatePicker.defaultProps = {
  ariaLabel: null,
}

export const getDateFormatLocale = lang => {
  const locale = {
    fi: 'dd.MM.yyyy',
    en: 'MM/dd/yyyy',
  }
  return locale[lang]
}

export const handleDatePickerChange = (dateStr, setDate) => {
  if (dateStr) {
    const date = prepareDate(dateStr)
    setDate(date)
  } else {
    setDate(null)
  }
}

const prepareDate = dateStr => {
  const date = moment(
    dateStr,
    parseDate(dateStr, {
      preferredOrder: {
        '.': 'DMY',
        '/': 'MDY',
        '-': 'YMD',
      },
    })
  )

  if (date.isValid()) return date.format(DateFormats.ISO8601_DATE_FORMAT)
  return undefined
}

export default DatePicker
