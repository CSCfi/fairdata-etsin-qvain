import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import { useStores } from '../../utils/stores'
import { SortDirectionButton } from '../../general/buttons/iconButtons'

const getOptionLabel = option => <Translate content={`qvain.datasets.sort.${option.value}`} />

const Invite = () => {
  const {
    QvainDatasets: { searchTerm, setSearchTerm, sort },
  } = useStores()

  return (
    <Container>
      <SearchWrapper>
        <Translate
          component={SearchInput}
          inputId="search-datasets-input"
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={
            <>
              <FontAwesomeIcon icon={faSearch} />
              <Translate component={Placeholder} content="qvain.datasets.search.label" />
            </>
          }
          attributes={{ 'aria-label': 'qvain.datasets.search.label' }}
        />
      </SearchWrapper>

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
    </Container>
  )
}

// Use customized CreatableSelect as input that allows html (e.g. svg icon) in placeholder
const SearchInput = ({ value, onChange, placeholder, ...props }) => {
  const onInputChange = (val, { action }) => {
    // don't clear input when it loses focus
    if (action !== 'input-blur' && action !== 'menu-close') {
      onChange(val)
    }
  }

  return (
    <CreatableSelect
      components={{ DropdownIndicator: null }}
      inputValue={value}
      value={value}
      onInputChange={onInputChange}
      placeholder={placeholder}
      menuIsOpen={false}
      styles={{
        container: provided => ({
          ...provided,
          flexBasis: '12rem',
          maxWidth: '18rem',
          marginLeft: 'auto',
        }),
      }}
      {...props}
    />
  )
}

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.element.isRequired,
}

const SearchWrapper = styled.div`
  max-width: 20rem;
  width: 12rem;
  flex-grow: 1;
  min-width: 8rem;
`

const Placeholder = styled.span`
  margin-left: 1rem;
  color: #333333;
`

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 1.5rem;
  margin-left: 1.5rem;
`

const Label = styled.label`
  font-size: 18px;
  margin: 0 0.5rem 0 1.5rem;
`

export default observer(Invite)
