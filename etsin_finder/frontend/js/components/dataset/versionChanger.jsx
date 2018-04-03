import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import translate from 'counterpart'

import Select from '../general/select'

const VersionSelect = styled(Select)`
  width: 8em;
  margin-right: 1em;
  margin-bottom: 0;
`

class VersionChanger extends Component {
  constructor(props) {
    super(props)

    const versions = this.versionLabels(props.versionSet)

    this.state = {
      versions,
      selected: versions.filter(single => single.value === props.pid)[0],
    }
  }

  componentWillReceiveProps = () => {
    const versions = this.versionLabels(this.props.versionSet)
    this.setState({
      versions,
      selected: versions.filter(single => single.value === this.props.pid)[0],
    })
  }

  versionLabels = set =>
    set.map((single, i) => ({
      label: `${translate('dataset.version', { number: set.length - i })}`,
      value: single.preferred_identifier,
    }))

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
        bordercolor="#FFBD39"
        background="#FFBD39"
        selectedColor="white"
        textcolor="white"
        name="versions"
        clearable={false}
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
  pid: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(VersionChanger)
