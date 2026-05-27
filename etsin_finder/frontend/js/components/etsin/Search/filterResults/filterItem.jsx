import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { useStores } from '@/stores/stores'
import { useQuery, useEtsinSearchNavigate } from '@/components/etsin/general/useQuery'

const quoteValue = value => {
  // Wrap value with quotation marks if needed
  if (value.includes(',') && !value.startsWith('"')) {
    return `"${value}"`
  }
  return value
}

const FilterItem = ({ filter, item, tabIndex, disabled }) => {
  const {
    Locale: { getValueTranslation },
  } = useStores()

  const query = useQuery()
  const navigateSearch = useEtsinSearchNavigate()
  const values = query.getAll(filter)

  const itemValue = quoteValue(getValueTranslation(item.value))
  const isActive = values.find(v => v === itemValue)

  function setFilter() {
    if (isActive) query.delete(filter, itemValue)
    else query.append(filter, itemValue)

    navigateSearch(query)
  }

  return (
    <li>
      <button
        role="switch"
        type="button"
        disabled={disabled}
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
  disabled: PropTypes.bool,
}

FilterItem.defaultProps = {
  disabled: false,
}

export default observer(FilterItem)
