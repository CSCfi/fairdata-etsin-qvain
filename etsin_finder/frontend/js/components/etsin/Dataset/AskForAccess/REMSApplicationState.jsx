import { useStores } from '@/stores/stores'
import PropTypes from 'prop-types'
import styled, { useTheme } from 'styled-components'

import Translate from '@/utils/Translate'
import PopUp from '@/components/etsin/general/popup'
import { useState } from 'react'
import Button from '@/components/general/button'

const states = {
  'application.state/draft': {
    key: 'dataset.access_states.application_draft',
    color: 'yellow',
  },
  'application.state/submitted': {
    key: 'dataset.access_states.application_submitted',
    color: 'yellow',
  },
  'application.state/approved': {
    key: 'dataset.access_states.access_granted',
    color: 'success',
  },
  'application.state/rejected': {
    key: 'dataset.access_states.access_denied',
    color: 'error',
  },
  'application.state/closed': {
    key: 'dataset.access_states.application_closed',
    color: 'gray',
  },
  'application.state/returned': {
    key: 'dataset.access_states.application_returned',
    color: 'error',
  },
  'application.state/revoked': {
    key: 'dataset.access_states.access_denied',
    color: 'error',
  },
}

const ApplicationState = ({ application }) => {
  const {
    Locale: { translate, dateFormat },
  } = useStores()
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  const state = application['application/state']
  let key = 'dataset.access_unavailable'
  let color = theme.color.gray

  const stateConfig = states[state]
  if (stateConfig) {
    key = stateConfig.key
    color = stateConfig.color
  }

  const submitted = dateFormat(application['application/first-submitted'])
  const modified = dateFormat(application['application/modified'])

  const popupContent = (
    <StateDetails>
      <dt>{translate('dataset.access_modal.stateInfo.state')}</dt>
      <dd>{state}</dd>
      {submitted && (
        <>
          <dt>{translate('dataset.access_modal.stateInfo.submitted')}</dt>
          <dd>{submitted}</dd>
        </>
      )}
      <dt>{translate('dataset.access_modal.stateInfo.modified')}</dt>
      <dd>{modified}</dd>
    </StateDetails>
  )

  const togglePopup = () => setOpen(v => !v)

  return (
    <PopUp
      isOpen={open}
      popUp={popupContent}
      onRequestClose={() => setOpen(false)}
      align="right"
      text={<Translate content={'qvain.datasets.share.members.projectHelp'} />}
      fixed
    >
      <Button color={color} onClick={togglePopup}>
        {translate(key)}
      </Button>
    </PopUp>
  )
}

ApplicationState.propTypes = {
  application: PropTypes.object.isRequired,
}

const StateDetails = styled.dl`
  display: grid;
  grid-template-columns: 8rem 12rem;
  row-gap: 0.25rem;
  width: max-content;
  dt {
    font-weight: bold;
  }
`

export default ApplicationState
