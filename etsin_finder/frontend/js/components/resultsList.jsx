import React, { Component } from 'react'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'

import ListItem from './listItem'
import Loader from './loader'
import FilterResults from './filterResults'

class ResultsList extends Component {
  constructor(props) {
    super(props)
    this.renderList = this.renderList.bind(this)
  }

  renderList(lang) {
    // console.time()
    const list = this.props.results.map(single => (
      <ListItem
        key={single._id}
        identifier={single._id}
        item={single._source}
        lang={lang}
      />
    ), this)
    // console.timeEnd()
    return list
  }

  render() {
    const { currentLang } = this.props.Stores.Locale
    return (
      <div className="container">
        {this.props.loading
          ? <Loader />
          :
          <div className="row regular-row">
            <div className="col-lg-3">
              <Translate className="results-amount" with={{ amount: this.props.total }} component="p" content={`results.amount.${this.props.total === 1 ? 'snglr' : 'plrl'}`} fallback="%(amount)s results" />
              {this.props.results.length === 0
                ? null
                :
                <FilterResults aggregations={this.props.aggregations} />
              }
            </div>
            <div className="col-lg-9">
              {this.props.results.length === 0
                ?
                  <div className="results-zero">
                    <span>Your search -
                      <strong> {this.props.query} </strong>
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
