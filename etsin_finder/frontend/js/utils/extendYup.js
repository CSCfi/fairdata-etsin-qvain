import parseDateISO from 'date-fns/parseISO'
import parseDate from 'date-fns/parse'
import * as yup from 'yup'

function validateDate({ allowTime } = {}) {
  // eslint-disable-next-line func-names
  return this.test('is a date string', undefined, function (value) {
    const { path, createError } = this
    if (!value) {
      return true
    }

    let parsed = parseDate(value, 'yyyy-MM-dd', new Date())
    if (allowTime) {
      parsed = parseDateISO(value)
    }

    if (parsed && !Number.isNaN(parsed.getTime())) {
      return true
    }

    return createError({ path, message: 'qvain.validationMessages.types.string.date' })
  })
}

// regex for invalidating e.g. hexadecimal strings
const numberRegex = /^[\d.]+$/

function validateStringNumber() {
  // eslint-disable-next-line func-names
  return this.test('is a number string', undefined, function (value) {
    const { path, createError } = this
    if (value == null || value === '') {
      return true
    }
    const parsed = Number(value)
    if (typeof parsed !== 'number' || Number.isNaN(parsed) || !numberRegex.test(value)) {
      return createError({ path, message: 'qvain.validationMessages.types.string.number' })
    }
    return true
  })
}

yup.addMethod(yup.string, 'date', validateDate)
yup.addMethod(yup.string, 'number', validateStringNumber)
