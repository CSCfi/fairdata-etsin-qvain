import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import AddedActors from './addedActors'
import ActorTypeSelect from './actorTypeSelect'
import SelectedActor from './actorSelection'
import ActorInfo from './actorInfo'
import { SectionTitle } from '../general/section'
import { ContainerLight, ContainerSubsection } from '../general/card'
import Tooltip from '../general/tooltip'
import { HelpIcon } from '../general/form'
import ActorsInfoTooltip from './actorsInfoTooltip'

export class ActorsBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    tooltipOpen: false,
  }

  render() {
    const actor = this.props.Stores.Qvain.actorInEdit
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
        <ContainerLight>
          <ContainerSubsection>
            <h3>
              <Translate content="qvain.actors.add.title" /> *
            </h3>
            <Translate component="p" content="qvain.actors.add.help" />
            <ActorTypeSelect />
            {actor.type !== undefined && <SelectedActor />}
            {actor.type !== undefined && <ActorInfo />}
          </ContainerSubsection>
          <AddedActors />
        </ContainerLight>
      </div>
    )
  }
}

export default inject('Stores')(observer(ActorsBase))
