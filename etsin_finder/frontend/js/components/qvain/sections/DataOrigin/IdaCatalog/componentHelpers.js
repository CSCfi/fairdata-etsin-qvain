import { ACCESS_TYPE_URL } from '@/utils/constants'

export const handleAccessTypeReferenceDataResponse = (options, Stores) => {
  const {
    Auth: { user },
    Qvain: {
      AccessType: { Model, value: accessType },
    },
  } = Stores

  let mappedOptions = options.map(ref => Model(ref.label, ref.value))
  if (!user.isUsingRems && !(accessType && accessType.url === ACCESS_TYPE_URL.PERMIT)) {
    mappedOptions = mappedOptions.filter(ref => ref.url !== ACCESS_TYPE_URL.PERMIT)
  }

  return mappedOptions
}

export default handleAccessTypeReferenceDataResponse
