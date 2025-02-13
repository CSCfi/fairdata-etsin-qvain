import React from 'react'
import Translate from '@/utils/Translate'

import Button from '@/components/etsin/general/button'
import etsinTheme from '@/styles/theme'
import Loader from '@/components/general/loader'
import { useStores } from '@/stores/stores'

const REMSButton = props => {
  const {
    Locale: { translate },
  } = useStores()
  let button
  switch (props.applicationState) {
    case 'apply':
      button = (
        <Button id="rems-button-apply" onClick={props.onClick} noMargin>
          {props.loading ? (
            <>
              <Translate content="dataset.access_permission" />
              <Loader color="white" active size="1.2em" />
            </>
          ) : (
            <Translate content="dataset.access_permission" />
          )}
        </Button>
      )
      break
    case 'draft':
      button = (
        <Button id="rems-button-draft" onClick={props.onClick} color="yellow" noMargin>
          {props.loading ? (
            <>
              <Translate content="dataset.access_draft" />
              <Loader color="white" active size="1.2em" />
            </>
          ) : (
            <Translate content="dataset.access_draft" />
          )}
        </Button>
      )
      break
    case 'submitted':
      button = (
        <Button id="rems-button-submitted" onClick={props.onClick} color="yellow" noMargin>
          {props.loading ? (
            <>
              <Translate content="dataset.access_request_sent" />
              <Loader color="white" active size="1.2em" />
            </>
          ) : (
            <Translate content="dataset.access_request_sent" />
          )}
        </Button>
      )
      break
    case 'approved':
      button = (
        <Button
          id="rems-button-approved"
          onClick={props.onClick}
          color={etsinTheme.color.success}
          noMargin
        >
          {props.loading ? (
            <>
              <Translate content="dataset.access_granted" />
              <Loader color="white" active size="1.2em" />
            </>
          ) : (
            <Translate content="dataset.access_granted" />
          )}
        </Button>
      )
      break
    case 'rejected':
      button = (
        <Button
          id="rems-button-rejected"
          onClick={props.onClick}
          color={etsinTheme.color.error}
          noMargin
        >
          {props.loading ? (
            <>
              <Translate content="dataset.access_denied" />
              <Loader color="white" active size="1.2em" />
            </>
          ) : (
            <Translate content="dataset.access_denied" />
          )}
        </Button>
      )
      break
    case 'disabled':
      button = (
        <div aria-hidden="true" title={translate('dataset.access_unavailable')}>
          <Button id="rems-button-error" disabled noMargin>
            {props.loading ? (
              <>
                <Translate content="dataset.access_permission" />
                <Loader color="white" active size="1.2em" />
              </>
            ) : (
              <Translate content="dataset.access_permission" />
            )}
          </Button>
        </div>
      )
      break
    default:
      button = (
        <Button onClick={props.onClick} color={etsinTheme.color.primary} noMargin>
          {props.loading ? (
            <>
              <Translate content="dataset.access_permission" />
              <Loader color="white" active size="1.2em" />
            </>
          ) : (
            <Translate content="dataset.access_permission" />
          )}
        </Button>
      )
      break
  }
  return button
}

export default REMSButton
