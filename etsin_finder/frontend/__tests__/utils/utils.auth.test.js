import 'chai/register-expect'

import { checkLogin, getUsername } from '../../js/components/qvain/utils/auth'

describe('utils: Auth', () => {
  let returnValue
  describe('given Stores.Env.environment: "non-development"', () => {
    const props = {
      Stores: {
        Env: { environment: 'non-dev' },
        Auth: {
          checkLogin: () => 'checkLogin',
        },
      },
    }

    describe('when calling checkLogin', () => {
      beforeEach(() => {
        returnValue = checkLogin(props)
      })

      test('should return Auth.checkLogin()', () => {
        returnValue.should.eql(props.Stores.Auth.checkLogin())
      })
    })
  })

  describe('given Env.environment: "development"', () => {
    const props = {
      Stores: {
        Env: { environment: 'development' },
      },
    }

    describe('when calling checkLogin', () => {
      beforeEach(() => {
        checkLogin(props)
      })

      test('should return resolved promise', () => {
        returnValue.should.eql(Promise.resolve())
      })
    })
  })
})

describe('when calling getUsername', () => {
  let returnValue
  const testUser = 'abc-user-123'

  describe('given Stores.Env.environment: non-development', () => {
    beforeEach(() => {
      const props = {
        Stores: {
          Env: {
            environment: 'non-dev',
          },
          Auth: {
            user: {
              name: 'name',
            },
          },
        },
      }

      returnValue = getUsername(props)
    })

    test('should return Stores.Auth.user.name', () => {
      returnValue.should.eql('name')
    })
  })

  describe('given environment: development and Stores.Auth.user.commonName: "abc-user-123"', () => {
    beforeEach(() => {
      const props = {
        Stores: {
          Env: {
            environment: 'development',
          },
          Auth: {
            user: {
              commonName: testUser,
            },
          },
        },
      }

      returnValue = getUsername(props)
    })

    test.todo('should return "abc-user-123"', () => {
      returnValue.should.eql(testUser)
    })
  })
})
