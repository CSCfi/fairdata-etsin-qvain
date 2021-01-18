import React, { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import Card from '../card'
import { ExpandCollapse } from './expand'

const Field = ({ brief, labelFor, children }) => {
  const [expanded, setExpanded] = useState(false)

  return expanded ? (
    <FieldContainerExpanded>
      <FieldHeaderExpanded onClick={() => setExpanded(false)}>
        <ExpandCollapse isExpanded={expanded} />
        <Translate tabIndex="0" component="label" content={brief.title} htmlFor={labelFor} />
      </FieldHeaderExpanded>
      <Translate component="p" content={brief.description} />
      {children}
    </FieldContainerExpanded>
  ) : (
    <FieldContainerCollapsed>
      <FieldHeaderCollapsed onClick={() => setExpanded(true)}>
        <ExpandCollapse isExpanded={expanded} />
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

const FieldHeaderExpanded = styled.h3``

const FieldContainerExpanded = styled(Card)``

Field.propTypes = {
  children: PropTypes.object.isRequired,
  brief: PropTypes.object,
  labelFor: PropTypes.string,
}

Field.defaultProps = {
  brief: {
    title: '',
    description: '',
  },
  labelFor: undefined,
}

export default Field
