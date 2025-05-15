import { parseISO as parseDateISO, parse as parseDate } from 'date-fns'
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

function validateHasTranslation(message) {
  if (!message) {
    throw new Error('validateHasTranslation requires an error message')
  }
  // eslint-disable-next-line func-names
  return this.test('has translation', undefined, function (value) {
    // if object exists, require it to have at least one translation property
    if (!value) {
      return true
    }
    if (value.en || value.fi) {
      return true
    }
    const { path, createError } = this
    return createError({ path, message })
  })
}

yup.addMethod(yup.string, 'date', validateDate)
yup.addMethod(yup.string, 'number', validateStringNumber)
yup.addMethod(yup.object, 'requireTranslation', validateHasTranslation)
