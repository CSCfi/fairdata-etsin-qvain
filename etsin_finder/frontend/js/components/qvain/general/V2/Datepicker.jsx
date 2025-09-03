import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactDatePicker from 'react-datepicker'
import moment from 'moment'
import parseDateFormat from 'moment-parseformat'
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

export const DatePicker = ({ onChange, ariaLabel, ...props }) => {
  const onKeyDown = e => {
    // Close calendar on escape and prevent event from being propagated so modal doesn't close
    if (e.key === 'Escape' && open) {
      e.stopPropagation()
      return false
    }
    // Process keyDown normally
    return true
  }

  return (
    <div>
      <StyledCustomDatePicker
        customInput={<input aria-label={ariaLabel} />}
        enableTabLoop={false}
        onKeyDown={onKeyDown}
        onPopperKeyDown={onKeyDown}
        onChange={onChange}
        onChangeRaw={event => {
          if (!onChange) {
            return
          }
          // Parse manually typed date and pass it to onChange()
          const dateStr = event.target.value
          if (dateStr) {
            const date = parseDate(dateStr)
            if (date) {
              onChange(date)
            }
          }
        }}
        {...props}
      />
    </div>
  )
}

DatePicker.propTypes = {
  ariaLabel: PropTypes.string,
  onChange: PropTypes.func
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

export const handleDatePickerChange = (date, setDate) => {
  if (date) {
    const dateStr = moment(date).format(DateFormats.ISO8601_DATE_FORMAT)
    setDate(dateStr)
  } else {
    setDate(null)
  }
}

const parseDate = dateStr => {
  const date = moment(
    dateStr,
    parseDateFormat(dateStr, {
      preferredOrder: {
        '.': 'DMY',
        '/': 'MDY',
        '-': 'YMD',
      },
    })
  )

  if (date.isValid()) return date.toDate()
  return undefined
}

export default DatePicker
