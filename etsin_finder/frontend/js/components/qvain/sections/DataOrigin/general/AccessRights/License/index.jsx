import { observer } from 'mobx-react'
import { useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import styled, { useTheme } from 'styled-components'

import { FieldGroup, InfoText, TitleSmall } from '@/components/qvain/general/V2'
import { withFieldErrorBoundary } from '@/components/qvain/general/errors/fieldErrorBoundary'
import { ValidationError } from '@/components/qvain/general/errors/validationError'
import { getCurrentOption, getOptionLabel, onChangeMulti } from '@/components/qvain/utils/select'
import { useStores } from '@/stores/stores'
import Translate from '@/utils/Translate'
import useReferenceData from '@/utils/useReferenceData'

const License = () => {
  const Stores = useStores()
  const { lang } = Stores.Locale
  const { Model, set, storage, readonly, schema } = Stores.Qvain.Licenses
  const { options, isLoading } = useReferenceData('license', {
    handler: opts => opts.map(ref => Model(ref.label, ref.value)),
    sort: true,
  })
  const [licenseErrors, setLicenseErrors] = useState({})
  const theme = useTheme()

  const validateLicenses = () => {
    const licenseErrors = {}
    storage.forEach(license => {
      const validationObject = { ...license }
      try {
        schema.validateSync(validationObject)
      } catch (err) {
        licenseErrors[license.identifier || license.otherLicenseUrl] = err.message
      }
    })
    setLicenseErrors(licenseErrors)
  }

  const onChange = values => {
    onChangeMulti(set)(values)
    validateLicenses()
  }

  const createLicense = url => {
    const custom = Stores.Qvain.Licenses.CustomLicenseModel(
      { fi: `Muu (URL): ${url}`, en: `Other (URL): ${url}` },
      url
    )
    return custom
  }

  // allow wrap for long license labels
  const styles = {
    multiValue: (style, state) => {
      if (licenseErrors[state.data.identifier || state.data.otherLicenseUrl]) {
        return {
          ...style,
          background: theme.color.error,
          color: 'white',
        }
      }
      return style
    },
    multiValueLabel: style => ({
      ...style,
      whiteSpace: 'normal',
      color: 'inherit',
    }),
  }

  const getLicenseOptionValue = option => option.identifier || `custom:${option.otherLicenseUrl}`

  return (
    <FieldGroup data-cy="license-select">
      <TitleSmall htmlFor="licenseSelect">
        <Translate content="qvain.rightsAndLicenses.license.title" />
      </TitleSmall>
      <Translate
        component={CreatableSelect}
        inputId="licenseSelect"
        name="license"
        isDisabled={readonly}
        isLoading={isLoading}
        getOptionLabel={getOptionLabel(Model, lang)}
        getOptionValue={getLicenseOptionValue}
        value={getCurrentOption(Model, options, storage)}
        options={options}
        isMulti
        isClearable={false}
        onChange={onChange}
        onBlur={validateLicenses}
        createOptionPosition="first"
        getNewOptionData={createLicense}
        attributes={{
          placeholder: 'qvain.rightsAndLicenses.license.placeholder',
        }}
        styles={styles}
        aria-autocomplete="list"
      />
      <Translate component={InfoText} content="qvain.rightsAndLicenses.license.infoText" unsafe={true} />
      {licenseErrors && (
        <Errors data-testid="license-errors">
          {Object.entries(licenseErrors).map(([url, err]) => (
            <ErrorRow key={url}>
              <ErrorLabel>{url}:</ErrorLabel>
              <ValidationError>{err}</ValidationError>
            </ErrorRow>
          ))}
        </Errors>
      )}
    </FieldGroup>
  )
}

const Errors = styled.div`
  color: ${props => props.theme.color.redText};
  margin-top: 0.5rem;
  p {
    margin: 0;
    display: inline;
  }
`

const ErrorRow = styled.div``

export const ErrorLabel = styled.span`
  margin-right: 0.5rem;
`

export default withFieldErrorBoundary(observer(License), 'qvain.rightsAndLicenses.license.title')
