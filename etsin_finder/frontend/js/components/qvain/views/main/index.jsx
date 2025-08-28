import { useCallback, useEffect, useRef } from 'react'
import { observer } from 'mobx-react'

import { useParams } from 'react-router'

import Translate from '@/utils/Translate'
import queryParam from '@/utils/queryParam'
import { QvainContainer } from '../../general/card'
import ErrorBoundary from '../../../general/errorBoundary'
import Header from '../headers/header'
import StickyHeader from '../headers/stickyHeader'
import DatasetEditorV2 from '../DatasetEditorV2'
import LooseActorDialog from './looseActorDialog'
import LooseProvenanceDialog from './looseProvenanceDialog'
import { useStores } from '@/stores/stores'
import useConfirmReload from '@/components/etsin/general/useConfirmReload'
import { usePrompt } from '@/utils/usePrompt'

const Qvain = () => {
  const params = useParams()

  const Stores = useStores()
  const {
    Qvain,
    Env,
    Locale: { translate },
    Matomo: { recordEvent },
  } = Stores
  const { datasetLoading, datasetError, changed } = Qvain

  // Block navigation when there are unsaved changes.
  // When developing, hot module reload can cause some
  // "A router only supports one blocker at a time" warnings which can be ignored.
  usePrompt({ shouldBlock: changed, message: translate('qvain.unsavedChanges') })

  // Prevent reload when dataset has changes
  useConfirmReload(useCallback(() => changed, [changed]))

  useEffect(() => {
    // Attempt to release lock when window is closed, won't work on mobile
    window.addEventListener('unload', Qvain.Lock?.unload)

    return () => {
      Qvain.resetQvainStore() // Reset Qvain store when user leaves editor
      window.removeEventListener('unload', Qvain.Lock?.unload)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const oldIdentifier = useRef()

  const handleIdentifierChanged = async () => {
    if (datasetLoading) {
      return
    }
    const { original, fetchDataset } = Qvain
    const matchIdentifier = params.identifier
    let identifier = matchIdentifier
    let isTemplate = false
    const templateIdentifier = queryParam(Env.history.location, 'template')

    if (identifier) {
      recordEvent(`DATASET / ${identifier}`)
    } else if (templateIdentifier) {
      identifier = templateIdentifier
      isTemplate = true
      recordEvent(`TEMPLATE / ${templateIdentifier}`)
    } else {
      recordEvent('DATASET')
    }
    if (!identifier) {
      return // No dataset to load
    }
    // Test if we need to load a dataset or do we use the one currently in store
    if (original?.identifier !== identifier) {
      await fetchDataset(identifier, { isTemplate })
    }
  }

  useEffect(() => {
    // handleIdentifierChanged is called once when editor is openeed
    // and each time the identifier changes.
    const identifier = params.identifier || ''
    if (identifier !== oldIdentifier.current) {
      handleIdentifierChanged()
    }
    oldIdentifier.current = identifier
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const getDatasetProps = () => {
    return {
      datasetError: !!datasetError,
      datasetErrorTitle: datasetError?.title && translate(datasetError.title),
      datasetErrorDetails: datasetError?.details,
      handleRetry: handleIdentifierChanged,
    }
  }

  return (
    <QvainContainer>
      <Header datasetLoading={datasetLoading} datasetError={!!datasetError} />
      <StickyHeader datasetError={!!datasetError} />

      <ErrorBoundary title={ErrorTitle()}>
        <DatasetEditorV2 {...getDatasetProps()} />
      </ErrorBoundary>
      <LooseActorDialog />
      <LooseProvenanceDialog />
    </QvainContainer>
  )
}

export const ErrorTitle = () => <Translate component="h2" content="qvain.error.render" />

export default observer(Qvain)
