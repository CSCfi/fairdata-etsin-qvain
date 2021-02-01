import Locale from '../../js/stores/view/locale'
import counterpart from 'counterpart'
import moment from 'moment'

describe('Locale store', () => {
  describe('setLang', () => {
    it('sets lang', () => {
      Locale.setLang('en')
      expect(Locale.lang).toBe('en')

      Locale.setLang('fi')
      expect(Locale.lang).toBe('fi')
    })

    it('sets counterpart locale', () => {
      Locale.setLang('en')
      expect(counterpart.getLocale()).toBe('en')

      Locale.setLang('fi')
      expect(counterpart.getLocale()).toBe('fi')
    })

    it('sets moment locale', () => {
      Locale.setLang('en')
      expect(moment.locale()).toBe('en')

      Locale.setLang('fi')
      expect(moment.locale()).toBe('fi')
    })
  })

  describe('getMatchingLang', () => {
    it('returns current language by default', () => {
      const values = [{}]
      Locale.setLang('fi')
      expect(Locale.getMatchingLang(values)).toBe('fi')
      Locale.setLang('en')
      expect(Locale.getMatchingLang(values)).toBe('en')
    })

    it('returns first matching language', () => {
      Locale.setLang('fi')
      const values = [{ en: 'hi' }]
      expect(Locale.getMatchingLang(values)).toBe('en')
      Locale.setLang('en')
      expect(Locale.getMatchingLang(values)).toBe('en')
    })

    it('ignores unsupported languages', () => {
      Locale.setLang('fi')
      const values = [{ tre: 'moro' }, { fi: 'hei', en: 'hi' }]
      expect(Locale.getMatchingLang(values)).toBe('fi')
      Locale.setLang('en')
      expect(Locale.getMatchingLang(values)).toBe('en')
    })
  })

  describe('langTabOrder', () => {
    it('shows current language in first tab', () => {
      Locale.setLang('fi')
      expect(Locale.langTabOrder).toEqual(['fi', 'en'])

      Locale.setLang('en')
      expect(Locale.langTabOrder).toEqual(['en', 'fi'])
    })
  })
})
