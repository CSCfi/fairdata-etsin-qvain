import { observer } from 'mobx-react'
import Select from 'react-select'

import { Divider, FieldGroup, InfoText, Required, TitleSmall } from '@/components/qvain/general/V2'

import { withFieldErrorBoundary } from '@/components/qvain/general/errors/fieldErrorBoundary'
import ValidationError from '@/components/qvain/general/errors/validationError'
import {
  getCurrentOption,
  getOptionLabel,
  getOptionValue,
  onChange,
} from '@/components/qvain/utils/select'
import { useStores } from '@/stores/stores'
import { ACCESS_TYPE_URL, DATA_CATALOG_IDENTIFIER } from '@/utils/constants'
import useReferenceData from '@/utils/useReferenceData'
import DataAccess from './DataAccess'
import EmbargoExpires from './EmbargoExpires'
import REMSApprovalType from './REMSApprovalType'
import RestrictionGrounds from './RestrictionGrounds'

const AccessType = () => {
  const Stores = useStores()
  const { options: allOptions, isLoading } = useReferenceData('access_type', {
    handler: opts => opts.map(ref => Model(ref.label, ref.value)),
    sort: true,
  })

  const { lang, translate } = Stores.Locale
  const { shouldShowDataAccess, shouldShowREMSApprovalType } = Stores.Qvain.DataAccess
  const { dataCatalog, AccessType, original, isREMSAllowed } =
    Stores.Qvain
  const { value, Model, validationError, readonly, validate, set, setValidationError } = AccessType

  let options = allOptions
  const remsEnabled = Stores.Env.Flags.flagEnabled('QVAIN.REMS')
  const permitExists =
    value?.url == ACCESS_TYPE_URL.PERMIT ||
    original?.research_dataset?.access_type?.url == ACCESS_TYPE_URL.PERMIT
  if (!(remsEnabled || permitExists)) {
    options = options.filter(ref => ref.url !== ACCESS_TYPE_URL.PERMIT)
  }

  const isRemote = dataCatalog === DATA_CATALOG_IDENTIFIER.ATT

  let permitInfo = null
  if (value?.url === ACCESS_TYPE_URL.PERMIT && !isRemote) {
    permitInfo = (
      <InfoText data-testid="permit-help">
        {translate('qvain.rightsAndLicenses.accessType.permitInfo')}
      </InfoText>
    )
  }

  const handleChange = selection => {
    onChange(set)(selection)
    setValidationError(null)
  }

  return (
    <FieldGroup data-cy="access-type-select" data-testid="accessTypeSelect">
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
      {isRemote && (
        <InfoText>{translate('qvain.rightsAndLicenses.dataAccess.remoteResourcesInfo')}</InfoText>
      )}
      {permitInfo}
      {isREMSAllowed && shouldShowREMSApprovalType(value) && <REMSApprovalType />}
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

export default withFieldErrorBoundary(
  observer(AccessType),
  'qvain.rightsAndLicenses.accessType.title'
)
