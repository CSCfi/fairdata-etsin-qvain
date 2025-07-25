import { observer } from 'mobx-react'
import Select from 'react-select'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { TitleSmall, FieldGroup, Divider, Required } from '@/components/qvain/general/V2'

import { withFieldErrorBoundary } from '@/components/qvain/general/errors/fieldErrorBoundary'
import ValidationError from '@/components/qvain/general/errors/validationError'
import {
  onChange,
  getOptionLabel,
  getOptionValue,
  getCurrentOption,
} from '@/components/qvain/utils/select'
import { ACCESS_TYPE_URL } from '@/utils/constants'
import { HelpField } from '@/components/qvain/general/modal/form'
import { useStores } from '@/stores/stores'
import RestrictionGrounds from './RestrictionGrounds'
import EmbargoExpires from './EmbargoExpires'
import { handleAccessTypeReferenceDataResponse } from '../../../IdaCatalog/componentHelpers'
import DataAccess from './DataAccess'
import useReferenceData from '@/utils/useReferenceData'

const AccessType = () => {
  const Stores = useStores()
  const { options, isLoading } = useReferenceData('access_type', {
    handler: opts => handleAccessTypeReferenceDataResponse(opts, Stores),
    sort: true,
  })
  const { lang, translate } = Stores.Locale
  const { value, Model, validationError, readonly, validate, set, setValidationError } =
    Stores.Qvain.AccessType
  const { shouldShowDataAccess } = Stores.Qvain.DataAccess

  let permitInfo = null
  if (value && value.url === ACCESS_TYPE_URL.PERMIT) {
    permitInfo = (
      <PermitHelp data-testid="permit-help">
        <Translate component={HelpField} content="qvain.rightsAndLicenses.accessType.permitInfo" />
      </PermitHelp>
    )
  }

  const handleChange = selection => {
    onChange(set)(selection)
    setValidationError(null)
  }

  return (
    <FieldGroup data-cy="access-type-select">
      <TitleSmall htmlFor="accessTypeSelect">
        {translate('qvain.rightsAndLicenses.accessType.title')}
        <Required />
      </TitleSmall>
      <Select
        inputId="accessTypeSelect"
        name="accessType"
        options={options}
        clearable
        isLoading={isLoading}
        isDisabled={readonly}
        value={getCurrentOption(Model, options, value)} // access is OPEN by default - 28.5.2019
        onChange={handleChange}
        getOptionLabel={getOptionLabel(Model, lang)}
        getOptionValue={getOptionValue(Model)}
        onBlur={validate}
        placeholder={translate('qvain.rightsAndLicenses.accessType.placeholder')}
        aria-autocomplete="list"
      />
      {permitInfo}
      <ValidationError>{validationError}</ValidationError>
      {value?.url !== ACCESS_TYPE_URL.OPEN && (
        <>
          <Divider />
          {value?.url === ACCESS_TYPE_URL.EMBARGO && <EmbargoExpires />}
          {value.url !== ACCESS_TYPE_URL.OPEN ? <RestrictionGrounds /> : null}
          {shouldShowDataAccess(value) && <DataAccess />}
        </>
      )}
    </FieldGroup>
  )
}

const PermitHelp = styled.div`
  margin-top: 0.5rem;
`

export default withFieldErrorBoundary(
  observer(AccessType),
  'qvain.rightsAndLicenses.accessType.title'
)
