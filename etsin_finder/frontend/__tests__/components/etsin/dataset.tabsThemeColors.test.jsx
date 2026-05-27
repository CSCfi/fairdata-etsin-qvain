import { ThemeProvider } from 'styled-components'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { runInAction } from 'mobx'

import Tabs from '@/components/etsin/Dataset/tabs'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import { getThemeByApp } from '@/styles/theme'
import { LUMI_AIF_ETSIN_APP_COOKIE } from '@/utils/lumiAifEtsinSearch'

const renderTabs = app => {
  const stores = buildStores()
  runInAction(() => {
    stores.Env.app = app
  })

  render(
    <MemoryRouter initialEntries={['/dataset/undefined']}>
      <StoresProvider store={stores}>
        <ThemeProvider theme={getThemeByApp(app)}>
          <Tabs showData showEvents={false} showMaps={false} />
        </ThemeProvider>
      </StoresProvider>
    </MemoryRouter>
  )
}

describe('Dataset tabs active text color', () => {
  it('shows active tab text in dark color for LUMI-AIF theme', () => {
    renderTabs(LUMI_AIF_ETSIN_APP_COOKIE)
    expect(window.getComputedStyle(screen.getByRole('tab', { name: 'Dataset' })).color).toMatch(
      /rgb\(47,\s*31,\s*32\)|rgb\(79,\s*79,\s*79\)|black|rgb\(0,\s*0,\s*0\)/
    )
  })

  it('keeps active tab text dark for default Etsin theme', () => {
    renderTabs('etsin')
    expect(window.getComputedStyle(screen.getByRole('tab', { name: 'Dataset' })).color).toMatch(
      /black|rgb\(0,\s*0,\s*0\)/
    )
  })
})
