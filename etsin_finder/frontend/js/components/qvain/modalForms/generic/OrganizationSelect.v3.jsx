import PropTypes from 'prop-types'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import { OrgSelectComponent as Select } from '@/components/qvain/general/V3/CommonOrgComponents'
import { InfoText } from '@/components/qvain/general/V2'
import { ValidationErrors } from '@/components/qvain/general/errors'

const OrganizationsSelect = ({ item, changeCallback }) => {
  const { hasOrganization, hasDepartment, hasSubdepartment, translationPath, validationError } =
    item

  const validationErrors = Object.values(validationError)

  return (
    <>
      <Translate
        selectId="organization-select"
        component={Select}
        org={item}
        section="organization"
        changeCallback={changeCallback}
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
            org={item}
            section="department"
            changeCallback={changeCallback}
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
                org={item}
                section="subdepartment"
                changeCallback={changeCallback}
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
    </>
  )
}

OrganizationsSelect.propTypes = {
  item: PropTypes.object.isRequired,
  changeCallback: PropTypes.func,
}

OrganizationsSelect.defaultProps = {
  changeCallback: () => {},
}

const Department = styled.div`
  margin-left: 1rem;
  margin-top: 0.5rem;
`

const Divider = styled.div`
  padding: 8px 0px;
`

export default observer(OrganizationsSelect)
