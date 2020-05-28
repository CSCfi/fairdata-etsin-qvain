import React, { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import Card from '../card';
import { PlusIcon, MinusIcon } from './expand'


const Field = ({ brief, children }) => {
  const [expanded, setExpanded] = useState(false)

  return expanded ? (
    <FieldContainerExpanded>
      <FieldHeaderExpanded>
        <MinusIcon onClick={() => setExpanded(false)} />
        <Translate tabIndex="0" content={brief.title} />
      </FieldHeaderExpanded>
      <Translate component="p" content={brief.description} />
      {children}
    </FieldContainerExpanded>
    ) : (
      <FieldContainerCollapsed>
        <FieldHeaderCollapsed>
          <PlusIcon onClick={() => setExpanded(true)} />
          <Translate tabIndex="0" content={brief.title} />
        </FieldHeaderCollapsed>
      </FieldContainerCollapsed>
    )
}

const FieldContainerCollapsed = styled.div`
  padding: 25px 45px;
  margin-top: 20px;
  border: 1px solid #cccccc;
`

const FieldHeaderCollapsed = styled.div`
font-size: 1.2em;
margin: 0;
font-weight: bold;
line-height: calc(1.5 * 1.2em);
`

const FieldHeaderExpanded = styled.h3`

`

const FieldContainerExpanded = styled(Card)`
`

Field.propTypes = {
    children: PropTypes.object.isRequired,
    brief: PropTypes.object
}

Field.defaultProps = {
    brief: {
        title: '',
        description: ''
    }
}

export default Field
