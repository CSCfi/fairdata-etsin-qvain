import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import { Input, Label } from '../../../general/form'
import ValidationError from '../../../general/validationError'


class ProvenanceInput extends Component {
    static propTypes = {
        Stores: PropTypes.object.isRequired,
        datum: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        handleBlur: PropTypes.func,
        error: PropTypes.string.isRequired,
        isRequired: PropTypes.bool,
        language: PropTypes.string
    }

    static defaultProps = {
      isRequired: false,
      handleBlur: () => {},
      language: ''
    }

    translations = (datum, language) => (language
    ? {
      label: `qvain.history.provenance.modal.${datum}Input.${language}.label`,
      placeholder: `qvain.history.provenance.modal.${datum}Input.${language}.placeholder`
    } : {
      label: `qvain.history.provenance.modal.${datum}Input.label`,
      placeholder: `qvain.history.provenance.modal.${datum}Input.placeholder`
    })

    handleChange = (event) => {
      const { language, datum } = this.props
      const {
        changeProvenanceAttribute,
        provenanceInEdit
      } = this.props.Stores.Qvain.Provenances

      const newData = language
        ? { ...provenanceInEdit[datum], [language]: event.target.value }
        : event.target.value

      changeProvenanceAttribute(datum, newData)
    }

    getValue = () => {
      const { language, datum } = this.props
      const {
        provenanceInEdit
      } = this.props.Stores.Qvain.Provenances
      return language ? provenanceInEdit[datum][language] : provenanceInEdit[datum]
    }

    render() {
        const { datum, handleBlur, type, error, isRequired, language } = this.props
        const { readonly } = this.props.Stores

        const translations = this.translations(datum, language)


        return (
          <>
            <Label htmlFor={`${datum}Field`}>
              <Translate content={translations.label} /> {isRequired ? '*' : ''}
            </Label>
            <Translate
              component={ProvenanceInputElem}
              type={type}
              id={`${datum}Field`}
              autoFocus
              attributes={{ placeholder: translations.placeholder }}
              disabled={readonly}
              value={this.getValue()}
              onChange={this.handleChange}
              onBlur={() => handleBlur()}
            />
            {error && <ProvenanceError>{error}</ProvenanceError>}
          </>
        )
    }
}


export const ProvenanceError = styled(ValidationError)`
  margin-bottom: 0.5rem;
`

export const ProvenanceInputElem = styled(Input)`
    margin-bottom: 0.75rem;
    + ${ProvenanceError} {
      margin-top: -0.5rem;
    }
  `

export default inject('Stores')(observer(ProvenanceInput))
