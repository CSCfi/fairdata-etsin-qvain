import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactDatePicker from 'react-datepicker'
import moment from 'moment'
import parseDate from 'moment-parseformat'
import DateFormats from '@/components/qvain/utils/date'

// Modified DatePicker that allows overriding some functions by passing them in props.
// Return true from the overriding function to also call the original function.
class CustomDatePicker extends ReactDatePicker {
  constructor(props) {
    super(props)

    const originalSetOpen = this.setOpen
    this.setOpen = (open, skipSetBlur = false) => {
      if (this.props.setOpen) {
        if (!this.props.setOpen(open)) {
          return
        }
      }
      originalSetOpen(open, skipSetBlur)
    }

    const originalHandleCalendarClickOutside = this.handleCalendarClickOutside
    this.handleCalendarClickOutside = event => {
      if (this.props.handleCalendarClickOutside) {
        if (!this.props.handleCalendarClickOutside(event)) {
          return
        }
      }
      originalHandleCalendarClickOutside(event)
    }

    const originalOnPopperKeyDown = this.onPopperKeyDown
    this.onPopperKeyDown = event => {
      if (this.props.onPopperKeyDown) {
        if (!this.props.onPopperKeyDown(event)) {
          return
        }
      }
      originalOnPopperKeyDown(event)
    }
  }
}

export const StyledCustomDatePicker = styled(CustomDatePicker)`
  display: inline-block;
  border-radius: 3px;
  border: 1px solid rgb(204, 204, 204);
  padding: 8px;
  font-size: 16px;
  box-sizing: border-box;
  margin-bottom: 0;
  min-width: 100%;
  max-width: 100%;
`

// Keyboard usability fixes for DatePicker:
// - Fix enableTabLoop not closing the calendar when user leaves it using tab
// - Allow closing calendar with escape without propagating the keypress (i.e. don't close surrounding modal)
export const DatePicker = props => {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)

  const onFocus = () => {
    // Open calendar when input is focused
    setOpen(true)
  }

  const onBlur = e => {
    // If focus has left wrapper, close calendar
    if (!ref.current.contains(e.relatedTarget)) {
      setOpen(false)
    }
  }

  const onKeyDown = e => {
    // Close calendar on escape and prevent event from being propagated so modal doesn't close
    if (e.key === 'Escape' && open) {
      setOpen(false)
      e.stopPropagation()
      return false
    }
    // Process keyDown normally
    return true
  }

  // Replace default handler for clicking outside calendar, onBlur will handle closing the calendar instead
  const onCalendarClickOutside = () => false

  // Pass ariaLabel prop to the input element
  const ariaLabel = props.ariaLabel

  return (
    <div ref={ref} onFocus={onFocus} onBlur={onBlur}>
      <StyledCustomDatePicker
        open={open}
        customInput={<input aria-label={ariaLabel} />}
        setOpen={setOpen}
        enableTabLoop={false}
        onKeyDown={onKeyDown}
        onPopperKeyDown={onKeyDown}
        handleCalendarClickOutside={onCalendarClickOutside}
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
  const date = prepareDate(dateStr)
  setDate(date)
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
