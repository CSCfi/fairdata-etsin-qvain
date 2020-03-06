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
      environment: '',
      url: '',
    }
  }

  componentDidMount() {
    this.checkFields()
    this.checkHost()
  }

  checkFields = () => {
    const data = this.state.data;
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
      selected: '',
    })
  }

  checkHost = () => {
    let env = ''

    if (process.env.NODE_ENV === 'test') { /* test and stable */
      env = 'https://metax-test.csc.fi/'
    } else if (process.env.NODE_ENV === 'development') { /* local */
      env = 'https://metax-test.csc.fi/'
    } else if (process.env.NODE_ENV === 'production') { /* production */
      env = 'https://metax.fairdata.fi/'
    }

    this.setState({
      environment: env
    })
  }


  changeFormat = (format) => {
    let urlFormat = ''
    if (format.value === 'metax') {
      urlFormat = `${this.state.environment}rest/datasets/${this.props.idn}.json`
    } else {
      urlFormat = `${this.state.environment}rest/datasets/${this.props.idn}?dataset_format=${format.value}`
    }

    this.setState(
      {
        selected: format,
        url: urlFormat,
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

  render() {
    return (!this.state.data.removed) ? (
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
      : null
  }
}

FormatChanger.propTypes = {
  idn: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
}

export default withRouter(withTheme(FormatChanger))
