import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import Translate from '@/utils/Translate'

import Label from '@/components/qvain/general/card/label'

const dateToString = (date, lang) => {
  if (date) {
    if (lang === 'fi') {
      return new Date(date).toLocaleDateString(lang)
    }
    return moment(new Date(date)).format('YYYY-MM-DD')
  }
  return undefined
}

const getTranslationItem = (item, lang) => ({
  startDate: dateToString(item.startDate, lang),
  endDate: dateToString(item.endDate, lang),
})

const getTranslationPath = item => {
  if (item.startDate && !item.endDate) return 'qvain.timePeriod.listItem.startDateOnly'
  if (!item.startDate && item.endDate) return 'qvain.timePeriod.listItem.endDateOnly'

  return 'qvain.timePeriod.listItem.bothDates'
}

const TemporalList = ({ temporals, lang, remove, readonly }) =>
  temporals.map(item => (
    <Label color="primary" margin="0 0.5em 0.5em 0" key={item.uiid}>
      <Translate
        className="date-label"
        component={PaddedWord}
        content={getTranslationPath(item)}
        with={getTranslationItem(item, lang)}
      />
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
