import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { within, screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ThemeProvider } from 'styled-components'
import { MemoryRouter } from 'react-router'
import ReactModal from 'react-modal'

import etsinTheme from '@/styles/theme'
import { StoresProvider } from '@/stores/stores'
import { buildStores } from '@/stores'
import EnvClass from '@/stores/domain/env'
import DatasetsV2 from '@/components/qvain/views/datasetsV2'
import { ApplicationBuilder } from '@testdata/rems.data'
import { dataset_rems } from '@testdata/metaxv3/datasets/dataset_ida_a.data'
import { tableToObjects } from '@helpers'

const mockAdapter = new MockAdapter(axios)

let stores, helper, builder

const getStores = () => {
  const Env = new EnvClass()
  Env.setMetaxV3Host('metaxv3', 443)
  Env.Flags.setFlag('QVAIN.METAX_V3.FRONTEND', true)
  Env.Flags.setFlag('QVAIN.REMS', true)
  Env.app = 'qvain'
  const _stores = buildStores({ Env })

  _stores.Locale.setLang('en')
  _stores.Auth.setUser({
    name: 'antti',
    first_name: 'Antti',
    last_name: 'Admini',
    email: 'antti@example.com',
    admin_organizations: ['test.csc.fi'],
    available_admin_organizations: [{ id: 'test.csc.fi', pref_label: { en: 'Test Organization' } }],
    default_admin_organization: { id: 'test.csc.fi' },
  })
  return _stores
}

const renderApplications = async ({ showCount = null } = {}) => {
  if (helper) {
    helper.remove()
    helper = null
  }
  stores = getStores()
  if (showCount) {
    stores.QvainDatasets.setShowCount(showCount)
  }

  helper = document.createElement('div')
  document.body.appendChild(helper)
  ReactModal.setAppElement(helper)
  render(
    <StoresProvider store={stores}>
      <MemoryRouter>
        <ThemeProvider theme={etsinTheme}>
          <DatasetsV2 />
        </ThemeProvider>
      </MemoryRouter>
    </StoresProvider>
  )
  const tab = await screen.findByRole('tab', { name: /applications/ })
  await userEvent.click(tab)
}

describe('Qvain REMS applications', () => {
  beforeEach(() => {
    mockAdapter.reset()
    mockAdapter.onGet('https://metaxv3:443/v3/datasets').reply(200, [])
    mockAdapter
      .onGet('https://metaxv3:443/v3/datasets/4eb1c1ac-b2a7-4e45-8c63-099b0e7ab4b0')
      .reply(200, dataset_rems)
    builder = new ApplicationBuilder()
    builder.register(mockAdapter)
  })

  it('lists applications', async () => {
    builder.build({ state: 'application.state/submitted' })
    builder.build({ state: 'application.state/draft', roles: ['applicant'] })
    builder.build({ state: 'application.state/approved' })
    builder.build({ state: 'application.state/rejected' })
    builder.build({ state: 'application.state/closed' })

    await renderApplications()

    // Latest application first, only show applications where user is handler
    const table = tableToObjects(screen.getByRole('table'))
    expect(table).toEqual([
      {
        Application: '2026/5',
        Dataset: 'REMS Dataset manual',
        Applicant: 'Test User',
        Status: 'Application closed',
        View: 'View',
      },
      {
        Application: '2026/4',
        Dataset: 'REMS Dataset manual',
        Applicant: 'Test User',
        Status: 'Application denied',
        View: 'View',
      },
      {
        Application: '2026/3',
        Dataset: 'REMS Dataset manual',
        Applicant: 'Test User',
        Status: 'Access granted',
        View: 'View',
      },
      {
        Application: '2026/1',
        Dataset: 'REMS Dataset manual',
        Applicant: 'Test User',
        Status: 'Waiting for review',
        View: 'View',
      },
    ])
  })

  it('allows approving applications', async () => {
    builder.build()
    await renderApplications()
    const viewButton = screen.getByRole('button', { name: 'View' })
    await userEvent.click(viewButton)

    let dialog = screen.getByRole('dialog')
    expect(within(dialog).getByRole('button', { name: 'Waiting for review' })).toBeInTheDocument()

    const actionButton = within(dialog).getByRole('button', { name: 'Approve or reject' })
    await userEvent.click(actionButton)

    const commentForm = within(dialog).getByLabelText(/Add comment/)
    await userEvent.type(commentForm, 'great application')

    const approveButton = within(dialog).getByRole('button', { name: 'Approve' })
    await userEvent.click(approveButton)

    expect(within(dialog).getByRole('button', { name: 'Access granted' })).toBeInTheDocument()

    // Check approval request
    expect(mockAdapter.history.post).toHaveLength(1)
    const url = mockAdapter.history.post[0].url
    const payload = JSON.parse(mockAdapter.history.post[0].data)
    expect(url).toEqual('https://metaxv3:443/v3/rems/applications/1/approve')
    expect(payload).toEqual({
      comment: 'great application',
    })
  })

  it('allows rejecting applications', async () => {
    builder.build()
    await renderApplications()
    const viewButton = screen.getByRole('button', { name: 'View' })
    await userEvent.click(viewButton)

    let dialog = screen.getByRole('dialog')
    expect(within(dialog).getByRole('button', { name: 'Waiting for review' })).toBeInTheDocument()

    const actionButton = within(dialog).getByRole('button', { name: 'Approve or reject' })
    await userEvent.click(actionButton)

    const commentForm = within(dialog).getByLabelText(/Add comment/)
    await userEvent.type(commentForm, 'bad application')

    const rejectButton = within(dialog).getByRole('button', { name: 'Reject' })

    await userEvent.click(rejectButton)

    expect(within(dialog).getByRole('button', { name: 'Application denied' })).toBeInTheDocument()

    // Check rejection request
    expect(mockAdapter.history.post).toHaveLength(1)
    const url = mockAdapter.history.post[0].url
    const payload = JSON.parse(mockAdapter.history.post[0].data)
    expect(url).toEqual('https://metaxv3:443/v3/rems/applications/1/reject')
    expect(payload).toEqual({
      comment: 'bad application',
    })
  })

  it('allows closing applications', async () => {
    builder.build()
    await renderApplications()
    const viewButton = screen.getByRole('button', { name: 'View' })
    await userEvent.click(viewButton)

    let dialog = screen.getByRole('dialog')
    expect(within(dialog).getByRole('button', { name: 'Waiting for review' })).toBeInTheDocument()

    const actionButton = within(dialog).getByRole('button', { name: 'Close application' })
    await userEvent.click(actionButton)

    const commentForm = within(dialog).getByLabelText(/Add comment/)
    await userEvent.type(commentForm, 'no longer relevant')

    // The confirmation button also says "Close application"
    const confirmButton = within(dialog).getAllByRole('button', { name: 'Close application' })[1]

    await userEvent.click(confirmButton)

    expect(within(dialog).getByRole('button', { name: 'Application closed' })).toBeInTheDocument()

    // Check rejection request
    expect(mockAdapter.history.post).toHaveLength(1)
    const url = mockAdapter.history.post[0].url
    const payload = JSON.parse(mockAdapter.history.post[0].data)
    expect(url).toEqual('https://metaxv3:443/v3/rems/applications/1/close')
    expect(payload).toEqual({
      comment: 'no longer relevant',
    })
  })

  it('allows returning applications', async () => {
    builder.build()
    await renderApplications()
    const viewButton = screen.getByRole('button', { name: 'View' })
    await userEvent.click(viewButton)

    let dialog = screen.getByRole('dialog')
    expect(within(dialog).getByRole('button', { name: 'Waiting for review' })).toBeInTheDocument()

    const actionButton = within(dialog).getByRole('button', { name: 'Request changes' })
    await userEvent.click(actionButton)

    const commentForm = within(dialog).getByLabelText(/Add comment/)
    await userEvent.type(commentForm, 'improve ur application')

    // The confirmation button also says "Request changes"
    const confirmButton = within(dialog).getAllByRole('button', { name: 'Request changes' })[1]
    await userEvent.click(confirmButton)

    expect(
      within(dialog).getByRole('button', { name: 'Application needs to be amended' })
    ).toBeInTheDocument()

    // Check rejection request
    expect(mockAdapter.history.post).toHaveLength(1)
    const url = mockAdapter.history.post[0].url
    const payload = JSON.parse(mockAdapter.history.post[0].data)
    expect(url).toEqual('https://metaxv3:443/v3/rems/applications/1/return')
    expect(payload).toEqual({
      comment: 'improve ur application',
    })
  })
})
