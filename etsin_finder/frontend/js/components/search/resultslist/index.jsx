import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import ElasticQuery from 'Stores/view/elasticquery'
import ListItem from './listItem'

class ResultsList extends Component {
  constructor(props) {
    super(props)

    this.renderList = this.renderList.bind(this)
  }

  renderList(lang) {
    console.log('ES results', ElasticQuery.results)
    const list = ElasticQuery.results.hits.map(
      single => (
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

  render() {
    const { currentLang } = this.props.Stores.Locale
    if (ElasticQuery.results.hits.length === 0 && ElasticQuery.loading === 0) {
      return (
        <div className="results-zero">
          <span>
            Your search -
            <strong> {ElasticQuery.search} </strong>
            - did not match any documents
          </span>
        </div>
      )
    }
    return this.renderList(currentLang)
  }
}

export default inject('Stores')(observer(ResultsList))
