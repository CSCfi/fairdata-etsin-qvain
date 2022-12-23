import React from 'react'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { shallow, mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import '../../../locale/translations'

import { buildStores } from '../../../js/stores'
import { DOWNLOAD_API_REQUEST_STATUS } from '../../../js/utils/constants'
import Locale from '../../../js/stores/view/locale'
import Packages from '../../../js/stores/view/packages'
import { fakeDownload, applyMockAdapter } from '../../__testdata__/download.data'
import { runInAction } from 'mobx'
import getDownloadAction from '../../../js/components/dataset/data/idaResources/downloadActions'
import ExternalResources, { Grid } from '../../../js/components/dataset/data/externalResources'
import {
  Header,
  HeaderTitle,
  HeaderStats,
  HeaderButton,
} from '../../../js/components/dataset/data/common/dataHeader'
import ResourceItem, {
  Name,
  Category,
  LinkButton,
  DownloadButton,
} from '../../../js/components/dataset/data/externalResources/resourceItem'
import { useStores } from '../../../js/stores/stores'
import {
  accessUrlResource,
  anotherAccessUrlResource,
  downloadUrlResource,
  bothUrlsResource,
  datasetWithResources,
  noUrlResource,
} from '../../__testdata__/externalResources.data'
import etsinTheme from '../../../js/styles/theme'

jest.mock('../../../js/stores/stores')
const Stores = buildStores()

const renderResources = resources => {
  useStores.mockReturnValue({
    ...Stores,
    DatasetQuery: {
      results: datasetWithResources(resources),
    },
  })
  return shallow(<ExternalResources />)
}

describe('ExternalResources', () => {
  const getUrls = wrapper =>
    wrapper.find(ResourceItem).map(r => {
      const urls = {}
      const access = r.prop('resource').access_url?.identifier
      const download = r.prop('resource').download_url?.identifier
      if (access) {
        urls.access = access
      }
      if (download) {
        urls.download = download
      }
      return urls
    })

  const hasCommonSourceLink = wrapper =>
    !!(wrapper.findWhere(c => c.prop('component') === HeaderButton).length === 1)

  it('should pass urls to ResourceItems', () => {
    const wrapper = renderResources([
      downloadUrlResource,
      accessUrlResource,
      anotherAccessUrlResource,
      bothUrlsResource,
      noUrlResource,
    ])
    getUrls(wrapper).should.eql([
      { download: downloadUrlResource.download_url.identifier },
      { access: accessUrlResource.access_url.identifier },
      { access: anotherAccessUrlResource.access_url.identifier },
      {
        download: downloadUrlResource.download_url.identifier,
        access: accessUrlResource.access_url.identifier,
      },
      {},
    ])
  })

  describe('ResourceItem', () => {
    beforeEach(() => {
      useStores.mockReturnValue({ Locale: Stores.Locale })
    })

    const renderResource = resource =>
      mount(
        <ThemeProvider theme={etsinTheme}>
          <ResourceItem resource={resource} />
        </ThemeProvider>
      )

    it('should render resource with download url', () => {
      const wrapper = renderResource(downloadUrlResource)
      wrapper.find(Name).text().should.eql(downloadUrlResource.title)
      wrapper.find(Category).text().should.eql(downloadUrlResource.use_category.pref_label.en)
      wrapper.find(LinkButton).should.have.lengthOf(0)
      wrapper
        .find(DownloadButton)
        .prop('href')
        .should.eql(downloadUrlResource.download_url.identifier)
    })

    it('should render resource with access url', () => {
      const wrapper = renderResource(accessUrlResource)
      wrapper.find(Name).text().should.eql(accessUrlResource.title)
      wrapper.find(Category).text().should.eql(accessUrlResource.use_category.pref_label.en)
      wrapper.find(LinkButton).prop('href').should.eql(accessUrlResource.access_url.identifier)
      wrapper.find(DownloadButton).should.have.lengthOf(0)
    })

    it('should render resource with both urls', () => {
      const wrapper = renderResource(bothUrlsResource)
      wrapper.find(Name).text().should.eql(bothUrlsResource.title)
      wrapper.find(Category).text().should.eql(bothUrlsResource.use_category.pref_label.en)
      wrapper.find(LinkButton).prop('href').should.eql(bothUrlsResource.access_url.identifier)
      wrapper.find(DownloadButton).prop('href').should.eql(bothUrlsResource.download_url.identifier)
    })
  })

  describe('Grid', () => {
    it('has only download urls', () => {
      const wrapper = renderResources([downloadUrlResource])
      wrapper.find(Grid).props().should.include({
        hasDownload: true,
        showAccess: false,
      })
    })

    it('has only access urls', () => {
      const wrapper = renderResources([accessUrlResource, anotherAccessUrlResource])
      wrapper.find(Grid).props().should.include({
        hasDownload: false,
        showAccess: true,
      })
    })

    it('has same access urls', () => {
      // access urls are also displayed if all resources have the same url
      const wrapper = renderResources([accessUrlResource, accessUrlResource])
      wrapper.find(Grid).props().should.include({
        hasDownload: false,
        showAccess: true,
      })
    })

    it('has both urls', () => {
      const wrapper = renderResources([accessUrlResource, anotherAccessUrlResource, downloadUrlResource])
      wrapper.find(Grid).props().should.include({
        hasDownload: true,
        showAccess: true,
      })
    })
  })
})
