import Accessibility from '../js/stores/view/accessibility'

describe('Accessibility Store', () => {
  describe('Toggle tabbing', () => {
    it('tabbing store should be toggled', () => {
      const value = Accessibility.userIsTabbing
      Accessibility.toggleTabbing()
      expect(Accessibility.userIsTabbing).toEqual(!value)
    })
  })
  describe('Navigation text', () => {
    it('should change nav text', () => {
      Accessibility.setNavText('This is new nav text')
      expect(Accessibility.navText).toEqual('This is new nav text')
    })
  })
  describe('Tabbing functions', () => {
    it('should add tabbing to store', () => {
      Accessibility.handleTab({ keyCode: 9 })
      expect(Accessibility.userIsTabbing).toEqual(true)
    })
    it('should remove tabbing from store', () => {
      Accessibility.handleMouseDownOnce()
      expect(Accessibility.userIsTabbing).toEqual(false)
    })
  })
})
