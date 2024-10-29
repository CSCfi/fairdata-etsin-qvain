import React, { useEffect } from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { observer } from 'mobx-react'

import { useStores } from '@/stores/stores'
import Button from '@/components/general/button'
import { OrgSelectComponent as Select } from '@/components/qvain/general/V3/CommonOrgComponents'
import { InfoText } from '@/components/qvain/general/V2'
import { ValidationErrors } from '../../general/errors'

const OrgSelect = ({ fieldName, organizations, saveCallback }) => {
  const {
    Qvain: { readonly },
  } = useStores()

  useEffect(() => {
    organizations.controller.create()
  }, [organizations.controller])

  if (!organizations.inEdit || readonly) return null

  const { hasOrganization, hasDepartment, hasSubdepartment, translationPath, validationError } =
    organizations.inEdit
  const { save } = organizations.controller

  const validationErrors = Object.values(validationError)

  const handleSave = () => {
    save()
    saveCallback()
  }

  return (
    <>
      <Translate
        selectId="organization-select"
        component={Select}
        org={organizations.inEdit}
        section="organization"
        settings={{
          creatable: true,
          allowReset: hasOrganization && !hasDepartment,
        }}
      />
      <Translate component={InfoText} content={`${translationPath}.organization.infoText`} />
      {hasOrganization && (
        <Department>
          <Translate
            selectId="department-select"
            component={Select}
            org={organizations.inEdit}
            section="department"
            settings={{
              creatable: true,
              allowReset: hasDepartment && !hasSubdepartment,
            }}
          />
          <Translate component={InfoText} content={`${translationPath}.department.infoText`} />
          {hasDepartment && (
            <Department>
              <Translate
                selectId="subdepartment-select"
                component={Select}
                org={organizations.inEdit}
                section="subdepartment"
                settings={{
                  creatable: true,
                  allowReset: hasSubdepartment,
                }}
              />
              <Translate
                component={InfoText}
                content={`${translationPath}.subdepartment.infoText`}
              />
            </Department>
          )}
        </Department>
      )}
      <Divider />
      {!!validationErrors.length && (
        <Translate component={ValidationErrors} errors={validationErrors} />
      )}
      <div>
        <Button
          type="button"
          onClick={handleSave}
          disabled={readonly || !!validationError[fieldName] || !hasOrganization}
        >
          <Translate content={`${translationPath}.buttons.save`} />
        </Button>
      </div>
    </>
  )
}

OrgSelect.propTypes = {
  fieldName: PropTypes.string.isRequired,
  organizations: PropTypes.object.isRequired,
  saveCallback: PropTypes.func,
}

OrgSelect.defaultProps = {
  saveCallback: () => {},
}

const Department = styled.div`
  margin-left: 1rem;
  margin-top: 0.5rem;
`

const Divider = styled.div`
  padding: 8px 0px;
`

export default observer(OrgSelect)
