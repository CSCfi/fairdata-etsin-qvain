import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import {
  faBuilding,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ContainerSubsectionBottom } from '../general/card';
import {
  ButtonGroup,
  ButtonLabel,
  EditButton,
  DeleteButton,
  ButtonContainer
} from '../general/buttons'
import { EntityType, EmptyActor } from '../../../stores/view/qvain'

export class AddedActorsBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  handleEditActor = (actor) => (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.editActor(actor)
  }

  handleRemoveActor = (actor) => (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.removeActor(actor)
    this.props.Stores.Qvain.editActor(EmptyActor)
  }

  getAddedActorName = (name, lang) => {
    if (typeof name === 'object' && name !== null) {
      if (lang in name) {
        return name[lang]
      }
      if ('und' in name) {
        return name.und
      }
      const langX = Object.keys(name)[0]
      return name[langX]
    }
    return name
  }

  render() {
    const { lang } = this.props.Stores.Locale
    return (
      <ContainerSubsectionBottom>
        <Translate
          tabIndex="0"
          component="h3"
          content="qvain.actors.added.title"
        />
        {this.props.Stores.Qvain.addedActors.length === 0 &&
          (<Translate tabIndex="0" component="p" content="qvain.actors.added.noneAddedNotice" />)
        }
        {this.props.Stores.Qvain.addedActors.map((addedActor) => (
          <ButtonGroup tabIndex="0" key={addedActor.uiId}>
            <ButtonLabel>
              <FontAwesomeIcon icon={addedActor.type === EntityType.PERSON ? faUser : faBuilding} style={{ marginRight: '8px' }} />
              {this.getAddedActorName(addedActor.name, lang)}{addedActor.role.map(role => (` / ${ role }`))}
            </ButtonLabel>
            <ButtonContainer>
              <EditButton aria-label="Edit" onClick={this.handleEditActor(addedActor)} />
              <DeleteButton aria-label="Remove" onClick={this.handleRemoveActor(addedActor)} />
            </ButtonContainer>
          </ButtonGroup>
        ))}
      </ContainerSubsectionBottom>
    );
  }
}

export default inject('Stores')(observer(AddedActorsBase));
