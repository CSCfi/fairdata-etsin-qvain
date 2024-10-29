/* eslint-disable camelcase */
import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import ModalList from '@/components/qvain/modalForms/generic/ModalList.v3'
import { Title, FieldGroup } from '@/components/qvain/general/V2'
import { ValidationError } from '@/components/qvain/general/errors'
import { BoxedContainer } from '@/components/qvain/general/V3/CommonOrgComponents'
import OrganizationSelect from './OrganizationSelect'

const OrganizationField = ({ fieldName, item }) => {
  const {
    [fieldName]: organizations,
    validationError,
    controller: { validate },
  } = item
  const { translationPath } = organizations

  return (
    <FieldGroup>
      <BoxedContainer>
        <FieldGroup>
          <Translate component={Title} content={`${translationPath}.title`} />
          <Translate component="p" content={`${translationPath}.infoText`} />
          <ModalList model={organizations} />
          <OrganizationSelect
            fieldName={fieldName}
            organizations={organizations}
            saveCallback={() => validate(fieldName)}
          />
          {validationError[fieldName] && (
            <ValidationError>{validationError[fieldName]}</ValidationError>
          )}
        </FieldGroup>
      </BoxedContainer>
    </FieldGroup>
  )
}

OrganizationField.propTypes = {
  item: PropTypes.object.isRequired,
  fieldName: PropTypes.string.isRequired,
}

export default observer(OrganizationField)
