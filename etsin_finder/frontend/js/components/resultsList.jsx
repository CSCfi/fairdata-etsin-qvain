import React, { Component } from 'react'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'

import ListItem from './listItem'
import Loader from './loader'
import FilterResults from './filterResults'
import SortResults from './sortResults'

class ResultsList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      results: this.props.results,
      sort: '',
    }
    this.renderList = this.renderList.bind(this)
    this.updateSorting = this.updateSorting.bind(this)
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      results: newProps.results,
    })
  }

  updateSorting(sort) {
    this.setState({
      sort,
    })
    this.renderList(this.props.Stores.Locale)
  }

  renderList(lang) {
    // console.time()
    const list = this.state.results.map(single => (
      <ListItem
        key={single._id}
        identifier={single._id}
        item={single._source}
        lang={lang}
        sort={this.state.sort}
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
              {this.state.results.length === 0
                ? null
                :
                <FilterResults />
              }
            </div>
            <div className="col-lg-9">
              <SortResults sorting={this.updateSorting} />
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
