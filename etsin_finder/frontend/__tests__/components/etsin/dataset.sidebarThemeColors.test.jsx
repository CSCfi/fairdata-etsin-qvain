import { ThemeProvider } from 'styled-components'
import { render, screen, within } from '@testing-library/react'
import { runInAction } from 'mobx'
import { MemoryRouter } from 'react-router'

import { buildStores } from '@/stores'
import DatasetInfoItem from '@/components/etsin/Dataset/DatasetInfoItem'
import Sidebar from '@/components/etsin/Dataset/Sidebar'
import { StoresProvider } from '@/stores/stores'
import { getThemeByApp } from '@/styles/theme'
import { LUMI_AIF_ETSIN_APP_COOKIE } from '@/utils/lumiAifEtsinSearch'

const renderItem = app => {
  const stores = buildStores()
  runInAction(() => {
    stores.Env.app = app
  })

  return render(
    <StoresProvider store={stores}>
      <ThemeProvider theme={getThemeByApp(app)}>
        <dl>
          <DatasetInfoItem itemTitle="dataset.publisher">Publisher content</DatasetInfoItem>
        </dl>
      </ThemeProvider>
    </StoresProvider>
  )
}

const renderSidebar = app => {
  const stores = buildStores()
  runInAction(() => {
    stores.Env.app = app
    stores.Etsin.EtsinDataset.dataset = {
      id: 'dataset-id',
      state: 'published',
      persistent_identifier: 'doi:10.1234/example',
      other_identifiers: [],
      access_rights: {
        access_type: {
          url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
          pref_label: { en: 'Open', fi: 'Avoin' },
        },
        license: [],
      },
      theme: [],
      projects: [],
      infrastructure: [],
      actors: [],
      remote_resources: [
        {
          identifier: 'resource-1',
          title: { en: 'Resource 1' },
          data_service: 'service:lumi-aif',
        },
      ],
      data_catalog: {
        logo: 'fairdata_tree_logo.svg',
        title: { en: 'Dataset as a Service datasets', fi: 'Dataset as a Service -aineistot' },
        data_services: [
          {
            id: 'service:lumi-aif',
            pref_label: { en: 'LUMI-AIF', fi: 'LUMI-AIF' },
          },
        ],
        publisher: {
          name: { en: 'University of Jyvaskyla, Finland', fi: 'Jyvaskylan yliopisto, Suomi' },
          homepage: [{ url: 'https://www.jyu.fi/' }],
        },
      },
    }
  })

  return render(
    <StoresProvider store={stores}>
      <MemoryRouter>
        <ThemeProvider theme={getThemeByApp(app)}>
          <Sidebar />
        </ThemeProvider>
      </MemoryRouter>
    </StoresProvider>
  )
}

describe('Dataset sidebar text colors', () => {
  it('uses dark heading and content text in LUMI-AIF sidebar cards', () => {
    renderItem(LUMI_AIF_ETSIN_APP_COOKIE)
    expect(window.getComputedStyle(screen.getByText('Publisher')).color).toMatch(
      /black|rgb\(0,\s*0,\s*0\)/
    )
    expect(window.getComputedStyle(screen.getByText('Publisher content')).color).toMatch(
      /black|rgb\(0,\s*0,\s*0\)/
    )
  })

  it('keeps default dark text in normal Etsin sidebar cards', () => {
    renderItem('etsin')
    expect(window.getComputedStyle(screen.getByText('Publisher')).color).toMatch(
      /black|rgb\(0,\s*0,\s*0\)/
    )
  })

  it.each(['etsin', LUMI_AIF_ETSIN_APP_COOKIE])(
    'shows separate catalog publisher and data service sections in %s',
    app => {
      renderSidebar(app)

      const catalogHeading = screen.getByText('Catalog publisher').closest('dt')
      const catalogContent = catalogHeading.nextElementSibling
      expect(within(catalogContent).getByText('University of Jyvaskyla, Finland')).toBeInTheDocument()
      expect(
        within(catalogContent).getByAltText(/Logo for Dataset as a Service datasets/i)
      ).toBeInTheDocument()

      const dataServiceHeading = screen.getByText('Data Service').closest('dt')
      const dataServiceContent = dataServiceHeading.nextElementSibling
      expect(within(dataServiceContent).getByText('LUMI-AIF')).toBeInTheDocument()
      expect(within(dataServiceContent).getByAltText('LUMI-AIF data service logo')).toHaveAttribute(
        'src',
        expect.stringContaining('LAIF_logo_dark.png')
      )
      expect(
        within(dataServiceContent).getByRole('link', { name: 'LUMI-AIF data service logo' })
      ).toHaveAttribute(
        'href',
        'https://lumi-ai-factory.eu/'
      )
      expect(catalogHeading.closest('dl')).not.toBe(dataServiceHeading.closest('dl'))
    }
  )
})
