import React from 'react'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Loader from '../../../../general/loader'
import { useStores } from '../../../utils/stores'
import { Dropdown, DropdownItem } from '../../../../general/dropdown'

const joinParts = parts => {
  const nonEmptyParts = parts.filter(p => p)
  let joined = nonEmptyParts.splice(0, 1)
  if (nonEmptyParts.length > 0) {
    joined += ` (${nonEmptyParts.join(', ')})`
  }
  return joined
}

const getPersonLabel = ({ name, uid, email }) => joinParts([name, uid, email])

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
      share: { userPermissions, project, removeUserPermission, isUpdatingUserPermission, permissionChangeError },
    },
  } = useStores()

  const projectMembers = userPermissions.filter(user => user.isProjectMember)

  const permissionMembers = userPermissions.filter(user => user.role)

  const userRoleButton = user => {
    if (isUpdatingUserPermission(user)) {
      return (
        <Role>
          <Translate content={getRoleKey(user.role)} />
          <RoleLoaderWrapper>
            <Loader active size="12pt" spinnerSize="0.15em" />
          </RoleLoaderWrapper>
        </Role>
      )
    }
    if (user.role === 'creator') {
      return <Translate component={Role} content={getRoleKey(user.role)} />
    }
    return (
      <Dropdown buttonComponent={RoleButton} buttonContent={getRoleKey(user.role)}>
        <RoleOptions activeRole={user.role} />
        <Translate
          component={DropdownItem}
          content="qvain.datasets.share.members.remove"
          border="top"
          onClick={() => {
            removeUserPermission(user)
          }}
        />
      </Dropdown>
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
            {userRoleButton(user)}
          </User>
        ))}
      </UserList>
      {projectMembers.length > 0 && (
        <>
          <Label>
            <Translate
              content="qvain.datasets.share.members.labels.projectMembers"
              with={{ project }}
            />
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
      { permissionChangeError  && <Translate component={Error} content="qvain.datasets.share.members.updateError" /> }

    </>
  )
}

const RoleLoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 0;
  width: 0.625em;
  margin-right: 0.5rem;
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
  min-width: 7.5rem;
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

const Error = styled.div`
  color: ${p => p.theme.color.error};
  margin-top: 0.25rem;
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
