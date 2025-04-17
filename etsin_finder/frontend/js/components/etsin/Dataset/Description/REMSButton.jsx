import PropTypes from 'prop-types'
import React from 'react'
import { observer } from 'mobx-react'

import Button from '@/components/etsin/general/button'
import Loader from '@/components/general/loader'
import { useStores } from '@/stores/stores'
import etsinTheme from '@/styles/theme'
import Translate from '@/utils/Translate'

const REMSButton = props => {
  const {
    Locale: { translate },
    Auth: { userLogged },
  } = useStores()

  let wrapperTitle
  let buttonContent = 'dataset.access_permission'
  let buttonId = 'rems-button'
  let buttonColor = etsinTheme.color.primary
  let disabled = false

  let state = props.applicationState
  if (!userLogged) {
    disabled = true
    wrapperTitle = 'dataset.access_login'
    state = 'not_rems_user'
  }

  switch (state) {
    case 'apply':
      buttonId = 'rems-button-apply'
      break
    case 'draft':
      buttonId = 'rems-button-draft'
      buttonContent = 'dataset.access_draft'
      buttonColor = 'yellow'
      break
    case 'submitted':
      buttonId = 'rems-button-submitted'
      buttonContent = 'dataset.access_request_sent'
      buttonColor = 'yellow'
      break
    case 'approved':
      buttonId = 'rems-button-approved'
      buttonContent = 'dataset.access_granted'
      buttonColor = etsinTheme.color.success
      break
    case 'rejected':
      buttonId = 'rems-button-rejected'
      buttonContent = 'dataset.access_denied'
      buttonColor = etsinTheme.color.error
      break
    case 'disabled':
      disabled = true
      buttonId = 'rems-button-error'
      wrapperTitle = 'dataset.access_unavailable'
      break
    default:
      break
  }

  const button = (
    <Button
      id={buttonId}
      data-testid="rems-button"
      onClick={props.onClick}
      disabled={disabled}
      color={buttonColor}
      noMargin
    >
      {props.loading ? (
        <>
          <Translate content={buttonContent} />
          <Loader color="white" active size="1.2em" />
        </>
      ) : (
        <Translate content={buttonContent} />
      )}
    </Button>
  )
  if (wrapperTitle) {
    return (
      <div aria-hidden="true" title={translate(wrapperTitle)}>
        {button}
      </div>
    )
  }
  return button
}

REMSButton.propTypes = {
  applicationState: PropTypes.string,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
}

REMSButton.defaultProps = {
  loading: false,
  onClick: undefined,
  applicationState: undefined,
}

export default observer(REMSButton)
