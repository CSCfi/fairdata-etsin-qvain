import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import translate from 'counterpart'
import Translate from 'react-translate-component'
import styled from 'styled-components'
import counterpart from 'counterpart'

import {
  ButtonGroup,
  ButtonLabel,
  EditButton,
  DeleteButton,
  ButtonContainer
} from '../general/buttons'
import { getActorName, ActorIcon } from './common'
import Tooltip from '../../general/tooltipHover'
import { LabelLarge } from '../general/form'

export class AddedActorsBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  handleEditActor = (actor) => (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.Actors.editActor(actor)
  }

  handleRemoveActor = (actor) => (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.Actors.removeActor(actor)
  }

  render() {
    const { lang } = this.props.Stores.Locale
    const { readonly } = this.props.Stores.Qvain
    const { actors } = this.props.Stores.Qvain.Actors
    return (
      <>
        <LabelLarge tabIndex="0">
          <Tooltip
            title={counterpart('qvain.description.fieldHelpTexts.requiredToPublish', { locale: lang })}
            position="right"
          >
            <Translate content="qvain.actors.added.title" /> *
          </Tooltip>
        </LabelLarge>
        <Translate component="p" content="qvain.actors.add.help" />
        {actors.length === 0 &&
          (<Translate tabIndex="0" component="p" content="qvain.actors.added.noneAddedNotice" />)
        }
        {actors.map((addedActor) => (
          <ButtonGroup tabIndex="0" key={addedActor.uiid}>
            <ActorLabel>
              <ActorIcon actor={addedActor} style={{ marginRight: '8px' }} />
              {getActorName(addedActor, lang)}{addedActor.roles.map(role => (` / ${translate(`qvain.actors.add.checkbox.${role}`)}`))}
            </ActorLabel>
            <ButtonContainer>
              <Translate
                component={EditButton}
                onClick={this.handleEditActor(addedActor)}
                attributes={{ 'aria-label': 'qvain.general.buttons.edit' }}
              />
              {!readonly && (
                <Translate
                  component={DeleteButton}
                  onClick={this.handleRemoveActor(addedActor)}
                  attributes={{ 'aria-label': 'qvain.general.buttons.remove' }}
                />
              )}
            </ButtonContainer>
          </ButtonGroup>
        ))}
      </>

    );
  }
}

const ActorLabel = styled(ButtonLabel)`
  white-space: normal;
  overflow: hidden;
  height: auto;
  word-break: break-word;
`

export default inject('Stores')(observer(AddedActorsBase));
