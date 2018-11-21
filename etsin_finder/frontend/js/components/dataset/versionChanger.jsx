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

import Accessibility from '../../stores/view/accessibility'
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

  componentWillReceiveProps = () => {
    const versions = this.versionLabels(this.props.versionSet)
    this.setState({
      versions,
      selected: versions.filter(single => single.value === this.props.idn)[0],
    })
  }

  versionLabels = set =>
    set.map((single, i) => {
      const old = i > 0 ? translate('dataset.version.old') : ''
      return {
        label: `${translate('dataset.version.number', { number: set.length - i })} ${old}`,
        value: single.identifier,
        removed: single.removed,
      }
    })

  changeVersion = (name, value) => {
    this.setState(
      {
        selected: value,
      },
      () => {
        this.props.history.push(`/dataset/${value.value}`)
      }
    )
  }

  closeModal = () => {
    console.log('close modal')
  }

  render() {
    return (
      <VersionSelect
        background={this.props.theme.color.yellow}
        newestColor={this.props.theme.color.success}
        color="white"
        name="versions"
        padding="0.5em 1em"
        width="10em"
        value={this.state.selected}
        onChange={this.changeVersion}
        onBlur={this.closeModal}
        options={this.state.versions}
      />
    )
  }
}

VersionChanger.propTypes = {
  versionSet: PropTypes.array.isRequired,
  idn: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

export default withRouter(withTheme(VersionChanger))
