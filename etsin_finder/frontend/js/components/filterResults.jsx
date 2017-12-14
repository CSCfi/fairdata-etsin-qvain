import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import checkDataLang from '../utils/checkDataLang';

class FilterResults extends Component {
  toggleFilter(event) {
    event.target.nextSibling.classList.toggle('open')
    event.target.nextSibling.querySelectorAll('button').forEach(button => (
      button.hasAttribute('disabled')
        ? button.removeAttribute('disabled')
        : button.setAttribute('disabled', '')
    ))
  }

  updateFilter() {
    //  updateFilter(event) {
    // alert(event.target.innerHTML)
  }

  // Render a facet section
  // Params:
  // title (langstring object)
  // aggregation (string or langstring object)
  renderFilterSection(title, aggregation) {
    // Figure out languages
    const { currentLang } = this.props.Stores.Locale;
    const titleName = checkDataLang(title, currentLang);
    const aggregationName = typeof aggregation === 'object'
      ? checkDataLang(aggregation, currentLang)
      : aggregation;

    // Take out empty lists
    if (this.props.aggregations[aggregationName] === 'undefined'
      || this.props.aggregations[aggregationName].buckets.length <= 0) {
      return '';
    }

    return (
      <div className="filter-section">
        <button className="filter-category" onClick={this.toggleFilter} >
          { titleName }
          <i className="fa fa-angle-down fa-2x" aria-hidden="true" />
        </button>
        <div className="filter-items">
          <ul>
            { this.renderFilterItems(aggregationName) }
          </ul>
        </div>
      </div>
    );
  }

  // Render list of facet values for given section
  renderFilterItems(aggregationName) {
    const listItems = this.props.aggregations[aggregationName].buckets.map(item => (
      <li key={item.key}>
        <button onClick={this.updateFilter} disabled>
          { item.key } ({ item.doc_count })
        </button>
      </li>
    ));

    return listItems;
  }

  render() {
    return (
      <div className="search-filtering">
        { this.renderFilterSection({ en: 'Organization', fi: 'Organisaatio' }, 'organization') }
        { this.renderFilterSection({ en: 'Creator', fi: 'Luoja' }, 'creator') }
        { this.renderFilterSection({ en: 'Field of Science', fi: 'Tieteenala' }, { en: 'field_of_science_en', fi: 'field_of_science_fi' }) }
        { this.renderFilterSection({ en: 'Keyword', fi: 'Avainsana' }, { en: 'keyword_en', fi: 'keyword_fi' }) }
      </div>
    );
  }
}

export default inject('Stores')(observer(FilterResults));
