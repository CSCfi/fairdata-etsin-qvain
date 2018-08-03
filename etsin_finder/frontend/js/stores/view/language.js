/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import { observable, action } from 'mobx'
import counterpart from 'counterpart'
import elasticquery from './elasticquery'
import env from '../domain/env'

class Locale {
  @observable currentLang = counterpart.getLocale()
  @observable languages = ['en', 'fi']
  @action
  setLang = lang => {
    counterpart.setLocale(lang)
    this.currentLang = counterpart.getLocale()
    localStorage.setItem('lang', this.currentLang)
  }
  @action
  toggleLang = () => {
    const current = counterpart.getLocale()
    counterpart.setLocale(current === 'fi' ? 'en' : 'fi')
    this.currentLang = counterpart.getLocale()
    localStorage.setItem('lang', this.currentLang)

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
}

export default new Locale()
