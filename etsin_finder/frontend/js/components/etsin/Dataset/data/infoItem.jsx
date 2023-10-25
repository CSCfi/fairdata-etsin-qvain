import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

const InfoItem = props =>
  props.content ? (
    <tr>
      <th scope="row">
        <Translate content={props.translation} with={{ insertable: props.insertable }} />
      </th>
      <InfoCell lang={props.lang || props.Stores.Locale.currentLang}>{props.content}</InfoCell>
    </tr>
  ) : null

const InfoCell = styled.td`
  word-break: normal;
  overflow-wrap: anywhere;
`

InfoItem.defaultProps = {
  content: undefined,
  lang: undefined,
  insertable: '',
}

InfoItem.propTypes = {
  Stores: PropTypes.object.isRequired,
  translation: PropTypes.string.isRequired,
  content: PropTypes.string,
  lang: PropTypes.string,
  insertable: PropTypes.string,
}

export default InfoItem
