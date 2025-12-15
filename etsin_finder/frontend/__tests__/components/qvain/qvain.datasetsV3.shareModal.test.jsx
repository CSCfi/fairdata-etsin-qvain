import { act, waitFor, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { when } from 'mobx'
import ReactModal from 'react-modal'
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from 'styled-components'

import ShareModal from '@/components/qvain/views/datasetsV2/ShareModal'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import etsinTheme from '@/styles/theme'

vi.useFakeTimers()
vi.setConfig({ testTimeout: 5000 })
const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime, delay: null })

const testUser = {
  name: 'Testi Testinen',
  email: 'testi.testinen@example.com',
  uid: 'testinen',
}

const otherTestUser = {
  name: 'Othertesti Person',
  email: 'othertes.person@example.com',
  uid: 'person',
}

const failTestUser = {
  name: 'Fail Dude',
  email: 'fail@example.com',
  uid: 'fail',
}

let stores, wrapper, helper, mockAdapter

const renderModal = async () => {
  vi.resetAllMocks()
  vi.spyOn(console, 'error')
  wrapper?.unmount?.()
  if (helper) {
    document.body.removeChild(helper)
    helper = null
  }
  stores?.QvainDatasets?.share?.client.abort()
  stores = buildStores()
  stores.Auth.setUser({
    name: 'teppo',
    admin_organizations: [],
    available_admin_organizations: [{ id: 'test.csc.fi', pref_label: { en: 'Test Organization' } }],
    default_admin_organization: { id: 'test.csc.fi' },
  })
  stores.Env.setMetaxV3Host('metaxv3', 443)
  const dataset = { identifier: 'jeejee' }
  stores.QvainDatasets.share.setSearchDelay(0)
  stores.QvainDatasets.share.modal.open({ dataset })

  await when(() => !stores.QvainDatasets.share.isLoadingPermissions)

  helper = document.createElement('div')
  document.body.appendChild(helper)
  ReactModal.setAppElement(helper)
  wrapper = render(
    <StoresProvider store={stores}>
      <BrowserRouter>
        <ThemeProvider theme={etsinTheme}>
          <ShareModal />
        </ThemeProvider>
      </BrowserRouter>
    </StoresProvider>,
    { attachTo: helper }
  )
}

const selectUser = async name => {
  const input = screen.getByRole('combobox', { name: 'Users' })
  await user.type(input, name)
  const option = await screen.findByRole('option')
  await user.click(option)
}

const mockInviteWithDelay = () => {
  // Delay response from invitation endpoint so loading behavior can be tested.
  // Call vi.advanceTimersByTime(100) to resolve
  mockAdapter.onPost('https://metaxv3:443/v3/datasets/jeejee/permissions').reply(async config => {
    await Promise.delay(100)
    return [200, config.data]
  })
}

beforeEach(async () => {
  vi.resetAllMocks()
  mockAdapter = new MockAdapter(axios)
  mockAdapter.onGet('https://metaxv3:443/v3/datasets/jeejee/permissions').reply(200, {
    creators: [
      {
        username: 'testinen',
        first_name: 'Testinen',
        last_name: 'Testinen',
        email: 'testinen@example.com',
      },
    ],
    editors: [],
    csc_project_members: [],
  })

  mockAdapter.onGet('/api/ldap/users/testi').reply(200, [testUser, otherTestUser])
  mockAdapter.onGet('/api/ldap/users/testinen').reply(200, [testUser])
  mockAdapter.onGet('/api/ldap/users/fail').reply(200, [failTestUser])
  mockAdapter.onGet('/api/ldap/users/empty').reply(200, [])
  mockAdapter.onGet('/api/ldap/users/error').reply(500, 'error happened')
  mockAdapter.onGet(/\/api\/ldap\/users\/.*/).reply(200, [])
  mockAdapter.onGet('https://metaxv3:443/v3/datasets/jeejee/permissions').reply(200, {
    creators: [
      {
        username: 'teppo',
        fairdata_username: 'teppo',
        first_name: 'teppo',
        last_name: 'testaaja',
        email: 'teppo@example.com',
      },
    ],
    editors: [],
    csc_project: 'some_project',
  })
  mockAdapter.onGet('https://metaxv3:443/v3/datasets/jeejee/permissions/editors').reply(200, [])
  mockAdapter.onPost('https://metaxv3:443/v3/datasets/jeejee/permissions/editors').reply(config => {
    const data = JSON.parse(config.data)
    if (data.username == 'fail') {
      return [400, 'fail dude fails']
    }
    return [200, config.data]
  })
})

const getInviteButton = () => screen.getByRole('button', { name: 'Invite' })

describe('ShareModal', () => {
  it('should have "Invite" tab selected', async () => {
    await renderModal()
    const invite = document.querySelector('button.tab-invite')
    expect(invite).toHaveAttribute('aria-selected', 'true')
    const members = document.querySelector('button.tab-members')
    expect(members).toHaveAttribute('aria-selected', 'false')
  })

  describe('Invite tab', () => {
    it('should select multiple users', async () => {
      await renderModal()
      const input = screen.getByRole('combobox', { name: 'Users' })
      await user.type(input, 'testi')
      const opt = await screen.findByRole('option', { name: /Testi Testinen/ })
      await user.click(opt)
      stores.QvainDatasets.share.selectedUsers.should.eql([testUser])

      await user.click(input)
      await user.type(input, 'testi')
      const opt2 = await screen.findByRole('option', { name: /Othertesti/ })
      await user.click(opt2)
      stores.QvainDatasets.share.selectedUsers.should.eql([testUser, otherTestUser])
    })

    it('should show results for current input', async () => {
      await renderModal()
      stores.QvainDatasets.share.setSearchDelay(50)
      const input = screen.getByRole('combobox', { name: 'Users' })
      await user.type(input, 'testi')
      await user.type(input, 'nen') // cancels previous input
      await act(async () => vi.advanceTimersByTime(100))
      expect(screen.getAllByRole('option').map(v => v.textContent)).toEqual([
        'Testi Testinen (testinen, testi.testinen@example.com)',
      ])
    })

    it('should show "no results" message', async () => {
      await renderModal()
      const input = screen.getByRole('combobox', { name: 'Users' })
      await user.type(input, 'empty')
      await screen.findByText('No matching users found.')
    })

    it('should show error message and log error', async () => {
      await renderModal()
      console.error.mockImplementation(() => undefined) // suppress error
      const input = screen.getByRole('combobox', { name: 'Users' })
      await user.type(input, 'error')
      await screen.findByText(/There was an error/)
      expect(console.error.mock.calls.length > 0).toBe(true)
    })

    it('should clear results when trimmed string is shorter than 2 characters', async () => {
      await renderModal()
      const input = screen.getByRole('combobox', { name: 'Users' })
      await user.type(input, 'testi')
      await waitFor(() => expect(screen.getAllByRole('option').length > 0).toBe(true))

      await user.clear(input)
      await user.type(input, '  z  ')
      expect(screen.queryAllByRole('option')).toHaveLength(0)
    })

    it('should set invite message', async () => {
      await renderModal()

      // message is disabled when no users are selected
      const msg = screen.getByRole('textbox', { name: 'Message' })
      expect(msg).toBeDisabled()

      // select user
      const input = screen.getByRole('combobox', { name: 'Users' })
      await user.type(input, 'testi')
      const opt = await screen.findByRole('option', { name: /Testi Testinen/ })
      await user.click(opt)

      // message should now be writable
      expect(msg).toBeEnabled()
      await user.type(msg, 'This is a message')
      stores.QvainDatasets.share.inviteMessage.should.eql('This is a message')
    })

    describe('given no selected users', () => {
      it('should close modal when close is clicked', async () => {
        await renderModal()
        await user.click(screen.getByRole('button', { name: 'Close' }))
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      it('should disable "invite" button', async () => {
        await renderModal()
        expect(getInviteButton()).toBeDisabled()
      })
    })

    describe('given selected users', () => {
      it('should allow canceling confirmation', async () => {
        await renderModal()
        await selectUser('testinen')

        // click close button, modal should still be open
        await user.click(screen.getByRole('button', { name: 'Close' }))
        expect(screen.getByRole('dialog')).toBeInTheDocument()

        // click cancel, modal should not close
        await user.click(screen.getByRole('button', { name: /continue editing/ }))
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      it('should require confirmation even if invite tab is not open', async () => {
        await renderModal()
        await selectUser('testinen')

        // open "Members" tab
        const members = screen.getByRole('tab', { name: /Members/ })
        await user.click(members)
        expect(members).toHaveAttribute('aria-selected')

        // click close button, modal should still be open
        await user.click(screen.getByRole('button', { name: 'Close' }))
        expect(screen.getByRole('dialog')).toBeInTheDocument()

        // click cancel, modal should not close
        await user.click(screen.getByRole('button', { name: /discard invitation/ }))
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      it('should enable "invite" button', async () => {
        await renderModal()
        await selectUser('testinen')
        await waitFor(() => expect(getInviteButton()).toBeEnabled())
      })

      it('should show successful share', async () => {
        await renderModal()
        await selectUser('testinen')
        await user.type(screen.getByRole('textbox', { name: 'Message' }), 'This is a message')
        await user.click(getInviteButton())

        await screen.findByRole('heading', { name: /Successfully shared/ })
        const successUsers = Array.from(document.querySelectorAll('ul.success-users > li')).map(
          e => e.textContent
        )
        expect(successUsers).toEqual(['Testi Testinen (testinen, testi.testinen@example.com)'])
      })

      it('should show failed shares', async () => {
        await renderModal()
        console.error.mockImplementation(() => undefined) // suppress error
        await selectUser('testinen')
        await selectUser('fail')

        await user.type(screen.getByRole('textbox', { name: 'Message' }), 'This is a message')
        await user.click(getInviteButton())
        await screen.findByRole('heading', { name: /Successfully shared/ })
        const failUsers = Array.from(document.querySelectorAll('ul.fail-users > li')).map(
          e => e.textContent
        )
        expect(failUsers).toEqual(['Fail Dude (fail, fail@example.com)'])
      })

      it('should return to invite tab and remove succesfully added users from selected', async () => {
        await renderModal()
        console.error.mockImplementation(() => undefined) // suppress error
        mockAdapter.onGet('https://metaxv3:443/v3/datasets/jeejee/permissions').reply(200, {
          creators: [
            {
              first_name: 'Testi',
              last_name: 'Testinen',
              email: 'testi.testinen@example.com',
              username: 'testinen',
              fairdata_username: 'testinen',
            },
          ],
        })
        stores.QvainDatasets.share.setSelectedUsers([testUser, failTestUser])
        await user.type(screen.getByRole('textbox', { name: 'Message' }), 'This is a message')
        await user.click(getInviteButton())
        await user.click(screen.getAllByRole('button', { name: 'Close' })[1])
        stores.QvainDatasets.share.selectedUsers.should.eql([failTestUser])
      })

      it('should not allow closing modal while sending invitation', async () => {
        mockInviteWithDelay()
        await renderModal()
        await selectUser('testinen')
        await user.type(screen.getByRole('textbox', { name: 'Message' }), 'This is a message')
        await user.click(getInviteButton())

        // button should be disabled while inviting
        expect(getInviteButton()).toBeDisabled()

        await user.click(document.body)
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /discard invitation/ })).not.toBeInTheDocument()
        vi.advanceTimersByTime(100)
      })
    })
  })

  describe('Members tab', () => {
    const renderMembers = async () => {
      mockAdapter.onGet('https://metaxv3:443/v3/datasets/jeejee/permissions').reply(200, {
        creators: [
          {
            username: 'teppo',
            fairdata_username: 'teppo',
            first_name: 'teppo',
            last_name: 'testaaja',
            email: 'teppo@example.com',
          },
        ],
        editors: [
          {
            username: 'longname',
            fairdata_username: 'longname',
            first_name: 'Longlong',
            last_name: 'von Longlonglonglongname',
            email: 'long@example.com',
          },
          {
            username: 'editormember',
            fairdata_username: 'editormember',
            first_name: 'Editor',
            last_name: 'Member',
            email: 'editormember@example.com',
          },
        ],
        csc_project_members: [
          {
            username: 'teppo',
            fairdata_username: 'teppo',
            first_name: 'teppo',
            last_name: 'testaaja',
            email: 'teppo@example.com',
          },
          {
            username: 'member',
            fairdata_username: 'member',
            first_name: 'Member',
            last_name: 'Person',
            email: 'member@example.com',
          },
          {
            username: 'editormember',
            fairdata_username: 'editormember',
            first_name: 'Editor',
            last_name: 'Member',
            email: 'editormember@example.com',
          },
        ],
        csc_project: 'some_project',
      })
      await renderModal()
      await stores.QvainDatasets.share.fetchPermissions()
      await user.click(screen.getByRole('tab', { name: /Members/ }))
    }

    it('should show error when loading permissions fails', async () => {
      await renderMembers()
      console.error.mockImplementation(() => undefined) // suppress error
      mockAdapter.onGet('https://metaxv3:443/v3/datasets/jeejee/permissions').reply(400, '')
      await stores.QvainDatasets.share.fetchPermissions()
      expect(screen.getByText(/Error retrieving data/)).toBeInTheDocument()
      expect(console.error.mock.calls.length).toBe(1)
    })

    it('should list users with roles', async () => {
      await renderMembers()
      const expectedPermissions = [
        ['teppo testaaja (teppo, teppo@example.com)', 'Creator'],
        ['Editor Member (editormember, editormember@example.com)', 'Editor'],
        ['Longlong von Longlonglonglongname (longname, long@example.com)', 'Editor'],
      ]

      const permissions = Array.from(
        document.querySelectorAll('ul.permission-users .member-user')
      ).map(usr => [
        usr.querySelector('.member-name').textContent,
        usr.querySelector('.member-role').textContent,
      ])
      permissions.should.eql(expectedPermissions)
    })

    it('should list project members', async () => {
      await renderMembers()
      const expectedMembers = [
        'teppo testaaja (teppo, teppo@example.com)',
        'Editor Member (editormember, editormember@example.com)',
        'Member Person (member, member@example.com)',
      ]
      const members = Array.from(
        document.querySelectorAll('ul.project-member-users .member-name')
      ).map(member => member.textContent)
      members.should.eql(expectedMembers)
    })

    it('should show project help', async () => {
      await renderMembers()
      await user.click(screen.getByRole('button', { name: 'Info' }))
      expect(
        screen.getByText(stores.Locale.translate('qvain.datasets.share.members.projectHelp'))
      ).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Info' }))
      expect(
        screen.queryByText(stores.Locale.translate('qvain.datasets.share.members.projectHelp'))
      ).not.toBeInTheDocument()
    })

    const getMember = name =>
      Array.from(document.querySelectorAll('.permission-users .member-user')).filter(
        u => u.querySelector('span.member-name').textContent === name
      )[0]

    const openConfirmRemoveDialog = async memberLabel => {
      const member = getMember(memberLabel)
      const dropdownButton = within(member).getByRole('button', { name: 'Editor' })
      await user.click(dropdownButton)
      const removeButton = within(member).getByRole('button', { name: 'Remove' })
      await user.click(removeButton)
    }

    it('should remove member editor from permissions list', async () => {
      await renderMembers()
      const permissionCount = document.querySelectorAll('.permission-users .member-user').length
      const memberCount = document.querySelectorAll('.project-member-users .member-user').length
      mockAdapter
        .onDelete('https://metaxv3:443/v3/datasets/jeejee/permissions/editors/editormember')
        .reply(200, '')
      await openConfirmRemoveDialog('Editor Member (editormember, editormember@example.com)')

      await user.click(screen.getByRole('button', { name: 'Remove' }))
      expect(document.querySelectorAll('.permission-users .member-user')).toHaveLength(
        permissionCount - 1
      )
      expect(document.querySelectorAll('.project-member-users .member-user')).toHaveLength(
        memberCount
      )
    })

    it('should allow member editors remove themselves from permissions list', async () => {
      await renderMembers()
      stores.Auth.setUser({
        name: 'editormember',
      })
      const permissionCount = document.querySelectorAll('.permission-users .member-user').length
      const memberCount = document.querySelectorAll('.project-member-users .member-user').length
      mockAdapter
        .onDelete('https://metaxv3:443/v3/datasets/jeejee/permissions/editors/editormember')
        .reply(200, '')
      await openConfirmRemoveDialog('Editor Member (editormember, editormember@example.com)')

      expect(document.querySelector('input#remove-self-check')).not.toBeInTheDocument() // no extra check required
      await user.click(screen.getByRole('button', { name: 'Remove' }))

      expect(document.querySelectorAll('.permission-users .member-user')).toHaveLength(
        permissionCount - 1
      )
      expect(document.querySelectorAll('.project-member-users .member-user')).toHaveLength(
        memberCount
      )
    })

    it('should require extra confirmation for non-member editor remove themself from permissions list', async () => {
      await renderMembers()
      stores.Auth.setUser({
        name: 'longname',
      })
      mockAdapter
        .onDelete('https://metaxv3:443/v3/datasets/jeejee/permissions/editors/longname')
        .reply(200, '')

      await openConfirmRemoveDialog(
        'Longlong von Longlonglonglongname (longname, long@example.com)'
      )

      // "remove" should be disabled until checkbox is clicked
      const removeButton = screen.getByRole('button', { name: 'Remove' })
      expect(removeButton).toBeDisabled()
      await user.click(screen.getByRole('checkbox', { name: /Please check to confirm/ }))

      expect(removeButton).toBeEnabled()
      await user.click(removeButton)

      // Modal should be closed after removing permissions from self
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should cancel removing user from permissions list', async () => {
      await renderMembers()
      expect(document.querySelectorAll('.member-user')).toHaveLength(6)
      await openConfirmRemoveDialog('Editor Member (editormember, editormember@example.com)')
      await user.click(screen.getByRole('button', { name: 'Cancel' }))
      expect(document.querySelectorAll('.member-user')).toHaveLength(6)
    })

    it('should show error when deletion fails', async () => {
      await renderMembers()
      mockAdapter
        .onDelete('https://metaxv3:443/v3/datasets/jeejee/permissions/editors/editormember')
        .reply(400, '')

      await openConfirmRemoveDialog('Editor Member (editormember, editormember@example.com)')
      await user.click(screen.getByRole('button', { name: 'Remove' }))
      await waitFor(() => expect(screen.getAllByText(/There was an error/)[0]).toBeInTheDocument())
    })
  })
})
