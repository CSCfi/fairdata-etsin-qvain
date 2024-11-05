import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import t from 'counterpart'
import ReactSelect from 'react-select'

import { Input } from '@/components/qvain/general/modal/form'
import { DeleteButton } from '@/components/qvain/general/V2/buttons'
import { useStores } from '@/stores/stores'
import {
  InfoText,
  FieldLabel,
  FieldGroup,
  Divider,
  RequiredText,
  Title,
} from '@/components/qvain/general/V2'
import Spinner from '@/components/etsin/general/spinner'

/**
 * Internally used select component with form for adding organization manually.
 * This is a stateless component.
 */
export const OrgSelectComponent = observer(
  ({ selectId, org, settings, section, changeCallback }) => {
    const {
      Locale: { getValueTranslation },
      Qvain: { OrgReferences, readonly },
    } = useStores()

    const parentSection = {
      organization: null,
      department: 'organization',
      subdepartment: 'department',
    }[section]

    // Eslint suggests using useMemo but with it parent won't update after parent change
    // eslint-disable-next-line
    const parent = parentSection ? org[parentSection] : { id: '' }

    useEffect(() => {
      const fetchOrgs = async () => {
        if (parent === null) return
        if (
          !OrgReferences.loading.organizations[parent.id] &&
          !OrgReferences.data.organizations[parent.id]
        ) {
          OrgReferences.fetchOrganizations(parent)
        }
      }
      fetchOrgs()
    }, [OrgReferences, parent])

    /**
     * Open form if add manually is selected.
     *
     * @param {Object} option Selected option
     */
    const onSelectChange = option => {
      if (option.value === 'create') {
        org.controller.setSection({
          section,
          value: {
            url: '',
            pref_label: { und: '' },
            email: '',
            external_identifier: '',
            isReference: false,
          },
        })
      } else org.controller.setSection({ section, value: { ...option, isReference: true } })
      changeCallback()
    }

    const onReset = () =>
      org.controller.setSection({ section, value: { pref_label: { und: '' }, isReference: true } })

    /**
     * Craft payload for onChange, based on organization form.
     */
    const onFormChange = event => {
      const newValue = event.target.value
      const newName = event.target.name

      switch (newName) {
        case 'name': {
          org.controller.set({
            section,
            fieldName: 'pref_label',
            value: { fi: newValue, en: newValue, und: newValue },
          })
          break
        }
        case 'email': {
          org.controller.set({ section, fieldName: 'email', value: newValue })
          break
        }
        case 'external_identifier': {
          org.controller.set({ section, fieldName: 'external_identifier', value: newValue })
          break
        }
        default:
          break
      }
    }

    /**
     * Add option for adding organization manually
     * if props has creatable set to true.
     */
    const getOptions = () => {
      const options = []
      const optionCreate = {
        label: t('qvain.organizationSelect.label.addNew'),
        options: [
          { value: 'create', pref_label: { und: t('qvain.organizationSelect.label.addNew') } },
        ],
      }

      if (settings.creatable) options.push(optionCreate)

      if (OrgReferences.data.organizations[parent.id]?.length) {
        options.push({
          label: t('qvain.actors.add.organization.options.presets'),
          options: OrgReferences.data.organizations[parent.id]
            .slice()
            .sort((a, b) => getValueTranslation(a.pref_label) > getValueTranslation(b.pref_label)),
        })
      }

      return options
    }

    /**
     * Select option will have an additional form is open property
     * if organization for should be visible.
     */

    if (OrgReferences.loading.organizations[parent.id]) return <Spinner />

    const renderForm = () => {
      if (org[section].isReference) return null
      return (
        <AddOptionContainer>
          <Translate component={FieldLabel} content="qvain.organizationSelect.label.addNew" />
          <Divider />
          <FieldGroup>
            <Translate component={Title} content="qvain.organizationSelect.label.name" />
            <Translate
              component={Input}
              value={org[section].pref_label.und}
              onChange={onFormChange}
              onBlur={() => org.controller.validate(section)}
              name="name"
              id={`${selectId}-name`}
              placeholder=""
            />
            <RequiredText />
            <Translate component={InfoText} content={'qvain.organizationSelect.infoText.name'} />
          </FieldGroup>
          <FieldGroup>
            <Translate component={Title} content="qvain.organizationSelect.label.email" />
            <Translate
              component={Input}
              value={org[section].email}
              onChange={onFormChange}
              onBlur={() => org.controller.validate(section)}
              name="email"
              id={`${selectId}-email`}
              placeholder=""
            />
            <Translate component={InfoText} content={'qvain.organizationSelect.infoText.email'} />
          </FieldGroup>
          <FieldGroup>
            <Translate component={Title} content="qvain.organizationSelect.label.identifier" />
            <Translate
              component={Input}
              value={org[section].external_identifier}
              onChange={onFormChange}
              onBlur={() => org.controller.validate(section)}
              name="external_identifier"
              id={`${selectId}-external_identifier`}
              placeholder=""
            />
            <Translate
              component={InfoText}
              content={'qvain.organizationSelect.infoText.identifier'}
            />
          </FieldGroup>
        </AddOptionContainer>
      )
    }
    return (
      <>
        <OrgItemContainer>
          <Translate
            component={StyledSelect}
            name={`${selectId}-${section}`}
            inputId={`${selectId}-${section}`}
            isDisabled={readonly}
            onChange={onSelectChange}
            getOptionLabel={option => getValueTranslation(option?.pref_label) || ''}
            getOptionValue={option => option?.url || option?.pref_label || ''}
            value={org[section]}
            className="basic-single"
            classNamePrefix="select"
            options={getOptions()}
            placeholder=""
            menuShouldScrollIntoView={false}
            menuPlacement="auto"
            menuPosition="fixed"
            attributes={{
              'aria-label': `${org.translationPath}.${section}.aria`,
            }}
            ariaAutocomplete="list"
          />
          {settings.allowReset && !readonly ? (
            <DeleteButton
              type="button"
              onClick={onReset}
              style={{ margin: '0 0 0 .25rem', height: 38 }}
            />
          ) : null}
        </OrgItemContainer>
        {renderForm()}
      </>
    )
  }
)

const StyledSelect = styled(ReactSelect)`
  flex-grow: 1;
`

OrgSelectComponent.propTypes = {
  selectId: PropTypes.string.isRequired,
  org: PropTypes.object.isRequired,
  settings: PropTypes.shape({
    creatable: PropTypes.bool,
    allowReset: PropTypes.bool,
  }),
  section: PropTypes.string.isRequired,
  changeCallback: PropTypes.func,
}

OrgSelectComponent.defaultProps = {
  parent: null,
  settings: {
    creatable: true,
    allowReset: false,
  },
  changeCallback: () => {},
}

export const SelectContainer = styled.div`
  padding-left: 1rem;
`

export const OrgItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-right: 1rem;
  justify-content: flex-start;
`

export const Department = styled.div`
  margin-left: 1rem;
  margin-top: 0.5rem;
`

export const AddOptionContainer = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1rem;
`

export const BoxedContainer = styled.div`
  border: 1px solid;
  border-color: ${({ theme }) => theme.color.darkgray};
  padding: 1rem;
`
