import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormContainer } from '../../../general/form'
import TabInput from '../../../general/translationTabInput'
import TranslationTab from '../../../general/translationTab'
import PeriodOfTimePicker from './PeriodOfTimePicker'
import LocationInput from './locationInput'
import ModalReferenceInput from '../../../general/modalReferenceInput'
import { Outcome, Lifecycle } from '../../../../../stores/view/qvain.provenances'
import Separator from '../../../general/modalSeparator'
import UsedEntityInput from './usedEntityInput'
import ActorsInput from './actorsInput'

class Form extends Component {
  static propTypes = {
    Store: PropTypes.object.isRequired,
    Field: PropTypes.object.isRequired,
    translationsRoot: PropTypes.string.isRequired
  }

  state = {
    language: 'fi'
  }

  setLanguage = (lang) => {
    this.setState({ language: lang })
  }

  render = () => {
    const { language } = this.state

    return (
      <FormContainer>
        <TranslationTab language={language} setLanguage={this.setLanguage}>
          <TabInput {...this.props} datum="name" language={language} />
          <TabInput {...this.props} datum="description" language={language} />
          <TabInput {...this.props} datum="outcomeDescription" language={language} />
        </TranslationTab>
        <Separator />
        <PeriodOfTimePicker />
        <LocationInput />
        <Separator />
        <ModalReferenceInput
          {...this.props}
          datum="outcome"
          metaxIdentifier="event_outcome"
          model={Outcome}
        />
        <Separator />
        <UsedEntityInput />
        <Separator />
        <ActorsInput {...this.props} datum="actors" language={language} />
        <Separator />
        <ModalReferenceInput
          {...this.props}
          datum="lifecycle"
          metaxIdentifier="lifecycle_event"
          model={Lifecycle}
        />
      </FormContainer>
    )
  }
}


export default Form
