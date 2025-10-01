import { observer } from 'mobx-react'

import {
  ErrorContainer,
  ErrorButtons,
  ErrorLabel,
  ErrorContent,
} from '@/components/qvain/general/errors'
import { Button } from '@/components/general/button'
import { useStores } from '@/stores/stores'

const DataCatalogError = observer(() => {
  const {
    Locale: { translate },
    Qvain: { ensureBasicDataCatalogs },
  } = useStores()
  return (
    <ErrorContainer>
      <ErrorLabel>{translate('qvain.sections.dataOrigin.error.title')}</ErrorLabel>
      <ErrorContent>{translate('qvain.sections.dataOrigin.error.description')}</ErrorContent>
      <ErrorButtons>
        <Button onClick={ensureBasicDataCatalogs}>{translate('qvain.error.retry')}</Button>
      </ErrorButtons>
    </ErrorContainer>
  )
})

export default DataCatalogError
