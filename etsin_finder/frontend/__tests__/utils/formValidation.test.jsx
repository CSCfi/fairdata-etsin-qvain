import 'chai/register-should'
import * as yup from 'yup'
import '../../js/components/qvain/utils/formValidation'

describe('date string() validation', () => {
  const isValid = str => {
    try {
      yup.string().date().validateSync(str, { strict: true })
    } catch (e) {
      return false
    }
    return true
  }

  it('it accepts valid date ', () => {
    isValid('2020-02-29').should.be.true
  })

  it('it accepts date without leading zeros', () => {
    isValid('2021-1-1').should.be.true
  })

  it('it rejects invalid day', () => {
    isValid('2021-02-29').should.be.false
  })

  it('it rejects invalid month', () => {
    isValid('2021-13-01').should.be.false
  })

  it('it rejects named month', () => {
    isValid('2021-May-01').should.be.false
  })

  it('it rejects wrong format', () => {
    isValid('2020/01/01').should.be.false
  })
})
