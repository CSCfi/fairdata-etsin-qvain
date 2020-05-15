import styled from 'styled-components'
import ReactDatePicker from 'react-datepicker'
import moment from 'moment'
import parseDate from 'moment-parseformat'
import DateFormats from '../utils/date'

export const DatePicker = styled(ReactDatePicker)`
    display: inline-block;
    border-radius: 3px;
    border: 1px solid rgb(204,204,204);
    padding: 8px;
    font-size: 16px;
    box-sizing: border-box;
    margin-bottom: 20px;
    min-width: 100%;
    max-width: 100%;
`

export const getDateFormatLocale = (lang) => {
    const locale = {
        fi: 'dd.MM.yyyy',
        en: 'MM/dd/yyyy'
    }
    return locale[lang]
}

export const handleDatePickerChange = (dateStr, setDate) => {
    const date = prepareDate(dateStr)
    setDate(date)
}

const prepareDate = (dateStr) => {
    const date = moment(
        dateStr,
        parseDate(dateStr, {
            preferredOrder: {
                '.': 'DMY',
                '/': 'MDY',
                '-': 'YMD'
            }
        })
    )

    if (date.isValid()) return date.format(DateFormats.ISO8601_DATE_FORMAT)
    return undefined
}
