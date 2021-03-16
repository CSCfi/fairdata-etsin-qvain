import 'chai/register-expect'
import axios from 'axios'

import getResponseError from '../../js/components/qvain/utils/responseError'

describe('when calling getResponseError with responseError including response', () => {
  let returnValue
  const ResponseError = {
    response: {
      data: {
        some: 'some',
        data: ['data'],
      },
    },
  }

  beforeEach(() => {
    returnValue = getResponseError(ResponseError)
  })

  test('should parse error to Array', () => {
    const expectedReturn = ['some: some', 'data: data']
    returnValue.should.deep.eql(expectedReturn)
  })
})

describe('when calling getResponseError with responseError including response (no object)', () => {
  let returnValue
  const ResponseError = {
    response: { data: 'response' },
  }

  beforeEach(() => {
    returnValue = getResponseError(ResponseError)
  })

  test('should paste error to Array', () => {
    const expectedReturn = ['response']
    returnValue.should.deep.eql(expectedReturn)
  })
})

describe('when calling getResponseError with responseError without response', () => {
  let returnValue
  const ResponseError = {
    message: 'kaikki meni pieleen',
  }

  beforeEach(() => {
    returnValue = getResponseError(ResponseError)
  })

  test('should paste error to Array', () => {
    const expectedError = [ResponseError.message]
    returnValue.should.eql(expectedError)
  })
})
