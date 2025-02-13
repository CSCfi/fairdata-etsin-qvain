import React, { useState } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Select from 'react-select'
import Translate from '@/utils/Translate'

import { Input } from '@/components/qvain/general/modal/form'
import { SortDirectionButton } from '@/components/qvain/general/buttons/iconButtons'

import { ItemRow, ItemSpacer } from './items'

const FilterInput = styled(Input)`
  margin: 0;
  width: auto;
  flex-grow: 1;
`
const Label = styled.span`
  width: 3.5rem;
  margin: 0rem 0.5rem 0rem 0.75rem;
  text-align: right;
`

const FilterRowWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: -0.75rem;
`

const FilterBlock = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`

const StyledSortDirectionButton = styled(SortDirectionButton)`
  margin-right: 0;
`

const filterDirectory = debounce((dir, filterText, directoryView) => {
  directoryView.filter(dir, filterText)
}, 500)

const getOptionLabel = option => <Translate content={`qvain.files.sort.${option.option}`} />

const FilterRow = observer(({ parent, items, level, directoryView }) => {
  const filter = directoryView.getDirectoryFilter(parent)
  const [text, setText] = useState(filter)
  const { currentOption, options, setOption, reverse, toggleReverse } =
    directoryView.getOrCreateDirectorySort(parent)

  const sortOnChange = val => {
    setOption(val)
    filterDirectory(parent, text, directoryView)
  }

  const onReverseClick = () => {
    toggleReverse()
    filterDirectory(parent, text, directoryView)
  }

  if (items.length > 20 || filter) {
    const onChange = e => {
      setText(e.target.value)
      filterDirectory(parent, e.target.value, directoryView)
    }
    let noMatches = null
    if (items.length === 0) {
      noMatches = (
        <ItemRow>
          <ItemSpacer level={level + 1} />
          <Translate content="qvain.files.filterRow.noMatches" />
        </ItemRow>
      )
    }
    return (
      <>
        <ItemRow>
          <ItemSpacer level={level} shrink />
          <FilterRowWrapper>
            <FilterBlock>
              <Translate content="qvain.files.filterRow.filter" component={Label} />
              <Translate
                component={FilterInput}
                type="text"
                value={text || ''}
                onChange={onChange}
                attributes={{ placeholder: 'qvain.files.filterRow.placeholder' }}
              />
            </FilterBlock>
            <FilterBlock>
              <Translate content="qvain.files.sort.label" component={Label} />
              <Translate
                inputId="sort-files-input"
                component={Select}
                value={currentOption}
                options={options}
                getOptionLabel={option => getOptionLabel(option)}
                getOptionValue={option => option.value}
                place
                styles={{
                  control: provided => ({ ...provided, minWidth: '8rem' }),
                  container: provided => ({ ...provided, flexGrow: 1 }),
                }}
                onChange={sortOnChange}
                menuPlacement="auto"
                menuPosition="fixed"
                menuShouldScrollIntoView={false}
              />
              <StyledSortDirectionButton
                className="sort-direction"
                descending={reverse}
                onClick={onReverseClick}
              />
            </FilterBlock>
          </FilterRowWrapper>
        </ItemRow>
        {noMatches}
      </>
    )
  }
  return null
})

FilterRow.propTypes = {
  directoryView: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  parent: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
}

export default FilterRow
