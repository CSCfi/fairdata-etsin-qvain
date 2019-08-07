import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import styled from 'styled-components';
import Translate from 'react-translate-component'

export class SelectedActorBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  render() {
    const actor = this.props.Stores.Qvain.actorInEdit
    return (
      <ActorSelection>
        <ActorEntityType>
          <Translate content={`qvain.actors.add.radio.${actor.type.toLowerCase()}`} />
        </ActorEntityType>
        {actor.role.map(role => (
          <React.Fragment key={role}>
            <span> / </span>
            <Translate content={`qvain.actors.add.checkbox.${role.toLowerCase()}`} />
          </React.Fragment>
        ))}
      </ActorSelection>
    )
  }
}

export const ActorSelection = styled.div`
  width: 100%;
  border-radius: 4px;
  padding: 5px 17px;
  background-color: #f9f9f9;
  margin-bottom: 20px;
`

const ActorEntityType = styled.span`
  font-weight: 800;
`;

export default inject('Stores')(observer(SelectedActorBase))
