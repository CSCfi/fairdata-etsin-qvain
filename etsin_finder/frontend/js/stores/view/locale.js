import axios from 'axios'
import { get } from 'lodash'
import { observable, action, computed, makeObservable } from 'mobx'
import moment from 'moment'
import finnish from '@/../locale/finnish'
import english from '@/../locale/english'
import interpolate from '@/utils/interpolate'

import urls from '../../utils/urls'
import queryParam from '@/utils/queryParam'

const locales = {
  en: english,
  fi: finnish,
}
const fallbackLocale = 'en'

const languages = ['en', 'fi']

const datasetTitleLanguages = ['en', 'fi', 'sv']

const getInitialLanguage = () =>
  languages.find(lang => lang === document.documentElement.lang) || languages[0]

const getDateFormats = shortMonth => ({
  datetime: {
    fi: {
      lang: 'fi-FI',
      options: {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        seconds: '2-digit',
      },
    },
    en: {
      lang: 'en-US',
      options: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        seconds: '2-digit',
      },
    },
  },
  date: {
    fi: {
      lang: 'fi-FI',
      options: {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      },
    },
    en: {
      lang: 'en-US',
      options: {
        year: 'numeric',
        month: shortMonth ? 'short' : 'long',
        day: 'numeric',
      },
    },
  },
})

const getDefaultDateFormat = date => {
  if (typeof date === 'string' || date instanceof String) {
    if (date.length === 4) {
      return 'year'
    }
    if (date.length <= 10) {
      return 'date'
    }
  }
  return 'datetime'
}

// eslint-disable-next-line no-unused-vars
const defaultMissingTranslationHandler = (key, { locale: lang, ...context }) =>
  `missing translation: ${lang}.${key}`

class Locale {
  constructor(Env) {
    this.Env = Env
    makeObservable(this)
    this.dateFormat = this.dateFormat.bind(this)
    this.dateSeparator = this.dateSeparator.bind(this)
    this.translate = this.translate.bind(this)

    if (BUILD !== 'production') {
      window.setLang = lang => this.setLang(lang, { save: true })
      window.toggleLang = () =>
        this.setLang(
          languages.find(l => l !== this.lang),
          { save: true }
        )
    }
    this.setMissingTranslationHandler()
  }

  setMissingTranslationHandler(handler) {
    // Set function that handles missing translations
    if (handler) {
      this.handleMissingTranslation = handler
    } else {
      this.handleMissingTranslation = defaultMissingTranslationHandler
    }
  }

  @observable currentLang = 'en' // FIXME: read from session? or something?

  // get current computed (state changes are tracked) language. Convenience function.
  @computed get lang() {
    return this.currentLang
  }

  @computed get cookieDomain() {
    return this.Env.ssoCookieDomain
  }

  @computed get cookieName() {
    const prefix = this.Env.ssoPrefix
    if (prefix) {
      return `${prefix}_fd_language`
    }
    return 'fd_language'
  }

  @observable languages = languages

  @observable datasetTitleLanguages = datasetTitleLanguages

  @action.bound saveLanguage() {
    return axios.post(urls.language(), { language: this.currentLang })
  }

  @action
  setLang = (lang, options = {}) => {
    const { save } = options
    if (!languages.includes(lang)) {
      return
    }
    this.currentLang = lang
    moment.locale(lang)
    document.documentElement.lang = this.currentLang
    if (save) {
      this.saveLanguage() // store language setting
    }
  }

  @action
  toggleLang = (options = {}) => {
    const { save } = options
    const current = this.currentLang
    this.setLang(current === 'fi' ? 'en' : 'fi', { save })
  }

  @action
  loadLang = () => {
    const langParamValue = queryParam(this.Env.history.location, 'lang')
    const isUILang = this.languages.includes(langParamValue)

    if (isUILang) {
      // set and save the language specified by the lang query param:
      this.setLang(langParamValue, { save: true })
    } else {
      // get initial language from document head
      this.setLang(getInitialLanguage(), false)
    }
  }

  getMatchingLang = values => {
    const defaultLang = this.lang
    for (const value of values.filter(v => v)) {
      if (value[defaultLang]) {
        return defaultLang
      }
      for (const lang of this.languages) {
        if (value[lang]) {
          return lang
        }
      }
    }
    return defaultLang
  }

  getValueTranslationWithLang = (value, lang = this.lang) => {
    // Get a translation from a multi-language string object, use supplied language by default
    if (typeof value === 'string' || typeof value === 'undefined') {
      return [value, undefined]
    }
    if (value[lang]) {
      return [value[lang], lang]
    }
    for (const l of this.languages) {
      if (value[l]) {
        return [value[l], l]
      }
    }
    for (const [l, translation] of Object.entries(value)) {
      if (translation && l !== 'und') {
        return [translation, l]
      }
    }
    return [value.und || '', undefined]
  }

  getValueTranslation = (value, lang = this.lang) =>
    this.getValueTranslationWithLang(value, lang)[0]

  @computed get languageTabOrder() {
    return [this.lang, ...this.languages.filter(l => l !== this.lang)]
  }

  @computed get datasetTitleLanguageTabOrder() {
    return [this.lang, ...this.datasetTitleLanguages.filter(l => l !== this.lang)]
  }

  getPreferredLang = item => {
    // Get preferred language for a translation object based on which translations exist, with the following priority:
    // - current language
    // - languages in the order of Locale.languages
    // - first language in the name object
    // - if no translations were found return undefined

    if (!item) {
      return undefined
    }

    if (typeof item !== 'object') {
      return undefined
    }

    if (item[this.lang] != null) {
      return this.lang
    }

    for (const lang of languages) {
      if (item[lang] != null) {
        return lang
      }
    }

    if (Object.keys(item).length > 0) {
      return Object.keys(item)[0]
    }

    return undefined
  }

  dateFormat(date, { shortMonth = false, format } = {}) {
    const formats = getDateFormats(shortMonth)
    if (!date) {
      return ''
    }
    const outputFormat = format || getDefaultDateFormat(date)
    if (outputFormat === 'year') {
      return new Date(date).getFullYear().toString()
    }
    if (outputFormat === 'date') {
      return new Date(date).toLocaleDateString(
        formats.date[this.currentLang].lang,
        formats.date[this.currentLang].options
      )
    }
    return new Date(date).toLocaleString(
      formats.datetime[this.currentLang].lang,
      formats.datetime[this.currentLang].options
    )
  }

  dateSeparator(start, end) {
    if (start || end) {
      if (start === end) {
        return this.dateFormat(start, { format: 'date' })
      }
      return `${this.dateFormat(start, { format: 'date' })} – ${this.dateFormat(end, {
        format: 'date',
      })}`
    }
    return null
  }

  translate(key, { locale: lang, ...context } = {}) {
    // Return translation value in current language.
    //
    // Translation key should be a dot-separated path 'key.subkey' or an array ['key', 'subkey'].
    //
    // Optionally provided context will be used in string interpolation
    // to replace e.g. %(value)s in the translated string with context.value.
    let translation = get(locales[lang || this.currentLang], key)
    if (translation == null) {
      translation = get(locales[fallbackLocale], key)
    }
    if (translation && context) {
      translation = interpolate(translation, context)

      // Pluralization. When context has a "count" value,
      // try to return translation.one or translation.other depending on count.
      // As a fallback, return the translated object itself.
      if (typeof translation === 'object' && context.count != null) {
        if (context.count === 1) {
          return translation.one || translation
        }
        return translation.other || translation
      }
    }
    if (translation == null) {
      return this.handleMissingTranslation(key, { locale: lang || this.currentLang, ...context })
    }
    return translation
  }
}

export default Locale
