import React from 'react';

const FilterItem = ({ item, onClick }) =>
  (
    <li>
      <button onClick={e => onClick(e, item.key)}>
        { item.key } ({ item.doc_count })
      </button>
    </li>
  );

export default FilterItem;
