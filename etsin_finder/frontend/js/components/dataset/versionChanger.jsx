import React, { Component } from 'react'
import styled from 'styled-components'

import Select from '../general/select'

const VersionSelect = styled(Select)`
  width: 8em;
  margin-right: 1em;
  margin-bottom: 0;
`

export default class VersionChanger extends Component {
  state = {}

  changeVersion = () => {
    alert('change version')
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
        value={{ label: 'Version 1', value: 1 }}
        onChange={this.changeVersion}
        onBlur={this.closeModal}
        options={[{ label: 'Version 1', value: 1 }, { label: 'Version 2', value: 2 }]}
      />
    )
  }
}
