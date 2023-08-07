/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import axios from 'axios'
import { observable, action, computed, makeObservable } from 'mobx'
import counterpart from 'counterpart'
import moment from 'moment'

import urls from '../../utils/urls'

const languages = ['en', 'fi']

const datasetTitleLanguages = ['en', 'fi', 'sv']

const getInitialLanguage = () =>
  languages.find(lang => lang === document.documentElement.lang) || languages[0]

class Locale {
  constructor(Accessibility, ElasticQuery) {
    this.Accessibility = Accessibility
    this.Env = Accessibility.Env
    this.ElasticQuery = ElasticQuery
    makeObservable(this)

    if (BUILD !== 'production') {
      window.setLang = lang => this.setLang(lang, { save: true })
      window.toggleLang = () =>
        this.setLang(
          languages.find(l => l !== this.lang),
          { save: true }
        )
    }
  }

  @observable currentLang = counterpart.getLocale()

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
    counterpart.setLocale(lang)
    this.currentLang = counterpart.getLocale()
    moment.locale(lang)
    document.documentElement.lang = this.currentLang
    if (save) {
      this.saveLanguage() // store language setting
    }
  }

  @action
  toggleLang = (options = {}) => {
    const { save } = options
    const current = counterpart.getLocale()
    this.setLang(current === 'fi' ? 'en' : 'fi', { save })

    this.Accessibility.handleNavigation()

    // TODO: this should probably not be here
    // other things to do when language changes
    // removes all filters and queries new results after filters are removed
    // changes url only on /datasets/ page
    const isSearch = this.Env?.history?.location?.pathname?.startsWith('/datasets/')
    if (isSearch) {
      // update url true
      const filtersChanged = this.ElasticQuery.clearFilters(true)
      if (filtersChanged) {
        this.ElasticQuery.queryES()
      }
    } else {
      // update url false
      this.ElasticQuery.clearFilters(false)
    }
  }

  @action
  loadLang = () => {
    // get initial language from document head
    this.setLang(getInitialLanguage(), false)
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
    // Get organization name based on which translations exist, with the following priority:
    // - current language
    // - languages in the order of Locale.languages
    // - first language in the name object
    // - if no translations exist, create new translation in the current language
    if (!item || !item.name) {
      return this.lang
    }

    if (item.name[this.lang] != null) {
      return this.lang
    }

    for (const lang of languages) {
      if (item.name[lang] != null) {
        return lang
      }
    }

    if (Object.keys(item.name).length > 0) {
      return Object.keys(item.name)[0]
    }

    return this.lang
  }
}

export default Locale
