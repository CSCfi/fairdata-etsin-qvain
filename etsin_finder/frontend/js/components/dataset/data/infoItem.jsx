import React from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

const InfoItem = props => (
  <tr>
    <th scope="row">
      <Translate content={props.translation} />
    </th>
    <td lang={props.lang}>{props.content}</td>
  </tr>
)

InfoItem.propTypes = {
  translation: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
}

export default InfoItem
