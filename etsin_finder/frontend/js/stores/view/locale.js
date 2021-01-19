/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import { observable, action, computed, makeObservable } from 'mobx'
import counterpart from 'counterpart'
import moment from 'moment'
import elasticquery from './elasticquery'
import Accessibility from './accessibility'
import env from '../domain/env'
import { setCookieValue, getCookieValue } from '../../utils/cookies'

const languages = ['en', 'fi']

const getInitialLanguage = () => languages.find(lang => lang === document.documentElement.lang) || languages[0]

const cookieName = process.env.REACT_APP_COOKIE_PREFIX ? `${process.env.REACT_APP_COOKIE_PREFIX}_fd_language` : 'fd_language'

class Locale {
  constructor() {
    makeObservable(this)
  }

  @observable currentLang = counterpart.getLocale()

  // get current computed (state changes are tracked) language. Convenience function.
  @computed get lang() {
    return this.currentLang
  }

  @observable languages = languages

  @action
  setLang = (lang, save = true) => {
    if (!languages.includes(lang)) {
      return
    }
    counterpart.setLocale(lang)
    this.currentLang = counterpart.getLocale()
    moment.locale(lang)
    document.documentElement.lang = this.currentLang
    if (save) {
      setCookieValue(cookieName, this.currentLang)
    }
  }

  @action
  toggleLang = () => {
    const current = counterpart.getLocale()
    this.setLang(current === 'fi' ? 'en' : 'fi')

    Accessibility.handleNavigation()

    // TODO: this should probably not be here
    // other things to do when language changes
    // removes all filters and queries new results after filters are removed
    // changes url only on /datasets/ page
    const isSearch = env.history.location.pathname === '/datasets/'
    if (isSearch) {
      // update url true
      const filtersChanged = elasticquery.clearFilters(true)
      if (filtersChanged) {
        elasticquery.queryES()
      }
    } else {
      // update url false
      elasticquery.clearFilters(false)
    }
  }

  @action
  loadLang = () => {
    /* get language setting from cookie */
    const storedLang = getCookieValue(cookieName)
    if (storedLang) {
      this.setLang(storedLang, false)
    } else {
      this.setLang(getInitialLanguage(), false)
    }
  }

  getMatchingLang = (values) => {
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

  getValueTranslation = (value, lang) => {
    // Get a translation from a multi-language string object, use supplied language by default
    if (value[lang]) {
      return value[lang]
    }
    for (const l of this.languages) {
      if (value[l]) {
        return value[l]
      }
    }
    for (const translation of Object.values(value)) {
      if (translation) {
        return translation
      }
    }
    return ''
  }

  @computed get langTabOrder() {
    return [this.lang, ...this.languages.filter(l => l !== this.lang)]
  }
}

export default new Locale()
