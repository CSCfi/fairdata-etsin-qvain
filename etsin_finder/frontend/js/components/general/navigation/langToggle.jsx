{
/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */
}

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import translate from 'counterpart'

import '../../../../locale/translations'
import { TransparentButton, InvertedButton } from '../button'

class LangToggle extends Component {
  static propTypes = {
    inverted: PropTypes.bool,
    margin: PropTypes.string,
    Stores: PropTypes.object.isRequired,
  }

  static defaultProps = {
    inverted: false,
    margin: '0.3em 0.3em',
  }

  state = {
    announce: '',
  }

  changeLang = () => {
    this.props.Stores.Locale.toggleLang()
    setTimeout(() => {
      this.setState({
        announce: translate('general.state.changedLang', {
          lang: this.props.Stores.Locale.currentLang,
        }),
      })
    }, 50)
    setTimeout(() => {
      this.setState({
        announce: '',
      })
    }, 500)
  }

  otherLang = () =>
    this.props.Stores.Locale.languages.map(lang => {
      if (lang !== this.props.Stores.Locale.currentLang) {
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
          <TransparentButton onClick={this.changeLang} margin={this.props.margin}>
            {this.otherLang()}
          </TransparentButton>
        )}
      </div>
    )
  }
}

const Lang = styled.span`
  border-left: 1px solid ${p => p.theme.color.dark};
  text-transform: uppercase;
  &:first-of-type {
    border-left: none;
  }
`

export default inject('Stores')(observer(LangToggle))
