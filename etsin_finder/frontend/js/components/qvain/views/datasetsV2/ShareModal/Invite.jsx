import React from 'react'
import { observer } from 'mobx-react'
import Select from 'react-select/async'
import PropTypes from 'prop-types'
import { components } from 'react-select'
import { toJS } from 'mobx'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { useStores } from '../../../utils/stores'
import Button from '../../../../general/button'
import Loader from '../../../../general/loader'
import getPersonLabel from './getPersonLabel'

const LoadingMessage = props => (
  <components.LoadingMessage {...props}>
    <Translate content="qvain.datasets.share.invite.users.searching" />
  </components.LoadingMessage>
)

const NoOptionsMessage = props => {
  const content =
    props.selectProps.inputValue.trim().length > 1
      ? 'qvain.datasets.share.invite.users.empty'
      : 'qvain.datasets.share.invite.users.help'
  return <Translate component={components.NoOptionsMessage} content={content} {...props} />
}

const SearchError = props => (
  <components.NoOptionsMessage {...props}>
    <Translate component={StyledError} content="qvain.datasets.share.invite.users.searchError" />
  </components.NoOptionsMessage>
)

NoOptionsMessage.propTypes = {
  selectProps: PropTypes.object.isRequired,
}

const Control = ({ theme, ...props }) => (
  <components.Control theme={{ ...theme, borderRadius: 0 }} {...props} />
)

Control.propTypes = {
  theme: PropTypes.object.isRequired,
}

const Invite = () => {
  const {
    QvainDatasets: {
      share: {
        searchUsers,
        selectedUsers,
        setSelectedUsers,
        setInviteMessage,
        inviteMessage,
        searchError,
        sendInvite,
        isInviting,
        userPermissions,
      },
    },
  } = useStores()

  const fetchOptions = async str => {
    let trimmed = str.trim()
    if (trimmed.length <= 1) {
      trimmed = ''
    }
    const opts = await searchUsers(trimmed)
    return toJS(opts)
  }

  const setSelected = users => {
    setSelectedUsers(users)
  }

  const customComponents = {
    NoOptionsMessage: searchError ? SearchError : NoOptionsMessage,
    Control,
    LoadingMessage,
  }

  const existingUsers = new Set(userPermissions.filter(user => user.role).map(user => user.uid))

  return (
    <Container>
      <Translate
        component={Label}
        htmlFor="search-users-input"
        content="qvain.datasets.share.invite.users.label"
      />
      <SearchRow>
        <Translate
          inputId="search-users-input"
          component={Select}
          styles={{
            container: provided => ({ ...provided, flexGrow: 1 }),
            multiValueLabel: provided => ({ ...provided, whiteSpace: 'normal' }),
          }}
          value={toJS(selectedUsers)}
          loadOptions={fetchOptions}
          getOptionLabel={person => getPersonLabel(person)}
          getOptionValue={person => person.uid}
          isOptionDisabled={option => existingUsers.has(option.uid)}
          isMulti
          components={customComponents}
          onChange={setSelected}
          menuPlacement="auto"
          menuPosition="fixed"
          menuShouldScrollIntoView={false}
          attributes={{ placeholder: 'qvain.datasets.share.invite.users.placeholder' }}
        />
        <Translate component={Role} content="qvain.datasets.share.invite.roles.editor" />
      </SearchRow>
      <Translate
        component={Label}
        htmlFor="invite-message-input"
        content="qvain.datasets.share.invite.message.label"
      />

      <Translate
        id="invite-message-input"
        component={Message}
        value={inviteMessage}
        onChange={e => setInviteMessage(e.target.value)}
        disabled={selectedUsers.length === 0}
        attributes={{ placeholder: 'qvain.datasets.share.invite.message.placeholder' }}
      />
      <InviteButton disabled={selectedUsers.length === 0 || isInviting} onClick={sendInvite}>
        <Translate content="qvain.datasets.share.invite.button" />
        {isInviting && (
          <LoaderWrapper>
            <Loader active size="12pt" spinnerSize="0.15em" />
          </LoaderWrapper>
        )}
      </InviteButton>
    </Container>
  )
}

const InviteButton = styled(Button).attrs({ role: 'button', className: 'send-invite' })`
  margin: 1.5rem 0 0 0;
  align-self: end;
  width: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const LoaderWrapper = styled.div`
  margin: 0 0 0 0.5rem;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

const StyledError = styled.div`
  color: ${p => p.theme.color.error};
  margin-top: 0.25rem;
`

const Label = styled.label`
  display: block;
  font-weight: bold;
  font-size: 18px;
  margin: 1.5rem 0 0.5rem;
`

const SearchRow = styled.div`
  display: flex;
  justify-content: stretch;
  align-items: center;
`

const Role = styled.div`
  font-weight: bold;
  margin-left: 1rem;
  flex-shrink: 0;
`

const Message = styled.textarea`
  width: 100%;
  resize: vertical;
  height: 5em;
  flex-grow: 1;
  border-color: ${p => p.theme.color.medgray};
  border-radius: 0;
  padding: 0.5rem;
`

export default observer(Invite)
