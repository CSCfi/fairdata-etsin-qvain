/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import { observable, action, computed } from 'mobx'
import counterpart from 'counterpart'
import moment from 'moment'
import elasticquery from './elasticquery'
import env from '../domain/env'
import { setCookieValue, getCookieValue } from '../../utils/cookies'

const languages = ['en', 'fi']

const getInitialLanguage = () => languages.find(lang => lang === document.documentElement.lang) || languages[0]

class Locale {
  @observable currentLang = counterpart.getLocale()

  // get current computed (state changes are tracked) language. Convenience function.
  @computed get lang() {
    return this.currentLang
  }

  @observable languages = languages

  @action
  setLang = (lang, save = true) => {
    counterpart.setLocale(lang)
    this.currentLang = counterpart.getLocale()
    moment.locale(lang)
    document.documentElement.lang = this.currentLang
    if (save) {
      setCookieValue('lang', this.currentLang)
    }
  }

  @action
  toggleLang = () => {
    const current = counterpart.getLocale()
    this.setLang(current === 'fi' ? 'en' : 'fi')

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
    const storedLang = getCookieValue('lang')
    if (storedLang) {
      this.setLang(storedLang, false)
    } else {
      this.setLang(getInitialLanguage(), false)
    }
  }
}

export default new Locale()
