import * as yup from 'yup'

describe('date string validation', () => {
  const isValid = str => {
    try {
      yup.string().date().validateSync(str, { strict: true })
    } catch {
      return false
    }
    return true
  }

  it('should accept valid date ', () => {
    isValid('2020-02-29').should.be.true
  })

  it('should accept date without leading zeros', () => {
    isValid('2021-1-1').should.be.true
  })

  it('should reject invalid day', () => {
    isValid('2021-02-29').should.be.false
  })

  it('should reject invalid month', () => {
    isValid('2021-13-01').should.be.false
  })

  it('should reject named month', () => {
    isValid('2021-May-01').should.be.false
  })

  it('should reject wrong format', () => {
    isValid('2020/01/01').should.be.false
  })
})

describe('number string validation', () => {
  const isValid = str => {
    try {
      yup.string().number().validateSync(str, { strict: true })
    } catch {
      return false
    }
    return true
  }

  it('should accept an integer string', () => {
    isValid('1337').should.be.true
  })

  it('should accept 0 string', () => {
    isValid('0').should.be.true
  })

  it('should accept a decimal number string', () => {
    isValid('3.14159').should.be.true
  })

  it('should reject hexadecimal number string', () => {
    isValid('0xFF').should.be.false
  })

  it('should reject text', () => {
    isValid('one').should.be.false
  })

  it('should reject numeric value', () => {
    isValid(7).should.be.false
  })
})
