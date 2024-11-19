import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

import { useStores } from '@/stores/stores'
import { useQuery } from '@/components/etsin/general/useQuery'

const FilterItem = ({ filter, item, tabIndex }) => {
  const {
    Locale: { getValueTranslation },
  } = useStores()

  const query = useQuery()
  const history = useHistory()
  const values = query.getAll(filter)
  const isActive = values.find(v => v === getValueTranslation(item.value))

  function setFilter() {
    if (isActive) query.delete(filter, getValueTranslation(item.value))
    else query.append(filter, getValueTranslation(item.value))

    history.push(`/datasets?${query.toString()}`)
  }

  return (
    <li>
      <button
        role="switch"
        type="button"
        tabIndex={tabIndex}
        className={isActive ? 'active' : undefined}
        aria-checked={isActive}
        onClick={setFilter}
      >
        {`${getValueTranslation(item.value)} (${item.count})`}
      </button>
    </li>
  )
}

FilterItem.propTypes = {
  filter: PropTypes.string.isRequired,
  item: PropTypes.shape({
    value: PropTypes.shape({
      fi: PropTypes.string,
      en: PropTypes.string,
      und: PropTypes.string,
    }),
    count: PropTypes.number,
  }).isRequired,
  tabIndex: PropTypes.string.isRequired,
}

export default observer(FilterItem)
