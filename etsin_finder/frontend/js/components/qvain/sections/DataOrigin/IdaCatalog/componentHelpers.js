import { ACCESS_TYPE_URL } from '@/utils/constants'
import { sortOptions } from '@/components/qvain/utils/select'

export const handleAccessTypeReferenceDataResponse = (options, Stores, component) => {
  const {
    Auth: { user },
    Locale,
    Qvain: {
      AccessType: { Model, value: accessType },
    },
  } = Stores

  let mappedOptions = options.map(ref => Model(ref.label, ref.value))
  if (!user.isUsingRems && !(accessType && accessType.url === ACCESS_TYPE_URL.PERMIT)) {
    mappedOptions = mappedOptions.filter(ref => ref.url !== ACCESS_TYPE_URL.PERMIT)
  }

  sortOptions(Model, Locale.lang, mappedOptions)
  component.setState({
    options: mappedOptions,
  })
}

export default handleAccessTypeReferenceDataResponse
