import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const AddedValue = ({ readonly, id, text, remove }) => (
  <Container tabIndex="0">
    <span>{text}</span>
    {!readonly && (
      <RemoveButton onClick={() => remove(id)} aria-label="remove">
        <FontAwesomeIcon className="delete-keyword" size="xs" icon={faTimes} />
      </RemoveButton>
    )}
  </Container>
)

const Container = styled.div`
  padding: 0.3em 0.6em 0.4em;
  border-radius: 0.2em;
  background: ${props => props.theme.color.primary};
  color: white;
  display: inline-block;
  margin: 0 0.5em 0.5em 0;
`
const RemoveButton = styled.button`
  padding: 0;
  margin: 0;
  border: none;
  color: inherit;
  background-color: inherit;
  padding-left: 10px;
`

AddedValue.propTypes = {
  readonly: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
}

export default AddedValue
