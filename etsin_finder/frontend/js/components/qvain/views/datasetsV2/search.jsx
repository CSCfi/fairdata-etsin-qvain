import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import Translate from '@/utils/Translate'
import { Checkbox } from '@/components/qvain/general/modal/form'

import { useStores } from '../../utils/stores'
import { SortDirectionButton } from '../../general/buttons/iconButtons'
import { Placeholder, SearchInput } from './styled'

const getOptionLabel = option => <Translate content={`qvain.datasets.sort.${option.value}`} />

const Search = ({ datasets }) => {
  const {
    Locale: { translate },
    QvainDatasets: { sort },
  } = useStores()

  if (!datasets) return null

  const {
    searchTerm,
    setSearchTerm,
    onlyManualApproval,
    setOnlyManualApproval,
    showOnlyManualApprovalToggle,
  } = datasets

  return (
    <Container>
      {showOnlyManualApprovalToggle && (
        <CheckboxLabel>
          <Checkbox
            checked={onlyManualApproval}
            onChange={e => setOnlyManualApproval(e.target.checked)}
          />
          {translate('qvain.datasets.search.onlyManualApproval')}
        </CheckboxLabel>
      )}

      <SearchWrapper>
        <Translate
          component={SearchInput}
          inputId="search-datasets-input"
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={
            <>
              <FontAwesomeIcon icon={faSearch} />
              <Placeholder>{translate('qvain.datasets.search.label')}</Placeholder>
            </>
          }
          attributes={{ 'aria-label': 'qvain.datasets.search.label' }}
        />
      </SearchWrapper>

      <SortWrapper>
        <Translate
          component={Label}
          htmlFor="sort-datasets-input"
          content="qvain.datasets.sort.label"
        />
        <Translate
          inputId="sort-datasets-input"
          component={Select}
          value={sort.currentOption}
          options={sort.options}
          getOptionLabel={option => getOptionLabel(option)}
          getOptionValue={option => option.value}
          place
          styles={{ control: provided => ({ ...provided, minWidth: '8rem' }) }}
          onChange={sort.setOption}
          menuPlacement="auto"
          menuPosition="fixed"
          menuShouldScrollIntoView={false}
        />
        <SortDirectionButton
          className="sort-direction"
          descending={sort.reverse}
          onClick={sort.toggleReverse}
        />
      </SortWrapper>
    </Container>
  )
}

Search.propTypes = {
  datasets: PropTypes.shape({
    searchTerm: PropTypes.string,
    setSearchTerm: PropTypes.func,
    onlyManualApproval: PropTypes.bool,
    setOnlyManualApproval: PropTypes.func,
    showOnlyManualApprovalToggle: PropTypes.bool,
  }),
}

const SearchWrapper = styled.div`
  max-width: 20rem;
  width: 12rem;
  flex-grow: 1;
  min-width: 8rem;
`

const SortWrapper = styled.div`
  display: flex;
  align-items: center;
`

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  margin-right: 1.5rem;
  margin-left: 1.5rem;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 18px;
  margin: 0 0.5rem 0 1.5rem;
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

export default observer(Search)
