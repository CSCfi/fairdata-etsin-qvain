import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Locale from '../../../stores/view/language'
import '../../../../locale/translations'
import { TransparentButton, InvertedButton } from '../button'

class LangToggle extends Component {
  static defaultProps = {
    inverted: false,
    margin: '0.3em 0.3em',
  }
  static propTypes = {
    inverted: PropTypes.bool,
    margin: PropTypes.string,
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

  otherLang = () =>
    Locale.languages.map(lang => {
      if (lang !== Locale.currentLang) {
        return <Lang key={lang}>{lang}</Lang>
      }
      return null
    })

  render() {
    return (
      <div>
        <div className="sr-only" aria-live="assertive">
          {this.state.announce}
        </div>
        {this.props.inverted ? (
          <InvertedButton
            color="dark"
            margin={this.props.margin}
            padding="0.3em 1em 0.4em"
            onClick={this.changeLang}
          >
            {this.otherLang()}
          </InvertedButton>
        ) : (
          <TransparentButton onClick={this.changeLang}>{this.otherLang()}</TransparentButton>
        )}
      </div>
    )
  }
}

const Lang = styled.span`
  border-left: 1px solid ${p => p.theme.color.dark};
  &:first-of-type {
    border-left: none;
  }
`

export default inject('Stores')(observer(LangToggle))
