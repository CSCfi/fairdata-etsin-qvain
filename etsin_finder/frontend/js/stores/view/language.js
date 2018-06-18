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
  }
}

export default new Locale()
