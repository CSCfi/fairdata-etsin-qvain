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
import DatasetQuery from '../../stores/view/datasetquery'
import FormatSelect from './formatselect'

class FormatChanger extends Component {
  constructor(props) {
    super(props)

    this.state = {
      formats: [],
      selected: '',
      data: DatasetQuery.results,
      url: '',
    }
  }

  componentDidMount() {
    this.checkFields()
  }

  checkFields = () => {
    const data = this.state.data
    const rd = data.research_dataset
    let dataciteExists = false
    let fields = {}

    // Check that doi exists in one of the identifiers
    if (
      (typeof data.preservation_identifier !== 'undefined' &&
        data.preservation_identifier.includes('doi')) ||
      (typeof rd.preferred_identifier !== 'undefined' && rd.preferred_identifier.includes('doi'))
    ) {
      dataciteExists = true
    }

    if (dataciteExists) {
      fields = [
        { label: 'Metax JSON', value: 'metax' },
        { label: 'Datacite without validation', value: 'fairdata_datacite' },
        { label: 'Datacite format', value: 'datacite' },
      ]
    } else {
      fields = [{ label: 'Metax JSON', value: 'metax' }]
    }
    this.setState({
      formats: fields,
      selected: '',
    })
  }

  changeFormat = (format) => {
    if (this.state.formats.some((field) => field.value === format.value)) {
      this.setState(
        {
          selected: format,
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

  openFormat = (url) => {
    const win = window.open(url, '_blank')
    win.focus()
  }

  render() {
    return !this.state.data.removed ? (
      <FormatSelect
        background={this.props.theme.color.primary}
        newestColor={this.props.theme.color.white}
        color={this.props.theme.color.primary}
        padding="0.5em 1em"
        width="fit-content"
        value={this.state.selected}
        onChange={this.changeFormat}
        onBlur={this.closeModal}
        options={this.state.formats}
        notRemoved={this.state.notRemoved}
      />
    ) : null
  }
}

FormatChanger.propTypes = {
  idn: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
}

export default withRouter(withTheme(FormatChanger))
