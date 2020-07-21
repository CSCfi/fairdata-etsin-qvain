import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const AddedValue = ({ readonly, id, text, remove }) => (
  <Container aria-labelledby={id} tabIndex="0">
    <span id={id}>{text}</span>
    {!readonly && (
      <RemoveButton onClick={() => remove(id)}>
        <Translate content="qvain.common.remove" component={HiddenText} />
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
const HiddenText = styled.span`
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
`

AddedValue.propTypes = {
  readonly: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
}

export default AddedValue
