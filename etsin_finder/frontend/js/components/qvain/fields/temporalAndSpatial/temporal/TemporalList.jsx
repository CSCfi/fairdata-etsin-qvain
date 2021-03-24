import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Translate from 'react-translate-component'

import Label from '../../../general/card/label'

const dateToString = (date, lang) => (date ? new Date(date).toLocaleDateString(lang) : '')

const TemporalList = ({ temporals, lang, remove, readonly }) =>
  temporals.map(item => (
    <Label color="primary" margin="0 0.5em 0.5em 0" key={item.uiid}>
      <PaddedWord>
        {`${dateToString(item.startDate, lang)} - ${dateToString(item.endDate, lang)}`}
      </PaddedWord>
      {!readonly && (
        <Translate
          component={RemoveButton}
          attributes={{ 'aria-label': 'qvain.general.buttons.remove' }}
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

const RemoveButtonStyles = styled.button.attrs({
  type: 'button',
})`
  background: none;
  border: none;
  color: inherit;
`

export const RemoveButton = props => (
  <RemoveButtonStyles {...props}>
    <RemoveIcon />
  </RemoveButtonStyles>
)

const RemoveIcon = styled(FontAwesomeIcon).attrs({
  icon: faTimes,
  size: 'xs',
})``

const PaddedWord = styled.span`
  padding-right: 10px;
`

export default TemporalList
