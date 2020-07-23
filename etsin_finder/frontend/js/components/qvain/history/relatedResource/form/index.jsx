import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TranslationTab from '../../../general/translationTab'
import TabInput from '../../../general/translationTabInput'
import { FormContainer } from '../../../general/form'
import ModalInput from '../../../general/modalInput'
import ModalReferenceInput from '../../../general/modalReferenceInput'
import { RelationType } from '../../../../../stores/view/qvain.relatedResources'

class Form extends Component {
  static propTypes = {
    Field: PropTypes.object.isRequired,
    translationsRoot: PropTypes.string.isRequired,
  }

  state = {
    language: 'fi'
  }

setLanguage = (lang) => {
    this.setState({ language: lang })
}

render = () => (
  <FormContainer>
    <TranslationTab language={this.state.language} setLanguage={this.setLanguage}>
      <TabInput {...this.props} datum="name" language={this.state.language} isRequired />
      <TabInput {...this.props} datum="description" language={this.state.language} />
    </TranslationTab>
    <ModalInput {...this.props} datum="identifier" />
    <ModalReferenceInput {...this.props} datum="relationType" metaxIdentifier="relation_type" model={RelationType} />
    <ModalReferenceInput {...this.props} datum="entityType" metaxIdentifier="resource_type" model={RelationType} />
  </FormContainer>
  )
}

export default Form
