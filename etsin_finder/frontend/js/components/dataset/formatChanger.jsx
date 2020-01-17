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
import ErrorPage from '../errorpage'
import DatasetQuery from '../../stores/view/datasetquery'
import Accessibility from '../../stores/view/accessibility'


import FormatSelect from './formatselect'


class FormatChanger extends Component {
  constructor(props) {
    super(props)

    this.state = {
      formats: [],
      error: false,
      selected: '',
    }

    this.query = this.query.bind(this)
  }

  componentDidMount = () => {
    Accessibility.resetFocus()
    this.query()
  }

  checkFields = (data) => {
    const rd = data.research_dataset;
    let dataciteExists = false;
    let fields = {};

    // Check that doi exists in one of the identifiers
    if ((typeof data.preservation_identifier !== 'undefined' && data.preservation_identifier.includes('doi'))
      || (typeof rd.preferred_identifier !== 'undefined' && rd.preferred_identifier.includes('doi'))) {
      dataciteExists = true;
    }

    if (dataciteExists) {
      fields = [{ label: 'Metax JSON', value: 'metax' },
      { label: 'Datacite without validation', value: 'fairdata_datacite' },
      { label: 'Datacite format', value: 'datacite' }]
    } else {
      fields = [{ label: 'Metax JSON', value: 'metax' }]
    }
    this.setState({
      formats: fields,
      error: false,
      selected: '',
    })
  }


  changeFormat = (name, format) => {
    this.setState(
      {
        selected: format,
        url: `https://metax-test.csc.fi/rest/datasets/${this.props.idn}?dataset_format=${format.value}`
      },
      () => {
        this.openFormat(this.state.url)
      }
    )
  }

  openFormat = (url) => {
    const win = window.open(url, '_blank');
    win.focus();
  }

  query = (customId) => {
    let identifier = this.props.idn
    if (customId !== undefined) {
      identifier = customId
    }
    DatasetQuery.getData(identifier)
      .then(result => {
        this.checkFields(result.catalog_record)
      })
      .catch(error => {
        console.log(error)
        this.setState({ error })
      })
  }

  render() {
    // CASE 1: Houston, we have a problem
    if (this.state.error !== false) {
      return <ErrorPage error={{ type: 'notfound' }} />
    }
    return (
      <FormatSelect
        background={this.props.theme.color.primary}
        newestColor={this.props.theme.color.white}
        color={this.props.theme.color.primary}
        padding="0.5em 1em"
        width="10em"
        value={this.state.selected}
        onChange={this.changeFormat}
        onBlur={this.closeModal}
        options={this.state.formats}
        notRemoved={this.state.notRemoved}
      />
    )
  }
}

FormatChanger.propTypes = {
  idn: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
}

export default withRouter(withTheme(FormatChanger))
