import { observer } from 'mobx-react'

import Button from '@/components/etsin/general/button'
import { NarrowTextArea } from '@/components/qvain/general/V3'
import { useStores } from '@/stores/stores'
import { ApplicationSection } from './styled'

const getActions = application => {
  const reviewAction = { key: 'review', label: 'qvain.applications.actions.approveOrReject' }
  const closeAction = { key: 'close', label: 'qvain.applications.actions.close' }

  const state = application['application/state']
  switch (state) {
    case 'application.state/approved':
      return [closeAction]
    case 'application.state/submitted':
      return [reviewAction, closeAction] // TODO: implement returnAction
  }
  return []
}

const ApplicationActions = observer(() => {
  const {
    Locale: { translate },
    Qvain: {
      REMSApplications: {
        selectedAction,
        setSelectedAction,
        commentText,
        setCommentText,
        approveApplication,
        rejectApplication,
        closeApplication,
        selectedApplication,
      },
    },
  } = useStores()

  let actionDetails = null
  if (selectedAction) {
    const cancelButton = <Button onClick={() => setSelectedAction(null)}>Cancel</Button>
    const commentForm = (
      <>
        <label htmlFor="application-comment">
          {translate('qvain.applications.actions.comment')}
        </label>
        <NarrowTextArea
          id="application-comment"
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
        />
      </>
    )

    if (selectedAction === 'review') {
      actionDetails = (
        <div>
          <h4>{translate('qvain.applications.actions.approveOrRejectLong')}</h4>
          {commentForm}
          {cancelButton}
          <Button color="error" onClick={rejectApplication}>
            {translate('qvain.applications.actions.reject')}
          </Button>
          <Button color="success" onClick={approveApplication}>
            {translate('qvain.applications.actions.approve')}
          </Button>
        </div>
      )
    } else if (selectedAction === 'close') {
      actionDetails = (
        <div>
          <h4>{translate('qvain.applications.actions.close')}</h4>
          {commentForm}
          {cancelButton}
          <Button color="error" onClick={closeApplication}>
            {translate('qvain.applications.actions.close')}
          </Button>
        </div>
      )
    }
  }

  const actions = getActions(selectedApplication)
  if (actions.length === 0) {
    return null
  }

  return (
    <ApplicationSection>
      <h3>{translate('qvain.applications.actions.title')}</h3>
      {actions.map(action => (
        <Button key={action.key} onClick={() => setSelectedAction(action.key)}>
          {translate(action.label)}
        </Button>
      ))}
      {actionDetails}
    </ApplicationSection>
  )
})

export default ApplicationActions
