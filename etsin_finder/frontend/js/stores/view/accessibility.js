/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import React from 'react'
import { observable, action, makeObservable } from 'mobx'
import translate from 'counterpart'

class Accessibility {
  constructor(Env) {
    this.Env = Env
    makeObservable(this)
    this.announce = this.announce.bind(this)
  }

  @observable assertiveAnnouncement = ''

  @observable politeAnnouncement = ''

  @observable userIsTabbing = false

  focusableElement = React.createRef()

  @action
  toggleTabbing(value) {
    if (value) {
      this.userIsTabbing = value
    } else {
      this.userIsTabbing = !this.userIsTabbing
    }
  }

  @action
  announce(text) {
    this.assertiveAnnouncement = text
    setTimeout(() => {
      this.clearAnnounce('assertive')
    }, 1000)
  }

  @action
  announcePolite(text) {
    this.politeAnnouncement = text
    setTimeout(() => {
      this.clearAnnounce('polite')
    }, 3000)
  }

  @action
  clearAnnounce(type) {
    switch (type) {
      case 'assertive':
        this.assertiveAnnouncement = ''
        break
      case 'polite':
        this.politeAnnouncement = ''
        break
      default:
        break
    }
  }

  // don't show outline when user is not using tab to navigate
  @action
  handleTab = e => {
    if (e.keyCode === 9) {
      document.body.classList.add('user-is-tabbing')
      this.toggleTabbing(true)

      window.removeEventListener('keydown', this.handleTab)
      /* eslint-disable-next-line no-use-before-define */
      window.addEventListener('mousedown', this.handleMouseDownOnce)
    }
  }

  @action
  handleNavigation(location, resetFocus = true) {
    if (this.Env.isQvain) {
      this.setQvainPageTitle(translate('general.qvainPageTitle'))
      return
    }

    let loc = location
    loc = this.getLocation()

    const pageName = translate(`general.etsinPageTitles.${loc}`)
    this.announce(pageName)
    this.setEtsinPageTitle(pageName)
    if (resetFocus) {
      this.resetFocus()
    }
  }

  getLocation() {
    const etsinLocationMatchers = [
      ['datasets', new RegExp('^/datasets/?')],
      ['dataset', new RegExp('^/dataset/[^/]+?$')],
      ['data', new RegExp('^/dataset/[^/]+/data/?$')],
      ['events', new RegExp('^/dataset/[^/]+/events/?$')],
      ['maps', new RegExp('^/dataset/[^/]+/maps/?$')],
      ['qvain', new RegExp('^/qvain/?')],
      ['home', new RegExp('^/$')],
    ]

    let location
    const pathname = this.Env.history.location.pathname
    for (const [matchLocation, matcher] of etsinLocationMatchers) {
      if (matcher.test(pathname)) {
        location = matchLocation
        break
      }
    }
    return location || 'error'
  }

  setEtsinPageTitle(name) {
    document.title = `${name} - etsin.fairdata.fi`
  }

  setQvainPageTitle(name) {
    document.title = name
  }

  resetFocus() {
    this.focusableElement.current.focus()
  }

  @action
  handleMouseDownOnce = () => {
    document.body.classList.remove('user-is-tabbing')
    this.toggleTabbing(false)
    window.removeEventListener('mousedown', this.handleMouseDownOnce)
    window.addEventListener('keydown', this.handleTab)
  }

  @action
  initialLoad = () => {
    window.addEventListener('keydown', this.handleTab)
  }
}

export default Accessibility
