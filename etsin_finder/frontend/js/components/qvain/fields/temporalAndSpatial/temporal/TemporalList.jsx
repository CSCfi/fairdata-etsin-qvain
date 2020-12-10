import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Label from '../../../general/card/label'

const dateToString = (date, lang) => (date ? new Date(date).toLocaleDateString(lang) : '')

const TemporalList = ({ temporals, lang, remove, readonly }) =>
  temporals.map(item => (
    <Label color="primary" margin="0 0.5em 0.5em 0" key={item.uiid}>
      <PaddedWord>
        {`${dateToString(item.startDate, lang)} - ${dateToString(item.endDate, lang)}`}
      </PaddedWord>
      {!readonly && (
        <FontAwesomeIcon
          onClick={() => {
            remove(item.uiid)
          }}
          icon={faTimes}
          size="xs"
        />
      )}
    </Label>
  ))

TemporalList.propTypes = {
  temporals: PropTypes.array.isRequired,
  lang: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
  readonly: PropTypes.bool,
}

TemporalList.defaultProps = {
  readonly: false,
}

const PaddedWord = styled.span`
  padding-right: 10px;
`

export default TemporalList
