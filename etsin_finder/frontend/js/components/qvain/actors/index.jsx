import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import styled from 'styled-components'

import AddedActors from './addedActors'
import { SectionTitle } from '../general/section'
import { Container } from '../general/card'
import Tooltip from '../general/tooltip'
import { HelpIcon } from '../general/form'
import ActorsInfoTooltip from './actorsInfoTooltip'
import ActorModal from './actorModal'
import Button from '../../general/button'
import { Actor } from '../../../stores/view/qvain.actors'

export class ActorsBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    tooltipOpen: false,
  }

  createActor = () => {
    const { editActor } = this.props.Stores.Qvain.Actors
    editActor(Actor())
  }

  render() {
    const { readonly } = this.props.Stores.Qvain
    return (
      <div className="container">
        <SectionTitle>
          <Translate content="qvain.actors.title" />
          <Tooltip
            isOpen={this.state.tooltipOpen}
            close={() => this.setState(prevState => ({ tooltipOpen: !prevState.tooltipOpen }))}
            align="Right"
            text={<ActorsInfoTooltip />}
          >
            <HelpIcon
              aria-label={translate('qvain.actors.infoTitle')}
              onClick={() => this.setState(prevState => ({ tooltipOpen: !prevState.tooltipOpen }))}
            />
          </Tooltip>
        </SectionTitle>
        <ActorModal />
        <Container>
          <AddedActors />
          <ButtonContainer>
            <AddNewButton type="button" onClick={() => this.createActor()} disabled={readonly}>
              <Translate content="qvain.actors.addButton" />
            </AddNewButton>
          </ButtonContainer>
        </Container>
      </div>
    )
  }
}

const ButtonContainer = styled.div`
  text-align: right;
`
const AddNewButton = styled(Button)`
  margin: 0;
  margin-top: 11px;
`

export default inject('Stores')(observer(ActorsBase))
