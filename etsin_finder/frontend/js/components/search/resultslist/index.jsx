import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import ListItem from './listItem'
import ElasticQuery from '../../../stores/view/elasticquery'

class ResultsList extends Component {
  constructor(props) {
    super(props)

    this.renderList = this.renderList.bind(this)
  }

  renderList(lang) {
    const list = ElasticQuery.results.hits.map(
      single => (
        <ListItem
          key={single._id}
          identifier={single._id}
          item={single._source}
          lang={lang}
        />
      ),
      this
    )
    return list
  }

  render() {
    console.log('Render: Results list')
    const { currentLang } = this.props.Stores.Locale
    return ElasticQuery.results.hits.length === 0 ? (
      <div className="results-zero">
        <span>
          Your search -
          <strong> {ElasticQuery.search} </strong>
          - did not match any documents
        </span>
      </div>
    ) : (
      this.renderList(currentLang)
    )
  }
}

export default inject('Stores')(observer(ResultsList))
