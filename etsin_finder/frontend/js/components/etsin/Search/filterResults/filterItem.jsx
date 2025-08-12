import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { useNavigate } from 'react-router-dom'

import { useStores } from '@/stores/stores'
import { useQuery } from '@/components/etsin/general/useQuery'

const quoteValue = value => {
  // Wrap value with quotation marks if needed
  if (value.includes(',') && !value.startsWith('"')) {
    return `"${value}"`
  }
  return value
}

const FilterItem = ({ filter, item, tabIndex }) => {
  const {
    Locale: { getValueTranslation },
  } = useStores()

  const query = useQuery()
  const navigate = useNavigate()
  const values = query.getAll(filter)

  const itemValue = quoteValue(getValueTranslation(item.value))
  const isActive = values.find(v => v === itemValue)

  function setFilter() {
    if (isActive) query.delete(filter, itemValue)
    else query.append(filter, itemValue)

    navigate(`/datasets?${query.toString()}`)
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
