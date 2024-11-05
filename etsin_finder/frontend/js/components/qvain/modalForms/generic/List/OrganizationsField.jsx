/* eslint-disable camelcase */
import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { Title, FieldGroup } from '@/components/qvain/general/V2'
import { ValidationError } from '@/components/qvain/general/errors'
import { BoxedContainer } from '@/components/qvain/general/V3/CommonOrgComponents'
import OrganizationsSelect from './OrganizationsSelect'
import ModalList from './ModalList.v3'

const OrganizationsField = ({ fieldName, item, changeCallback }) => {
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
          <ModalList model={organizations} changeCallback={changeCallback} />
          <OrganizationsSelect
            fieldName={fieldName}
            organizations={organizations}
            saveCallback={() => {
              validate(fieldName)
              changeCallback()
            }}
          />
          {validationError[fieldName] && (
            <ValidationError>{validationError[fieldName]}</ValidationError>
          )}
        </FieldGroup>
      </BoxedContainer>
    </FieldGroup>
  )
}

OrganizationsField.propTypes = {
  item: PropTypes.object.isRequired,
  fieldName: PropTypes.string.isRequired,
  changeCallback: PropTypes.func,
}

OrganizationsField.defaultProps = {
  changeCallback: () => {},
}
export default observer(OrganizationsField)
