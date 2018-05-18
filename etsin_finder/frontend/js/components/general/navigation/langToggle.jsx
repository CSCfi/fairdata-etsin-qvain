import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'

import Locale from '../../../stores/view/language'
import '../../../../locale/translations'
import { TransparentButton, InvertedButton } from '../button'

class LangToggle extends Component {
  static defaultProps = {
    inverted: false,
  }
  static propTypes = {
    inverted: PropTypes.bool,
  }

  state = {
    announce: '',
  }

  changeLang = () => {
    Locale.toggleLang()
    setTimeout(() => {
      this.setState({
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
        {this.props.inverted ? (
          <InvertedButton onClick={this.changeLang}>{Locale.currentLang}</InvertedButton>
        ) : (
          <TransparentButton onClick={this.changeLang}>{Locale.currentLang}</TransparentButton>
        )}
      </div>
    )
  }
}

export default inject('Stores')(observer(LangToggle))
