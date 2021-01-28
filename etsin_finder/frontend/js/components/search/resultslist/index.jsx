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

import React from 'react'
import { observer } from 'mobx-react'

import Loader from '../../general/loader'
import ListItem from './listItem'
import { useStores } from '../../../utils/stores'

const ResultsList = () => {
  const {
    Locale: { currentLang },
    ElasticQuery,
  } = useStores()

  const renderList = lang => {
    const list = ElasticQuery.results.hits.map(
      single =>
        // Filter list to exclude datasets with data-catalog-pas , if PAS datasets should be excluded
        !(
          ElasticQuery.includePasDatasets === false &&
          (single._source.data_catalog.en === 'Fairdata PAS datasets' ||
            single._source.data_catalog.fi === 'Fairdata PAS-aineistot')
        ) && (
          <ListItem
            key={single._id}
            catId={single._source.identifier}
            item={single._source}
            lang={lang}
          />
        ),
      this
    )
    return list
  }

  return (
    <div>
      <Loader active={ElasticQuery.loading} margin="0.2em 0 1em" />
      {renderList(currentLang)}
    </div>
  )
}

export default observer(ResultsList)
