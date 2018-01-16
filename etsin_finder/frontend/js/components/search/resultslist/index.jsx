import React, { Component } from 'react'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'

import ListItem from './listItem'
import Loader from '../../general/loader'
import FilterResults from '../filterResults'
import ErrorBoundary from '../../general/errorBoundary'
import ElasticQuery from '../../../stores/view/elasticquery'

class ResultsList extends Component {
  constructor(props) {
    super(props)
    this.renderList = this.renderList.bind(this)
  }

  renderList(lang) {
    const list = ElasticQuery.results.hits.map(single => (
      <ListItem
        key={single._id}
        identifier={single._id}
        item={single._source}
        lang={lang}
      />
    ), this)
    return list
  }

  render() {
    console.log('Render: Results list')
    const { currentLang } = this.props.Stores.Locale
    return (
      <div className="container">
        {ElasticQuery.loading
          ? <Loader />
          :
          <div className="row regular-row">
            <div className="col-lg-3">
              <Translate className="results-amount" with={{ amount: ElasticQuery.results.total }} component="p" content={`results.amount.${ElasticQuery.results.total === 1 ? 'snglr' : 'plrl'}`} fallback="%(amount)s results" />
              {ElasticQuery.results.hits.length === 0
                ? null
                :
                <ErrorBoundary>
                  <FilterResults />
                </ErrorBoundary>
              }
            </div>
            <div className="col-lg-9">
              {ElasticQuery.results.hits.length === 0
                ?
                  <div className="results-zero">
                    <span>Your search -
                      <strong> {ElasticQuery.search} </strong>
                      - did not match any documents
                    </span>
                  </div>
                : this.renderList(currentLang)}
            </div>
          </div>
        }
      </div>
    );
  }
}

export default inject('Stores')(observer(ResultsList))
