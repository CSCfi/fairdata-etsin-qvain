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
        returnValue.should.eql('checkLogin')
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
      beforeEach(async () => {
        returnValue = await checkLogin(props)
      })

      test('should return resolved promise', () => {
        expect(returnValue).to.be.undefined
      })
    })
  })
})

describe('when calling getUsername', () => {
  let returnValue

  describe('given user name', () => {
    beforeEach(() => {
      const props = {
        Stores: {
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
})
