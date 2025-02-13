import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import Translate from '@/utils/Translate'

export const IconStyles = styled(FontAwesomeIcon)`
  color: ${props => props.theme.color.primary};
  :hover {
    color: #004d79;
  }
`

export const NoStyleButton = styled.button`
  border: none;
  background-color: unset;
`

export const ExpandCollapse = props => (
  <Translate
    component={NoStyleButton}
    type="button"
    {...props}
    attributes={{
      'aria-label': props.isExpanded ? 'general.showLess' : 'general.showMore',
    }}
  >
    {props.isExpanded ? <IconStyles icon={faMinus} /> : <IconStyles icon={faPlus} />}
  </Translate>
)

ExpandCollapse.propTypes = {
  isExpanded: PropTypes.bool,
}

ExpandCollapse.defaultProps = {
  isExpanded: false,
}
