import React, { useState } from 'react'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Loader from '../../../../general/loader'
import { useStores } from '../../../utils/stores'
import { Dropdown, DropdownItem } from '../../../../general/dropdown'
import { HelpIcon } from '../../../../general/form'
import Tooltip from '../../../general/V2/Tooltip'
import getPersonLabel from './getPersonLabel'

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
    QvainDatasets: {
      share: {
        userPermissions,
        project,
        requestRemoveUserPermission,
        isUpdatingUserPermission,
        permissionChangeError,
      },
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
            requestRemoveUserPermission(user)
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
          <ProjectLabelRow>
            <div>
              <Translate
                content="qvain.datasets.share.members.labels.projectMembers"
                with={{ project }}
              />
              {` (${projectMembers.length})`}
            </div>
            <ProjectHelp />
          </ProjectLabelRow>
          <UserList className="project-member-users">
            {projectMembers.map(user => (
              <User key={user.uid}>
                <Name>{getPersonLabel(user)}</Name>
              </User>
            ))}
          </UserList>
        </>
      )}
      {permissionChangeError && (
        <Translate component={Error} content="qvain.datasets.share.members.updateError" />
      )}
    </>
  )
}

const ProjectHelp = () => {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  return (
    <TooltipWrapper>
      <Tooltip
        isOpen={tooltipOpen}
        close={() => setTooltipOpen(false)}
        align="Right"
        text={<Translate content={'qvain.datasets.share.members.projectHelp'} />}
        fixed
      >
        <Translate
          onClick={() => setTooltipOpen(true)}
          component={HelpIcon}
          attributes={{ 'aria-label': 'qvain.datasets.share.members.projectHelpLabel' }}
        />
      </Tooltip>
    </TooltipWrapper>
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

const Label = styled.div`
  display: block;
  font-weight: bold;
  font-size: 18px;
  margin: 1.5rem 0 0.5rem;
`

const TooltipWrapper = styled.span`
  margin-left: 1em;
`

const ProjectLabelRow = styled(Label)`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`

export default observer(Members)
