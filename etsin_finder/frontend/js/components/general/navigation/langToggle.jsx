import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import '../../../../locale/translations'
import { TransparentButton } from '../button'

class LangToggle extends Component {
  state = {
    announce: '',
  }

  changeLang = () => {
    this.props.Stores.Locale.toggleLang()
    setTimeout(() => {
      this.setState({
        announce: `Changed language to ${this.props.Stores.Locale.currentLang}`,
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
        <TransparentButton onClick={this.changeLang}>
          {this.props.Stores.Locale.currentLang}
        </TransparentButton>
      </div>
    )
  }
}

export default inject('Stores')(observer(LangToggle))
