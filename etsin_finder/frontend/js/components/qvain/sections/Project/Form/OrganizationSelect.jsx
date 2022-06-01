import React from 'react'
import Translate from 'react-translate-component'
import styled from 'styled-components'
import { observer } from 'mobx-react'

import { useStores } from '@/stores/stores'
import Button from '@/components/general/button'
import { OrgSelectComponent as Select } from './CommonOrgComponents'
import { InfoText } from '@/components/qvain/general/V2'

const OrgSelect = () => {
  const {
    Locale: { lang },
    Qvain: {
      ProjectV2: {
        readonly,
        orgInEdit,
        options,
        changeOrgInEdit,
        isOrgDepartmentVisible,
        isOrgSubdepartmentVisible,
        validateOrg,
        saveOrg,
      },
    },
  } = useStores()

  const { organization, department, subdepartment } = orgInEdit

  const inputId = 'project-select'
  return (
    <>
      <Translate
        id="organization-select"
        component={Select}
        readonly={readonly}
        onChange={v => changeOrgInEdit('organization', v)}
        onBlur={validateOrg}
        name={'project-organization-select'}
        inputId={`${inputId}-organization`}
        value={organization}
        options={options?.organizations?.organization?.[lang] || []}
        creatable
        allowReset={Boolean(organization?.value && !department?.value)}
        attributes={{ ariaLabel: 'qvain.projectV2.organizations.organization.aria' }}
      />
      <Translate
        component={InfoText}
        content="qvain.projectV2.organizations.organization.infoText"
      />
      {isOrgDepartmentVisible && (
        <Department>
          <Translate
            id="department-select"
            readonly={readonly}
            component={Select}
            onChange={v => changeOrgInEdit('department', v)}
            onBlur={validateOrg}
            name={'project-department-select'}
            inputId={`${inputId}-department`}
            value={department}
            options={options?.organizations?.department?.[lang] || []}
            creatable
            allowReset={Boolean(department?.value && !subdepartment?.value)}
            attributes={{ ariaLabel: 'qvain.projectV2.organizations.department.aria' }}
          />
          <Translate
            component={InfoText}
            content="qvain.projectV2.organizations.department.infoText"
          />
          {isOrgSubdepartmentVisible && (
            <Department>
              <Translate
                id="subdepartment-select"
                readonly={readonly}
                component={Select}
                onChange={v => changeOrgInEdit('subdepartment', v)}
                onBlur={validateOrg}
                name={'project-subdepartment-select'}
                inputId={`${inputId}-subdepartment`}
                value={subdepartment}
                options={options?.organizations?.subdepartment?.[lang] || []}
                creatable
                allowReset={Boolean(subdepartment?.value)}
                attributes={{ ariaLabel: 'qvain.projectV2.organizations.subdepartment.aria' }}
              />
              <Translate
                component={InfoText}
                content="qvain.projectV2.organizations.subdepartment.infoText"
              />
            </Department>
          )}
        </Department>
      )}
      <Divider />
      <div>
        <Button type="button" onClick={saveOrg} disabled={readonly}>
          <Translate content={'qvain.projectV2.organizations.buttons.save'} />
        </Button>
      </div>
    </>
  )
}

const Department = styled.div`
  margin-left: 1rem;
  margin-top: 0.5rem;
`

const Divider = styled.div`
  padding: 8px 0px;
`

export default observer(OrgSelect)
