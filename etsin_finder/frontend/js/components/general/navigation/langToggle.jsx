import React, { Component } from 'react'

import Locale from '../../../stores/view/language'
import '../../../../locale/translations'
import { TransparentButton } from '../button'

class LangToggle extends Component {
  state = {
    announce: '',
    lang: Locale.currentLang,
  }

  changeLang = () => {
    Locale.toggleLang()
    setTimeout(() => {
      this.setState({
        lang: Locale.currentLang,
        announce: `Changed language to ${Locale.currentLang}`,
      })
    }, 50)
    setTimeout(() => {
      this.setState({
        announce: '',
      })
    }, 500)
  }

  render() {
    return (
      <div>
        <div className="sr-only" aria-live="assertive">
          {this.state.announce}
        </div>
        <TransparentButton onClick={this.changeLang}>{this.state.lang}</TransparentButton>
      </div>
    )
  }
}

export default LangToggle
