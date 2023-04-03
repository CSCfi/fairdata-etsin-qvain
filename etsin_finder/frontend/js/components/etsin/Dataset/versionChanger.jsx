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
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import translate from 'counterpart'
import { withTheme } from 'styled-components'
import VersionSelect from './versionselect'

class VersionChanger extends Component {
  constructor(props) {
    super(props)
    const versions = this.versionLabels(props.versionSet)

    this.state = {
      versions,
      selected: versions.filter(single => single.value === props.idn)[0],
    }
  }

  versionLabels = set => set
    .map((single, i) => {
      const old = i > 0
      return {
        label: `${translate('dataset.version.number', { number: set.length - i })} ${old ? translate('dataset.version.old') : ''}`,
        value: single.identifier,
        removed: single.removed,
        old,
      }
    })

  changeVersion = (value) => {
    this.setState(
      {
        selected: value,
      },
      () => {
        this.props.history.push(`/dataset/${value.value}`)
      }
    )
  }

  showButton = set => {
    const filteredSet = set.filter(version => !version.removed)
    let show = true
    if (filteredSet.length < 1) {
      show = false
    } else if (filteredSet.length === 1 && filteredSet[0].value === this.state.selected.value) {
      show = false
    }
    return show
  }

  render() {
    return this.showButton(this.state.versions) ? (
      <VersionSelect
        background={this.props.theme.color.yellow}
        newestColor={this.props.theme.color.success}
        color="white"
        name="versions"
        padding="0.5em 1em"
        width="10em"
        value={this.state.selected}
        onChange={this.changeVersion}
        options={this.state.versions.filter(single => !single.removed)}
        error={this.props.theme.color.error}
      />
    )
      : null
  }
}

VersionChanger.propTypes = {
  versionSet: PropTypes.array.isRequired,
  idn: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

export default withRouter(withTheme(VersionChanger))
