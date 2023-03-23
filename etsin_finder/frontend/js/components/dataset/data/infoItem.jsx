import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import Stores from '../../../stores'

const InfoItem = props => (
  <tr>
    <th scope="row">
      <Translate content={props.translation} with={{ insertable: props.insertable }}/>
    </th>
    <InfoCell lang={props.lang}>{props.content}</InfoCell>
  </tr>
)

const InfoCell = styled.td`
  word-break: normal;
  overflow-wrap: anywhere;
`

InfoItem.defaultProps = {
  lang: Stores.Locale.currentLang,
  insertable: '',
}

InfoItem.propTypes = {
  translation: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  lang: PropTypes.string,
  insertable: PropTypes.string,
}

export default InfoItem
