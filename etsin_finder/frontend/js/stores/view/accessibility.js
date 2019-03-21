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
import { observable, action } from 'mobx'
import translate from 'counterpart'

class Accessibility {
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
    const pageName = translate(`general.pageTitles.${location}`)
    this.announce(pageName)
    this.setPageTitle(pageName)
    if (resetFocus) {
      this.resetFocus()
    }
  }

  setPageTitle(name) {
    document.title = `${name} - etsin.fairdata.fi`
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

export default new Accessibility()
