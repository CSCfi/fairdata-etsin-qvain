import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormContainer } from '../../../general/form'
import TabInput from '../../../general/translationTabInput'
import TranslationTab from '../../../general/translationTab'
import PeriodOfTimePicker from './PeriodOfTimePicker'
import LocationInput from './locationInput'
import ModalReferenceInput from '../../../general/modalReferenceInput'
import { Outcome } from '../../../../../stores/view/qvain.provenances'
import UsedEntityInput from './usedEntityInput'

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
        <PeriodOfTimePicker />
        <LocationInput />
        <ModalReferenceInput {...this.props} datum="outcome" metaxIdentifier="event_outcome" model={Outcome} />
        <UsedEntityInput />
      </FormContainer>
    )
  }
}
export default Form
