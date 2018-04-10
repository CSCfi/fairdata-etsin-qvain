import React, { Component } from 'react'
import counterpart from 'counterpart'

import Locale from 'Stores/view/language'
import '../../../../locale/translations'
import { TransparentButton } from '../button'

export default class LangToggle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      language: counterpart.getLocale(),
    }
    this.changeLang = this.changeLang.bind(this)
  }
  changeLang() {
    Locale.toggleLang()
    this.setState({
      language: Locale.currentLang,
    })
  }

  render() {
    return (
      <TransparentButton onClick={this.changeLang}>
        {this.state.language === 'fi' ? 'en' : 'fi'}
      </TransparentButton>
    )
  }
}
