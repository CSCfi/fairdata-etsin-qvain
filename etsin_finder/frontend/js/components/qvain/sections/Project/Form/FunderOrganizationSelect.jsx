import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

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
      },
    },
  } = useStores()

  const { organization, department, subdepartment } = funderOrgInEdit || { organization: null }
  const haveOrganization = Boolean(organization?.value || organization?.label)
  const haveDepartment = Boolean(department?.value || department?.label)
  const haveSubdepartment = Boolean(subdepartment?.value || subdepartment?.label)

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
              name="project-funder-organization-select"
              inputId={`${inputId}-organization`}
              value={organization || null}
              options={options?.funderOrg?.organization?.[lang] || []}
              creatable
              allowReset={haveOrganization && !haveDepartment}
              attributes={{ ariaLabel: 'qvain.projectV2.inputs.organization.levels.organization' }}
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
                  name="project-funderdepartment-select"
                  inputId={`${inputId}-department`}
                  value={department || null}
                  options={options?.funderOrg?.department?.[lang] || []}
                  creatable
                  allowReset={haveDepartment && !haveSubdepartment}
                  attributes={{
                    ariaLabel: 'qvain.projectV2.inputs.organization.levels.department',
                  }}
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
                      name={'project-subdepartment-select'}
                      inputId={`${inputId}-subdepartment`}
                      value={subdepartment || null}
                      options={options?.funderOrg?.subdepartment?.[lang] || []}
                      creatable
                      allowReset={haveSubdepartment}
                      attributes={{
                        ariaLabel: 'qvain.projectV2.inputs.organization.levels.subdepartment',
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
