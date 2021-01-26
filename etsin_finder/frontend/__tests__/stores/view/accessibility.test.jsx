import EnvClass from '../../../js/stores/domain/env'
import AccessibilityClass from '../../../js/stores/view/accessibility'
import 'chai/register-should'

describe('Accessibility Store', () => {
  let Accessibility

  beforeEach(() => {
    const Env = new EnvClass()
    Accessibility = new AccessibilityClass(Env)
  })

  describe('when calling toggleTabbing', () => {
    let initialValue

    beforeEach(() => {
      initialValue = Accessibility.userIsTabbing
      Accessibility.toggleTabbing()
    })

    it('should be toggled', () => {
      expect(Accessibility.userIsTabbing).toEqual(!initialValue)
    })

    describe('with value', () => {
      const testValue = 'testValue'

      beforeEach(() => {
        Accessibility.toggleTabbing(testValue)
      })

      it('should set userIsTabbing with value', () => {
        Accessibility.userIsTabbing.should.be.string(testValue)
      })
    })
  })

  describe('Navigation text', () => {
    it('should change nav text', () => {
      Accessibility.announce('This is new nav text')
      expect(Accessibility.assertiveAnnouncement).toEqual('This is new nav text')
    })

    it('should change polite nav text', () => {
      Accessibility.announcePolite('This is new nav text')
      expect(Accessibility.politeAnnouncement).toEqual('This is new nav text')
    })
  })

  describe('Tabbing functions', () => {
    it('should add tabbing to store', () => {
      Accessibility.handleTab({ keyCode: 9 })
      expect(Accessibility.userIsTabbing).toEqual(true)
    })

    it('should toggle tabbing on and off', () => {
      Accessibility.handleMouseDownOnce()
      expect(Accessibility.userIsTabbing).toEqual(true)
      Accessibility.handleMouseDownOnce()
      expect(Accessibility.userIsTabbing).toEqual(false)
    })
  })
})
