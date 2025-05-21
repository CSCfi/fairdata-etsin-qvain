import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { formatCurl, formatWget } from './formatUrl'
import CopyField from './copyField'

const Content = ({ Packages }) => {
  const [downloadUrl, setDownloadUrl] = useState('')
  const [downloadUrlError, setDownloadUrlError] = useState()
  const isCanceled = useRef(false)

  const { manualDownloadUrlGetter } = Packages

  useEffect(() => {
    const getDownloadUrl = async () => {
      const { url, error } = await manualDownloadUrlGetter()
      if (!isCanceled.current) {
        setDownloadUrl(url)
        setDownloadUrlError(error)
      }
    }
    getDownloadUrl()
    return () => {
      isCanceled.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (downloadUrlError) {
    return (
      <Wrapper>
        <ErrorDiv data-testid="manual-download-error">
          <Translate component="p" content="dataset.dl.manualDownload.error" />
        </ErrorDiv>
      </Wrapper>
    )
  }

  const loading = !downloadUrl
  return (
    <Wrapper>
      <Translate component="p" content="dataset.dl.manualDownload.description" unsafe />
      <CopyField title="wget" text={formatWget(downloadUrl)} loading={loading} />
      <CopyField title="cURL" text={formatCurl(downloadUrl)} loading={loading} />
      <CopyField title="URL" text={downloadUrl} loading={loading} />
    </Wrapper>
  )
}

Content.propTypes = {
  Packages: PropTypes.object.isRequired,
}

const Wrapper = styled.div`
  margin-bottom: 1rem;

  & p {
    margin-bottom: 0;
  }
`

export const ErrorDiv = styled.div.attrs({
  className: 'error',
})`
  padding: 0.25rem 0.75rem;
  display: flex;
  margin-bottom: 1rem;
`

export default observer(Content)
