import EnvClass from '../../../js/stores/domain/env'
import AccessibilityClass from '../../../js/stores/view/accessibility'

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

  describe('when calling initialLoad', () => {
    beforeEach(() => {
      jest.spyOn(window, 'addEventListener')
      Accessibility.initialLoad()
    })

    it("should call AddEventListener with 'keydown' and handleTab function", () => {
      expect(window.addEventListener).toHaveBeenCalledWith('keydown', Accessibility.handleTab)
    })
  })

  describe('when calling handleTab with event of keyCode 9', () => {
    beforeEach(() => {
      jest.spyOn(document.body.classList, 'add')
      jest.spyOn(window, 'removeEventListener')
      jest.spyOn(window, 'addEventListener')
      const event = { keyCode: 9 }
      Accessibility.handleTab(event)
    })

    it("should add 'user-is-tabbing' to document.body's classList", () => {
      expect(document.body.classList.add).toHaveBeenCalledWith('user-is-tabbing')
    })

    it('should set userIsTabbing to true', () => {
      Accessibility.userIsTabbing.should.be.true
    })

    it("should remove 'keydown' event listener", () => {
      expect(window.removeEventListener).toHaveBeenCalledWith('keydown', Accessibility.handleTab)
    })

    it("should add 'mousedown' event listener", () => {
      expect(window.addEventListener).toHaveBeenCalledWith(
        'mousedown',
        Accessibility.handleMouseDownOnce
      )
    })
  })
})
