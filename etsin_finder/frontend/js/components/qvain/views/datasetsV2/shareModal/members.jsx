import React from 'react'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Loader from '../../../../general/loader'
import { useStores } from '../../../utils/stores'
import { Dropdown, DropdownItem } from '../../../../general/dropdown'

const getPersonLabel = ({ name, uid, email }) => `${name} (${uid}, ${email})`

const getRoleKey = role => `qvain.datasets.share.members.roles.${role}`

const RoleOptions = ({ activeRole }) => {
  const roles = [activeRole]

  return roles.map(role => (
    <DropdownItem key={role}>
      <RoleMenuItem>
        <Translate content={getRoleKey(role)} />
        {activeRole === role && <Check icon={faCheck} />}
      </RoleMenuItem>
    </DropdownItem>
  ))
}

const RoleMenuItem = styled.div`
  min-width: 5em;
  display: flex;
  justify-content: space-between;
`

const Check = styled(FontAwesomeIcon).attrs({ icon: faCheck })`
  color: ${p => p.theme.color.success};
  margin-left: 1rem;
`

export const Members = () => {
  const {
    QvainDatasetsV2: {
      share: { userPermissions, isLoadingPermissions },
    },
  } = useStores()

  const projectMembers = userPermissions.filter(user => user.isProjectMember)

  const permissionMembers = userPermissions.filter(user => user.role)

  if (isLoadingPermissions) {
    return (
      <LoaderWrapper>
        <Loader active size="6rem " />
      </LoaderWrapper>
    )
  }

  return (
    <>
      <Label>
        <Translate content="qvain.datasets.share.members.labels.permissions" />
        {` (${permissionMembers.length})`}
      </Label>
      <UserList className="permission-users">
        {permissionMembers.map(user => (
          <User key={user.uid}>
            <Name>{getPersonLabel(user)}</Name>
            {user.role === 'owner' ? (
              <Translate component={Role} content={getRoleKey(user.role)} />
            ) : (
              <Dropdown buttonComponent={RoleButton} buttonContent={getRoleKey(user.role)}>
                <RoleOptions activeRole={user.role} />
                <Translate
                  component={DropdownItem}
                  content="qvain.datasets.share.members.remove"
                  border="top"
                />
              </Dropdown>
            )}
          </User>
        ))}
      </UserList>
      {projectMembers.length > 0 && (
        <>
          <Label>
            <Translate content="qvain.datasets.share.members.labels.projectMembers" />
            {` (${projectMembers.length})`}
          </Label>
          <UserList className="project-member-users">
            {projectMembers.map(user => (
              <User key={user.uid}>
                <Name>{getPersonLabel(user)}</Name>
              </User>
            ))}
          </UserList>
        </>
      )}
    </>
  )
}

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`

const User = styled.li.attrs({ className: 'member-user' })`
  display: flex;
  flex-wrap: nowrap;
  margin: 0.5rem 0;
  align-items: center;
`

const UserList = styled.ul``

const Name = styled.span.attrs({ className: 'member-name' })`
  flex-grow: 1;
`

const Role = styled.div.attrs({ className: 'member-role' })`
  min-width: 7rem;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  height: 2rem;
  padding: 0.25rem 1rem;
  margin: -0.5rem 0;
  color: inherit;
`

const RoleButton = styled(Role).attrs({ as: 'button', type: 'button' })`
  cursor: pointer;
`

const Label = styled.label`
  display: block;
  font-weight: bold;
  font-size: 18px;
  margin: 1.5rem 0 0.5rem;
`

export default observer(Members)
