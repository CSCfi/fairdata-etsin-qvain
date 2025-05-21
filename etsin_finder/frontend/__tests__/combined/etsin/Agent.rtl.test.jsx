import { ThemeProvider } from 'styled-components'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import etsinTheme from '@/styles/theme'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import Agent from '@/components/etsin/Dataset/Agent'

const stores = buildStores()

const personAgent = {
  person: {
    name: 'Mauno Majava',
    url: 'maunon_identifieri',
    homepage: {
      url: 'https://www.example.com',
      description: { fi: 'Näillä sivuilla on kaikenlaista.' },
      title: { fi: 'Maailman parhaat kotskasivut' },
    },
    organization: {
      pref_label: { en: 'Organization subsub' },
      parent: {
        pref_label: { en: 'Organization sub' },
        parent: { pref_label: { en: 'Organization' } },
      },
    },
  },
}

const orgAgent = {
  person: {
    name: { en: 'Some organization' },
    homepage: {
      url: 'https://www.example.com',
      description: { fi: 'Näillä sivuilla on kaikenlaista.' },
      title: { fi: 'Maailman parhaat kotskasivut' },
    },
  },
  organization: {
    pref_label: { en: 'Organization subsub' },
    url: 'https://orcid.org/jotain',
    parent: {
      pref_label: { en: 'Organization sub' },
      parent: { pref_label: { en: 'Organization' } },
    },
  },
}

const renderAgent = agent =>
  render(
    <ThemeProvider theme={etsinTheme}>
      <StoresProvider store={stores}>
        <Agent agent={agent} />
      </StoresProvider>
    </ThemeProvider>
  )

describe('Agent', () => {
  describe('Person', () => {
    it('should render person pref_label and show tooltip', async () => {
      renderAgent(personAgent)
      const link = screen.getByRole('link', { name: 'Mauno Majava' })
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      await userEvent.click(link)
      expect(screen.getByRole('tooltip', { name: 'Mauno Majava' })).toBeInTheDocument()
    })
  })

  describe('Organization', () => {
    it('should render organization pref_label and tooltip', async () => {
      renderAgent(orgAgent)
      const link = screen.getByRole('link', { name: 'Some organization' })
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      await userEvent.click(link)
      const tooltip = screen.getByRole('tooltip')
      expect(within(tooltip).getByRole('heading', 'Some organization')).toBeInTheDocument()
      expect(within(tooltip).getByText('https://orcid.org/jotain')).toBeInTheDocument()
      expect(within(tooltip).getByText('Organization')).toBeInTheDocument()
      expect(within(tooltip).getByText('Organization sub')).toBeInTheDocument()
      expect(within(tooltip).getByText('Organization subsub')).toBeInTheDocument()
    })
  })
})
