import EnvClass from '../../js/stores/domain/env'
import LocaleClass from '../../js/stores/view/locale'
import moment from 'moment'
import axios from 'axios'

jest.mock('axios')

const Env = new EnvClass()
const Locale = new LocaleClass(Env)

Env.history.location = { pathname: '/' }

describe('Locale store', () => {
  describe('setLang', () => {
    it('sets lang', () => {
      Locale.setLang('en')
      expect(Locale.lang).toBe('en')

      Locale.setLang('fi')
      expect(Locale.lang).toBe('fi')
    })

    it('sets moment locale', () => {
      Locale.setLang('en')
      expect(moment.locale()).toBe('en')

      Locale.setLang('fi')
      expect(moment.locale()).toBe('fi')
    })
  })

  describe('loadLang', () => {
    it('changes the language to English based on a query param when the initial language is English', () => {
      Locale.setLang('en')
      Env.history.location.search = '?lang=en'
      Locale.loadLang()
      expect(Locale.lang).toBe('en')
    })

    it('changes the language to English based on a query param when the initial language is Finnish', () => {
      Locale.setLang('fi')
      Env.history.location.search = '?lang=en'
      Locale.loadLang()
      expect(Locale.lang).toBe('en')
    })

    it('changes the language to Finnish based on a query param', () => {
      Locale.setLang('en')
      Env.history.location.search = '?lang=fi'
      Locale.loadLang()
      expect(Locale.lang).toBe('fi')
    })

    it("uses documentElement's lang property when the query param value is not valid", () => {
      Locale.setLang('en')
      Env.history.location.search = '?lang=sv'
      Locale.loadLang()
      expect(Locale.lang).toBe('en')
    })

    it("uses documentElement's lang property when the query param key is not valid", () => {
      Locale.setLang('en')
      Env.history.location.search = '?language=fi'
      Locale.loadLang()
      expect(Locale.lang).toBe('en')
    })

    it("uses documentElement's lang property when the query param is not defined", () => {
      Locale.setLang('en')
      delete Env.history.location.search
      Locale.loadLang()
      expect(Locale.lang).toBe('en')
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

  describe('languageTabOrder', () => {
    it('shows current language in first tab', () => {
      Locale.setLang('fi')
      expect(Locale.languageTabOrder).toEqual(['fi', 'en'])

      Locale.setLang('en')
      expect(Locale.languageTabOrder).toEqual(['en', 'fi'])
    })
  })

  describe('datasetTitleLanguageTabOrder', () => {
    it('shows current language in first tab', () => {
      Locale.setLang('fi')
      expect(Locale.datasetTitleLanguageTabOrder).toEqual(['fi', 'en', 'sv'])

      Locale.setLang('en')
      expect(Locale.datasetTitleLanguageTabOrder).toEqual(['en', 'fi', 'sv'])
    })
  })

  describe('toggleLang', () => {
    it('sends language changes to backend', () => {
      Locale.setLang('en')
      Locale.toggleLang({ save: true })
      expect(axios.post).toHaveBeenCalledWith('/api/language', { language: 'fi' })

      Locale.toggleLang({ save: true })
      expect(axios.post).toHaveBeenCalledWith('/api/language', { language: 'en' })
    })
  })
})
