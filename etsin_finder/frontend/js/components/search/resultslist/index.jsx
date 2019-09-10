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

import ElasticQuery from '../../../stores/view/elasticquery'
import Loader from '../../general/loader'
import ListItem from './listItem'

class ResultsList extends Component {
  constructor(props) {
    super(props)

    this.renderList = this.renderList.bind(this)
  }

  renderList(lang) {
    const list = ElasticQuery.results.hits.map(
      single => (
        (
          // Exclude linked PAS datasets (they contain this value), in order to only show the ATT/IDA version
          !(single._source.preservation_dataset_origin_version)
          &&
          // Filter list to exclude datasetes with a preservation state, if PAS datasets should be excluded
          !((ElasticQuery.includePasDatasets === false) && (single._source.preservation_state > 0))
        ) && (
          <ListItem
            key={single._id}
            catId={single._source.identifier}
            item={single._source}
            lang={lang}
          />
        )
      ),
      this
    )
    return list
  }

  render() {
    const { currentLang } = this.props.Stores.Locale
    return (
      <div>
        <Loader active={ElasticQuery.loading} margin="0.2em 0 1em" />
        {this.renderList(currentLang)}
      </div>
    )
  }
}

ResultsList.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(ResultsList))
