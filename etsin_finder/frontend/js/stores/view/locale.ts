import axios from 'axios'
import { get } from 'lodash-es'
import { observable, action, computed } from 'mobx'
import moment from 'moment'
import finnish from '@/../locale/finnish'
import english from '@/../locale/english'
import interpolate from '@/utils/interpolate'

import urls from '../../utils/urls'
import queryParam from '@/utils/queryParam'
import type Env from '@/stores/domain/env'
import type { MultiLanguageString } from '@/types/common'

// Used for limiting depth to avoid typescript error about possibly infinite recursion
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// Plural translation value
type Plural = {
  one: string
  other: string
}

// Convert nested translation object type to dotted paths
type StringKey<T, Depth extends number = 10> = [Depth] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T & string]: T[K] extends string | Plural
          ? K
          : `${K}.${StringKey<T[K], Prev[Depth]>}`
      }[keyof T & string]
    : never

// Convert nested translation object type to array of keys
type ArrayKey<T, Depth extends number = 10> = [Depth] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T & string]: T[K] extends string | Plural
          ? [K]
          : [K, ...ArrayKey<T[K], Prev[Depth]>]
      }[keyof T & string]
    : never

export type StringTranslationKey = StringKey<typeof english>
export type ArrayTranslationKey = ArrayKey<typeof english>
export type TranslationKey = StringTranslationKey | ArrayTranslationKey

const locales = observable({
  en: english,
  fi: finnish,
})
const fallbackLocale = 'en'

const languages = ['en', 'fi'] as const

export type UILanguage = (typeof languages)[number] // "en" or "fi"

const datasetTitleLanguages = ['en', 'fi', 'sv']

if (import.meta.hot && import.meta.env.MODE === 'development') {
  // Accept HMR updates from translations without reloading the Locale module itself.
  import.meta.hot.accept(
    '@/../locale/english',
    action((newModule: any) => {
      locales.en = newModule.default
    })
  )
  import.meta.hot.accept(
    '@/../locale/finnish',
    action((newModule: any) => {
      locales.fi = newModule.default
    })
  )
}

const getInitialLanguage = () =>
  languages.find(lang => lang === document.documentElement.lang) || languages[0]

const getDateFormats = (shortMonth: boolean) => ({
  datetime: {
    fi: {
      lang: 'fi-FI',
      options: {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      } satisfies Intl.DateTimeFormatOptions,
    },
    en: {
      lang: 'en-US',
      options: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      } satisfies Intl.DateTimeFormatOptions,
    },
  },
  date: {
    fi: {
      lang: 'fi-FI',
      options: {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      } satisfies Intl.DateTimeFormatOptions,
    },
    en: {
      lang: 'en-US',
      options: {
        year: 'numeric',
        month: shortMonth ? 'short' : 'long',
        day: 'numeric',
      } satisfies Intl.DateTimeFormatOptions,
    },
  },
})

const getDefaultDateFormat = (date: Date | string) => {
  if (typeof date === 'string') {
    if (date.length === 4) {
      return 'year'
    }
    if (date.length <= 10) {
      return 'date'
    }
  }
  return 'datetime'
}

declare global {
  function setLang(lang: UILanguage): void
  function toggleLang(): void
}

// eslint-disable-next-line no-unused-vars
const defaultMissingTranslationHandler = (
  key: TranslationKey,
  { locale: lang }: { locale?: string; context?: any[] } = {}
) => `missing translation: ${lang}.${key}`

class Locale {
  Env: Env
  handleMissingTranslation!: typeof defaultMissingTranslationHandler

  constructor(Env: Env) {
    this.Env = Env
    this.dateFormat = this.dateFormat.bind(this)
    this.dateSeparator = this.dateSeparator.bind(this)
    this.translate = this.translate.bind(this)

    if (import.meta.env.MODE !== 'production') {
      globalThis.setLang = lang => this.setLang(lang, { save: true })
      globalThis.toggleLang = () =>
        this.setLang(languages.find(l => l !== this.lang) || 'en', { save: true })
    }

    this.setMissingTranslationHandler()
  }

  setMissingTranslationHandler(handler?: typeof defaultMissingTranslationHandler) {
    // Set function that handles missing translations
    if (handler) {
      this.handleMissingTranslation = handler
    } else {
      this.handleMissingTranslation = defaultMissingTranslationHandler
    }
  }

  @observable accessor currentLang: UILanguage = 'en' // FIXME: read from session?

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

  @observable accessor languages = languages

  @observable accessor datasetTitleLanguages = datasetTitleLanguages

  @action.bound saveLanguage() {
    return axios.post(urls.language(), { language: this.currentLang })
  }

  @action
  setLang = (lang: UILanguage, options: { save?: boolean } = {}) => {
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

  @action.bound
  toggleLang(options: { save?: boolean } = {}) {
    const { save } = options
    const current = this.currentLang
    this.setLang(current === 'fi' ? 'en' : 'fi', { save })
  }

  @action.bound
  loadLang() {
    const langParamValue: string | null = queryParam(this.Env.history.location, 'lang')
    const isUILang = this.languages.includes(langParamValue as UILanguage)

    if (isUILang) {
      // set and save the language specified by the lang query param:
      this.setLang(langParamValue as UILanguage, { save: true })
    } else {
      // get initial language from document head
      this.setLang(getInitialLanguage())
    }
  }

  getMatchingLang = (values: MultiLanguageString[]) => {
    const defaultLang = this.lang
    for (const value of values.filter(Boolean)) {
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

  getValueTranslationWithLang = (
    value: any,
    lang = this.lang
  ): [string | object, string | undefined] => {
    // Get a translation from a multi-language string object, use supplied language by default
    if (typeof value === 'string' || value === undefined) {
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

  getValueTranslation = (value?: any, lang = this.lang) =>
    this.getValueTranslationWithLang(value, lang)[0]

  @computed get languageTabOrder() {
    return [this.lang, ...this.languages.filter(l => l !== this.lang)]
  }

  @computed get datasetTitleLanguageTabOrder() {
    return [this.lang, ...this.datasetTitleLanguages.filter(l => l !== this.lang)]
  }

  getPreferredLang = (item?: any) => {
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

  dateFormat(
    date: any,
    { shortMonth = false, format }: { shortMonth?: boolean; format?: string } = {}
  ) {
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

  dateSeparator(start?: any, end?: any) {
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

  translate(
    key: TranslationKey,
    { locale: lang, ...context }: { locale?: UILanguage } & Record<string, any> = {}
  ) {
    // Return translation value in current language.
    //
    // Translation key should be a dot-separated path 'key.subkey' or an array ['key', 'subkey'].
    //
    // Optionally provided context will be used in string interpolation
    // to replace e.g. %(value)s in the translated string with context.value.
    let translation = get(locales[lang || this.currentLang], key)
    translation ??= get(locales[fallbackLocale], key)
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
