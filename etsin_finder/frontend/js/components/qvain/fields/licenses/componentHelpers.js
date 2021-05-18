import { ACCESS_TYPE_URL } from '../../../../utils/constants'
import { sortOptions, autoSortOptions } from '../../utils/select'

export const handleAccessTypeReferenceDataResponse = (response, Stores, component) => {
  const {
    Auth: { user },
    Locale,
    Qvain: {
      AccessType: { Model, value: accessType },
    },
  } = Stores

  const list = response.data.hits.hits
  let options = list.map(ref => Model(ref._source.label, ref._source.uri))

  if (!user.isUsingRems && !(accessType && accessType.url === ACCESS_TYPE_URL.PERMIT)) {
    options = options.filter(ref => ref.url !== ACCESS_TYPE_URL.PERMIT)
  }

  sortOptions(Model, Locale.lang, options)
  component.setState({
    options,
  })

  autoSortOptions(component, Locale, Model)
}

export default handleAccessTypeReferenceDataResponse
