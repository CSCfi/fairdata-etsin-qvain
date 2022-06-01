import React from 'react'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'

import { useStores } from '@/stores/stores'
import { FieldGroup, InfoText, InfoTextLarge, Title } from '@/components/qvain/general/V2'
import {
  SelectContainer,
  Department,
  OrgSelectComponent as Select,
  BoxedContainer,
} from './CommonOrgComponents'

const FunderOrganizationSelect = () => {
  const {
    Locale: { lang },
    Qvain: {
      ProjectV2: {
        readonly,
        inEdit: { funderOrganization: funderOrgInEdit },
        options,
        changeFunderOrgInEdit,
        isFunderOrgDepartmentVisible,
        isFunderOrgSubdepartmentVisible,
        saveFunderOrg,
      },
    },
  } = useStores()

  const { organization, department, subdepartment } = funderOrgInEdit

  const inputId = 'project-funderorg-select'
  return (
    <FieldGroup>
      <BoxedContainer>
        <Translate component={Title} content="qvain.projectV2.funderOrganization.title" />
        <Translate
          component={InfoTextLarge}
          content={`qvain.projectV2.funderOrganization.infoText`}
          weight={0}
        />
        <SelectContainer>
          <FieldGroup>
            <Translate
              id="project-funderorg-select"
              component={Select}
              readonly={readonly}
              onChange={v => changeFunderOrgInEdit('organization', v)}
              onBlur={saveFunderOrg}
              name={'project-funder-organization-select'}
              inputId={`${inputId}-organization`}
              value={organization}
              options={options?.funderOrg?.organization?.[lang] || []}
              creatable
              allowReset={Boolean(organization?.value && !department?.value)}
              attributes={{ ariaLabel: 'qvain.project.inputs.organization.levels.organization' }}
            />
            <Translate
              component={InfoText}
              content="qvain.projectV2.organizations.organization.infoText"
            />
          </FieldGroup>
          {isFunderOrgDepartmentVisible && (
            <Department>
              <FieldGroup>
                <Translate
                  id="department-select"
                  readonly={readonly}
                  component={Select}
                  onChange={v => changeFunderOrgInEdit('department', v)}
                  onBlur={saveFunderOrg}
                  name={'project-funderdepartment-select'}
                  inputId={`${inputId}-department`}
                  value={department}
                  options={options?.funderOrg?.department?.[lang] || []}
                  creatable
                  allowReset={Boolean(department?.value && !subdepartment?.value)}
                  attributes={{ ariaLabel: 'qvain.project.inputs.organization.levels.department' }}
                />
                <Translate
                  component={InfoText}
                  content="qvain.projectV2.organizations.department.infoText"
                />
              </FieldGroup>
              {isFunderOrgSubdepartmentVisible && (
                <Department>
                  <FieldGroup>
                    <Translate
                      id="subdepartment-select"
                      readonly={readonly}
                      component={Select}
                      onChange={v => changeFunderOrgInEdit('subdepartment', v)}
                      onBlur={saveFunderOrg}
                      name={'project-subdepartment-select'}
                      inputId={`${inputId}-subdepartment`}
                      value={subdepartment}
                      options={options?.funderOrg?.subdepartment?.[lang] || []}
                      creatable
                      allowReset={Boolean(subdepartment?.value)}
                      attributes={{
                        ariaLabel: 'qvain.project.inputs.organization.levels.subdepartment',
                      }}
                    />
                    <Translate
                      component={InfoText}
                      content="qvain.projectV2.organizations.subdepartment.infoText"
                    />
                  </FieldGroup>
                </Department>
              )}
            </Department>
          )}
        </SelectContainer>
      </BoxedContainer>
    </FieldGroup>
  )
}

export default observer(FunderOrganizationSelect)
