import { ACCESS_TYPE_URL } from '@/utils/constants'

export const handleAccessTypeReferenceDataResponse = (options, Stores) => {
  const {
    Qvain: {
      AccessType: { Model, value: accessType },
    },
    Env: { Flags },
  } = Stores

  let mappedOptions = options.map(ref => Model(ref.label, ref.value))
  if (!(Flags.flagEnabled('QVAIN.REMS') || accessType?.url === ACCESS_TYPE_URL.PERMIT)) {
    mappedOptions = mappedOptions.filter(ref => ref.url !== ACCESS_TYPE_URL.PERMIT)
  }

  return mappedOptions
}

export default handleAccessTypeReferenceDataResponse
