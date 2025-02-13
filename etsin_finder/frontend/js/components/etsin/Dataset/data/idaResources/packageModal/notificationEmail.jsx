import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import { Input } from '@/components/etsin/general/Input'
import FlaggedComponent from '@/components/general/flaggedComponent'

const NotificationEmail = ({ Packages }) => (
  <FlaggedComponent flag="DOWNLOAD_API_V2.EMAIL.FRONTEND">
    <p>
      <Translate component={EmailText} content="dataset.dl.packages.modal.additionalEmail" />
      <Translate
        component={EmailInput}
        type="text"
        attributes={{ placeholder: 'dataset.dl.packages.modal.emailPlaceholder' }}
        onChange={e => Packages.Notifications.setEmail(e.target.value)}
        onBlur={() => Packages.Notifications.validateEmail()}
        value={Packages.Notifications.email}
      />
      {Packages.Notifications.emailError && (
        <Translate content={Packages.Notifications.emailError} component={ErrorText} />
      )}
    </p>
  </FlaggedComponent>
)

NotificationEmail.propTypes = {
  Packages: PropTypes.object.isRequired,
}

const ErrorText = styled.p`
  color: ${props => props.theme.color.error};
`

const EmailInput = styled(Input)`
  height: 2em;
  padding: 0.5em;
`

const EmailText = styled.span`
  margin-right: 0.5em;
`

export default observer(NotificationEmail)
