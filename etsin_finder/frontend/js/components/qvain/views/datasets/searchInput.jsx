import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import { FormField, Input, Label as inputLabel } from '../../general/modal/form'
import { useStores } from '../../../../stores/stores'

const SearchInput = () => {
  const {
    QvainDatasets: { datasetGroups, searchTerm, setSearchTerm, minDatasetsForSearchTool },
  } = useStores()

  const noOfDatasetGroups = datasetGroups.length
  if (noOfDatasetGroups < minDatasetsForSearchTool) {
    return null
  }
  return (
    <>
      <Translate component={SearchLabel} content="qvain.datasets.search.searchTitle" />
      <SearchField>
        <Translate
          className="visuallyhidden"
          htmlFor="datasetSearchInput"
          component={inputLabel}
          content="qvain.datasets.search.hidden"
        />
        <Translate
          component={SearchFieldInput}
          id="datasetSearchInput"
          attributes={{ placeholder: 'qvain.datasets.search.placeholder' }}
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
        />
      </SearchField>
    </>
  )
}

const SearchField = styled(FormField)`
  vertical-align: middle;
  width: 100%;
  align-items: center;
`

const SearchLabel = styled.div`
  font-family: 'Lato', sans-serif;
  margin-bottom: 7px;
`

const SearchFieldInput = styled(Input)`
  margin-bottom: inherit;
`

export default SearchInput
