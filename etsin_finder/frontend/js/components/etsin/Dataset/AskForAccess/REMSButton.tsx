import { observer } from 'mobx-react'

import Loader from '@/components/general/Loader'
import { useStores } from '@/stores/stores'
import type { TranslationKey } from '@/stores/view/locale'
import etsinTheme from '@/styles/theme'
import Translate from '@/utils/Translate'
import Button from '@/components/general/Button'

interface REMSButtonProps {
  applicationState?: string | null
  onClick?: () => void
  loading?: boolean
}

const REMSButton = ({ applicationState, onClick, loading = false }: REMSButtonProps) => {
  const {
    Locale: { translate },
    Auth: { isAuthenticated },
    Etsin: {
      EtsinDataset: { isRemoved, isDraft, isDeprecated },
    },
  } = useStores()

  let wrapperTitle: TranslationKey | undefined
  let buttonContent: TranslationKey = 'dataset.access_permission'
  let buttonId = 'rems-button'
  let buttonColor = etsinTheme.color.primary
  let disabled = isRemoved || isDraft || isDeprecated

  let state = applicationState
  if (!isAuthenticated) {
    disabled = true
    wrapperTitle = 'dataset.access_states.require_login'
    state = 'not_rems_user'
  }

  switch (state) {
    case 'apply':
      buttonId = 'rems-button-apply'
      break
    case 'draft':
      buttonId = 'rems-button-draft'
      buttonContent = 'dataset.access_states.application_draft'
      buttonColor = 'yellow'
      break
    case 'returned':
      buttonId = 'rems-button-draft'
      buttonContent = 'dataset.access_states.application_returned'
      buttonColor = etsinTheme.color.error
      break
    case 'submitted':
      buttonId = 'rems-button-submitted'
      buttonContent = 'dataset.access_states.application_submitted'
      buttonColor = 'yellow'
      break
    case 'approved':
      buttonId = 'rems-button-approved'
      buttonContent = 'dataset.access_states.access_granted'
      buttonColor = etsinTheme.color.success
      break
    case 'rejected':
      buttonId = 'rems-button-rejected'
      buttonContent = 'dataset.access_states.access_denied'
      buttonColor = etsinTheme.color.error
      break
    case 'disabled':
      disabled = true
      buttonId = 'rems-button-error'
      wrapperTitle = 'dataset.access_states.access_unavailable'
      break
    default:
      break
  }

  const button = (
    <Button
      id={buttonId}
      data-testid="rems-button"
      onClick={onClick}
      disabled={disabled}
      color={buttonColor}
      minWidth="10.5em"
      noMargin
    >
      {loading ? (
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

export default observer(REMSButton)
