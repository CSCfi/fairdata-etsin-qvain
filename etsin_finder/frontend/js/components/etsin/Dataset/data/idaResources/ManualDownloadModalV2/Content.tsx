import { observer } from 'mobx-react'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import ErrorBoundary from '@/components/general/errorBoundary'
import Loader from '@/components/general/Loader'
import LineEntry from './LineEntry'

import { useStores } from '@/stores/stores'
import type Packages from '@/stores/view/packages'
import type { OSOption } from '@/utils/getOS'
import { CopyInput } from './Copy'
import HtmlEntry from './HtmlEntry'
import { isCancel } from 'axios'
import type { StringTranslationKey } from '@/stores/view/locale'

type DownloadInfo = {
  changelist_url: string
  curl: string
  dataset_id: string
  download_url: string
  expires: string
  linux_mount_en: string
  linux_mount_fi: string
  linux_mount_sv: string
  macos_mount_en: string
  macos_mount_fi: string
  macos_mount_sv: string
  metadata_url: string
  preview_url: string
  rclone_copy: string
  rclone_ls: string
  rclone_mount: string
  resourcelist_url: string
  scope: string
  access_id: string
  access_token: string
  sitemap_url: string
  wget: string
  windows_mount_en: string
  windows_mount_fi: string
  windows_mount_sv: string
}

type Language = 'en' | 'fi' | 'sv'

type MountInfoKey = `${OSOption}_mount`

type MountInfoKeyWithLang = `${OSOption}_mount_${Language}`

const getMountInfoKey = (os: OSOption, lang: string): [MountInfoKey, MountInfoKeyWithLang] => {
  let language: Language = 'en'
  if (['en', 'fi', 'sv'].includes(lang)) {
    language = lang as Language
  }
  return [`${os}_mount`, `${os}_mount_${language}`]
}

const Content = ({ Packages }: { Packages: Packages }) => {
  const {
    Env: { osChoice },
    Locale: { translate, currentLang, dateFormat },
  } = useStores()

  const [authorizeError, setAuthorizeError] = useState<any>()

  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo | undefined>(undefined)
  const isCanceled = useRef(false)

  const { manualDownloadUrlGetter } = Packages

  useEffect(() => {
    if (downloadInfo || !manualDownloadUrlGetter) {
      return
    }
    const getDownloadUrl = async () => {
      try {
        const downloadInfo = await manualDownloadUrlGetter()
        if (!isCanceled.current) {
          setDownloadInfo(downloadInfo)
        }

        setAuthorizeError(undefined)
      } catch (exception) {
        if (!isCancel(exception)) {
          console.error(exception)
          setAuthorizeError(exception)
        }
      }
    }
    getDownloadUrl()
    return () => {
      isCanceled.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadInfo, manualDownloadUrlGetter])

  if (!manualDownloadUrlGetter) {
    return null
  }

  const getEntries = (downloadInfo: DownloadInfo) => {
    const prefix = 'dataset.dl.manualDownload.fields'
    const entries: { key: StringTranslationKey; text: string }[] = [
      { key: `${prefix}.download_url`, text: downloadInfo.download_url },
      { key: `${prefix}.curl`, text: downloadInfo.curl },
      { key: `${prefix}.wget`, text: downloadInfo.wget },
      { key: `${prefix}.rclone_copy`, text: downloadInfo.rclone_copy },
      { key: `${prefix}.rclone_ls`, text: downloadInfo.rclone_ls },
      { key: `${prefix}.rclone_mount`, text: downloadInfo.rclone_mount },
    ]

    return entries
      .filter(entry => entry.text)
      .map(entry => <LineEntry key={entry.key} title={entry.key} text={entry.text} />)
  }

  const getMountInfo = (downloadInfo: DownloadInfo) => {
    const [mountInfoKey, mountInfoKeyWithLang] = getMountInfoKey(osChoice, currentLang)
    const entries = [{ key: mountInfoKey, text: downloadInfo[mountInfoKeyWithLang] }]

    return entries
      .filter(entry => entry.text)
      .map(entry => (
        <HtmlEntry
          key={entry.key}
          title={`dataset.dl.manualDownload.fields.${entry.key}`}
          text={entry.text}
        />
      ))
  }

  if (authorizeError) {
    return (
      <Wrapper>
        <ErrorDiv data-testid="manual-download-error">
          {translate('dataset.dl.manualDownload.error')}
        </ErrorDiv>
      </Wrapper>
    )
  }

  const loading = !downloadInfo
  if (loading) {
    return <Loader active />
  }

  const expires = dateFormat(downloadInfo.expires)

  return (
    <Wrapper>
      <ErrorBoundary>
        {translate('dataset.dl.manualDownload.shareV2')}
        <dl>
          <dt>{translate('dataset.dl.manualDownload.fields.access_id')}</dt>
          <dd>
            <CopyInput text={downloadInfo.access_id} />
          </dd>
          <dt>{translate('dataset.dl.manualDownload.fields.access_token')}</dt>
          <dd>
            <CopyInput text={downloadInfo.access_token} />
          </dd>
          <dt>{translate('dataset.dl.manualDownload.fields.expires')}</dt>
          <dd>
            <CopyInput text={expires} />
          </dd>
        </dl>
        {translate('dataset.dl.manualDownload.descriptionV2')}
        <a href="https://download.fairdata.fi/guide" target="_blank">
          {translate('dataset.dl.manualDownload.guideLinkV2')}
        </a>
        .<dl>{getEntries(downloadInfo)}</dl>
        {getMountInfo(downloadInfo)}
      </ErrorBoundary>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-bottom: 1rem;

  & p {
    margin-bottom: 0;
  }

  dl {
    margin-top: 1rem;
    margin-bottom: 1rem;
    display: grid;
    grid-template-columns: fit-content(8em) 1fr;
    gap: 0 0.5rem;
    align-items: center;
  }

  dt {
    font-weight: bold;
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
