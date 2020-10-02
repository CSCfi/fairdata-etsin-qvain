import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Label from '../../general/label'

class TemporalList extends Component {
  render() {
    const { temporals, lang, remove } = this.props
    const Temporals = () => temporals.map(item => (
      <Label color="primary" margin="0 0.5em 0.5em 0" key={item.uiid}>
        <PaddedWord>{`${new Date(item.startDate).toLocaleDateString(lang)} - ${new Date(item.endDate).toLocaleDateString(lang)}`}</PaddedWord>
        <FontAwesomeIcon onClick={() => { remove(item.uiid) }} icon={faTimes} size="xs" />
      </Label>
    ))
    return <>{Temporals()}</>
  }
}

TemporalList.propTypes = {
  temporals: PropTypes.array.isRequired,
  lang: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired
}


const PaddedWord = styled.span`
  padding-right: 10px;
`

export default TemporalList
