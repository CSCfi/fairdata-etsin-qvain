import React from 'react';
import ElasticQuery from '../../../stores/view/elasticquery'

const FilterItem = ({ item, term }) =>
  (
    <li>
      <button
        tabIndex="-1"
        onClick={() => {
          ElasticQuery.updateFilter(term, item.key)
          console.log(ElasticQuery.filter)
        }}
      >
        { item.key } ({ item.doc_count })
      </button>
    </li>
  );

export default FilterItem;
