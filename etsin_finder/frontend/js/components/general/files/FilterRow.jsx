import React, { useState } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import { ItemRow, ItemSpacer } from './items'
import { Input } from '@/components/qvain/general/modal/form'

const FilterInput = styled(Input)`
  margin: 0 0 0 0.5rem;
  width: auto;
  height: 1.75rem;
`

const filterDirectory = debounce((dir, filterText, directoryView) => {
  directoryView.filter(dir, filterText)
}, 500)

const FilterRow = observer(({ parent, items, level, directoryView }) => {
  const filter = directoryView.getDirectoryFilter(parent)
  const [text, setText] = useState(filter)

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
          <ItemSpacer level={level} />
          <Translate content="qvain.files.filterRow.filter" />
          <Translate
            component={FilterInput}
            type="text"
            value={text || ''}
            onChange={onChange}
            attributes={{ placeholder: 'qvain.files.filterRow.placeholder' }}
          />
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
