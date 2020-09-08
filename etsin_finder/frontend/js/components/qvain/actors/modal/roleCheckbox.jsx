import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { FormField, Checkbox, Label, HelpField } from '../../general/form'

const RoleCheckbox = ({ Stores, role, help, disabled }) => {
  const { readonly } = Stores.Qvain
  const { actorInEdit: actor, updateActor } = Stores.Qvain.Actors

  const handleChangeRole = event => {
    const roles = event.target.checked
      ? [...actor.roles, role]
      : actor.roles.filter(r => r !== role)
    updateActor(actor, { roles })
  }

  const id = `role-${role}`
  const helpField = help && <RoleHelpField>{help}</RoleHelpField>
  const label = `qvain.actors.add.checkbox.${role}`
  return (
    <ListItem disabled={readonly || disabled}>
      <FormField>
        <Checkbox
          disabled={readonly || disabled}
          onChange={handleChangeRole}
          id={id}
          type="checkbox"
          value={role}
          checked={actor.roles.includes(role)}
        />
        <Label htmlFor={id}>
          <Translate content={label} />
          {helpField}
        </Label>
      </FormField>
    </ListItem>
  )
}

RoleCheckbox.propTypes = {
  Stores: PropTypes.object.isRequired,
  role: PropTypes.string.isRequired,
  help: PropTypes.string,
  disabled: PropTypes.bool,
}

RoleCheckbox.defaultProps = {
  help: null,
  disabled: null,
}

const RoleHelpField = styled(HelpField)`
  margin-left: 0.5em;
`

export const ListItem = styled.li`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: no-wrap;
  color: ${props => (props.disabled ? 'grey' : 'inherit')};
`

export default inject('Stores')(observer(RoleCheckbox))
