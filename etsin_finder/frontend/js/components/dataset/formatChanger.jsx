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
import { withTheme } from 'styled-components'
import { observer } from 'mobx-react'

import FormatSelect from './formatselect'
import { withStores } from '../../stores/stores'

export class FormatChanger extends Component {
  constructor(props) {
    super(props)

    this.state = {
      formats: [],
      url: '',
    }
  }

  componentDidMount() {
    this.checkFields()
  }

  checkFields = () => {
    const { DatasetQuery } = this.props.Stores
    const data = DatasetQuery.results
    const rd = data.research_dataset
    const prefId = rd.preferred_identifier
    let dataciteExists = false
    let fields = {}

    // Check that doi exists in one of the identifiers
    if (
      (typeof data.preservation_identifier !== 'undefined' &&
        data.preservation_identifier.includes('doi')) ||
      (typeof prefId !== 'undefined' && prefId.includes('doi'))
    ) {
      dataciteExists = true
    }

    if (dataciteExists) {
      fields = [
        { value: 'metax' },
        { value: 'datacite' },
      ]
    } else if (prefId.startsWith('urn:nbn:fi:att:') || prefId.startsWith('urn:nbn:fi:csc')) {
      fields = [
        { value: 'metax' },
        { value: 'fairdata_datacite' },
      ]
    } else {
      fields = [
        { value: 'metax' },
      ]
    }

    this.setState({
      formats: fields,
    })
  }

  changeFormat = format => {
    if (this.state.formats.some(field => field.value === format.value)) {
      this.setState(
        {
          url: `/api/format?cr_id=${this.props.idn}&format=${format.value}`,
        },
        () => {
          this.openFormat(this.state.url)
        }
      )
    } else {
      console.log(`Invalid value selected for dataset format: ${format.value}`)
    }
  }

  openFormat = url => {
    const win = window.open(url, '_blank')
    win.focus()
  }

  render() {
    const { DatasetQuery } = this.props.Stores
    const data = DatasetQuery.results
    return !data.removed ? (
      <FormatSelect
        background={this.props.theme.color.primary}
        newestColor={this.props.theme.color.white}
        color={this.props.theme.color.primary}
        padding="0.5em 1em"
        width="fit-content"
        onChange={this.changeFormat}
        options={this.state.formats}
      />
    ) : null
  }
}

FormatChanger.propTypes = {
  idn: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  Stores: PropTypes.object.isRequired,
}

export default withRouter(withTheme(withStores(observer(FormatChanger))))
