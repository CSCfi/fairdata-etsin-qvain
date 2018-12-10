import React from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import Locale from '../../../stores/view/language'

const InfoItem = props => (
  <tr>
    <th scope="row">
      <Translate content={props.translation} />
    </th>
    <td lang={props.lang}>{props.content}</td>
  </tr>
)

InfoItem.defaultProps = {
  lang: Locale.currentLang
}

InfoItem.propTypes = {
  translation: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  lang: PropTypes.string,
}

export default InfoItem
