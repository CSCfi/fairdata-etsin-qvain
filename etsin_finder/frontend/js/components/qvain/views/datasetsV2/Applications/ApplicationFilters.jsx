import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Button from '@/components/etsin/general/button'
import { useStores } from '@/stores/stores'
import { Placeholder, SearchInput } from '../styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const RadioButton = ({ children, checked = false, ...props }) => {
  return (
    <StyledRadioButton as="label" checked={checked}>
      <HiddenRadio checked={checked} {...props} />
      {children}
    </StyledRadioButton>
  )
}

RadioButton.propTypes = {
  children: PropTypes.node,
  checked: PropTypes.bool,
}

const ApplicationFilters = () => {
  const {
    Locale: { translate },
    Qvain: {
      REMSApplications: { filter, setFilter, searchTerm, setSearchTerm },
    },
  } = useStores()

  const handler = e => {
    setFilter(e.target.value)
  }

  return (
    <FilterRow>
      <SearchInput
        inputId="search-applications-input"
        value={searchTerm}
        onChange={setSearchTerm}
        marginLeft="0"
        flexGrow="1"
        placeholder={
          <>
            <FontAwesomeIcon icon={faSearch} />
            <Placeholder>{translate('qvain.datasets.search.label')}</Placeholder>
          </>
        }
        attributes={{ 'aria-label': 'qvain.datasets.search.label' }}
      />
      <RadioButtons>
        <RadioButton name="filter-state" value="all" checked={filter == 'all'} onChange={handler}>
          {translate('qvain.applications.filters.all')}
        </RadioButton>
        <RadioButton name="filter-state" value="todo" checked={filter == 'todo'} onChange={handler}>
          {translate('qvain.applications.filters.todo')}
        </RadioButton>
        <RadioButton
          name="filter-state"
          value="handled"
          checked={filter == 'handled'}
          onChange={handler}
        >
          {translate('qvain.applications.filters.handled')}
        </RadioButton>
      </RadioButtons>
    </FilterRow>
  )
}

const RadioButtons = styled.div`
  display: flex;
  align-items: stretch;
  height: 38px;
`

const StyledRadioButton = styled(Button)`
  display: flex;
  align-items: center;

  background: white; // ${p => p.theme.color.redText};
  border: 1px solid hsl(0, 0%, 80%);
  color: ${p => p.theme.color.superdarkgray};
  ${p =>
    p.checked &&
    `
      background: ${p.theme.color.lightgray};
    `}
  margin: 0px;
  border-radius: 0;

  &:hover {
    background: ${p => p.theme.color.medgray};
    border: 1px solid hsl(0, 0%, 80%);
  }

  &:not(:first-child) {
    border-left: none;
  }

  &:first-child {
    border-radius: 4px 0 0 4px;
  }

  &:last-child {
    border-radius: 0 4px 4px 0;
  }
`

const HiddenRadio = styled.input.attrs({ type: 'radio' })`
  display: none;
`

const FilterRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
`

export default observer(ApplicationFilters)
