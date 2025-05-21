import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { useStores } from '../../../utils/stores'
import Button from '../../../../general/button'
import getPersonLabel from './getPersonLabel'

const InviteResults = () => {
  const {
    QvainDatasets: {
      share: { inviteSuccessUsers, inviteFailUsers, requestCloseModal },
    },
  } = useStores()
  return (
    <>
      {inviteSuccessUsers.length > 0 && (
        <>
          <Translate component={Label} content="qvain.datasets.share.invite.results.success" />
          <ul className="success-users">
            {inviteSuccessUsers.map(user => (
              <li key={user.uid}>{getPersonLabel(user)}</li>
            ))}
          </ul>
        </>
      )}

      {inviteFailUsers.length > 0 && (
        <>
          <Translate component={Label} content="qvain.datasets.share.invite.results.fail" />
          <ul className="fail-users">
            {inviteFailUsers.map(user => (
              <li key={user.uid}>{getPersonLabel(user)}</li>
            ))}
          </ul>
        </>
      )}
      <InviteButton onClick={requestCloseModal}>
        <Translate content="qvain.datasets.share.invite.results.close" />
      </InviteButton>
    </>
  )
}

const InviteButton = styled(Button).attrs({ role: 'button', className: 'send-invite' })`
  margin: 1.5rem 0 0 0;
  align-self: end;
  width: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
`

const Label = styled.h3`
  display: block;
  font-weight: bold;
  font-size: 18px;
  margin: 1.5rem 0 0.5rem;
`

export default observer(InviteResults)
