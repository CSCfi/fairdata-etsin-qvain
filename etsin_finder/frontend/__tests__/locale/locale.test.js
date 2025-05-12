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
