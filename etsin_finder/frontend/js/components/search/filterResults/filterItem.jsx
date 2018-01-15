import React from 'react';

const FilterItem = ({ item, term, handleFilter }) =>
  (
    <li>
      <button tabIndex="-1" onClick={() => handleFilter(term, item.key)}>
        { item.key } ({ item.doc_count })
      </button>
    </li>
  );

export default FilterItem;
