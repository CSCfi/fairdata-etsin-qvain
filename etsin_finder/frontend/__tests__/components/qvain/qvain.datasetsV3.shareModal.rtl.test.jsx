import { act, waitFor, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { when } from 'mobx'
import ReactModal from 'react-modal'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import ShareModal from '@/components/qvain/views/datasetsV2/ShareModal'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import etsinTheme from '@/styles/theme'

const user = userEvent.setup({ delay: null })
jest.useFakeTimers('modern')

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

const userInviteResponses = {
  testinen: {
    ...testUser,
    success: true,
    status: 201,
  },
  person: {
    ...otherTestUser,
    success: true,
    status: 201,
  },
  fail: {
    ...failTestUser,
    success: false,
    status: 400,
  },
}

const searchResultsTesti = [testUser, otherTestUser]

const searchResultsTestinen = [testUser]

let stores, wrapper, helper, mockAdapter

const renderModal = async () => {
  jest.resetAllMocks()
  wrapper?.unmount?.()
  if (helper) {
    document.body.removeChild(helper)
    helper = null
  }
  stores?.QvainDatasets?.share?.client.abort()
  stores = buildStores()
  stores.Auth.setUser({
    name: 'teppo',
  })
  stores.Env.Flags.setFlag('UI.NEW_DATASETS_VIEW', true)

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

const mockInviteWithDelay = () => {
  // Delay response from invitation endpoint so loading behavior can be tested.
  // Call jest.advanceTimersByTime(100) to resolve
  mockAdapter.onPost('/api/qvain/datasets/jeejee/editor_permissions').reply(async config => {
    const statuses = JSON.parse(config.data).users.map(uid => ({
      ...userInviteResponses[uid],
    }))
    await Promise.delay(100)
    return [200, { users: statuses }]
  })
}

beforeEach(async () => {
  jest.resetAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {}) // suppress 404 warnings
  mockAdapter = new MockAdapter(axios)
  mockAdapter.onGet('/api/ldap/users/testi').reply(200, searchResultsTesti)
  mockAdapter.onGet('/api/ldap/users/testinen').reply(200, searchResultsTestinen)
  mockAdapter.onGet('/api/ldap/users/empty').reply(200, [])
  mockAdapter.onGet('/api/ldap/users/error').reply(500, 'error happened')
  mockAdapter.onGet('/api/qvain/datasets/jeejee/editor_permissions').reply(200, [])
  mockAdapter.onPost('/api/qvain/datasets/jeejee/editor_permissions').reply(config => {
    const statuses = JSON.parse(config.data).users.map(uid => ({
      ...userInviteResponses[uid],
    }))
    return [200, { users: statuses }]
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
      await act(async () => jest.advanceTimersByTime(100))
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
        stores.QvainDatasets.share.setSelectedUsers([testUser])

        // click close button, modal should still be open
        await user.click(screen.getByRole('button', { name: 'Close' }))
        expect(screen.getByRole('dialog')).toBeInTheDocument()

        // click cancel, modal should not close
        await user.click(screen.getByRole('button', { name: /continue editing/ }))
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      it('should require confirmation even if invite tab is not open', async () => {
        await renderModal()
        stores.QvainDatasets.share.setSelectedUsers([testUser])

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
        stores.QvainDatasets.share.setSelectedUsers([testUser])
        await waitFor(() => expect(getInviteButton()).toBeEnabled())
      })

      it('should show successful share', async () => {
        await renderModal()
        stores.QvainDatasets.share.setSelectedUsers([testUser])
        await user.type(screen.getByRole('textbox', { name: 'Message' }), 'This is a message')
        await user.click(getInviteButton())
        screen.getByRole('heading', { name: /Successfully shared/ })

        const successUsers = Array.from(document.querySelectorAll('ul.success-users > li')).map(
          e => e.textContent
        )
        expect(successUsers).toEqual(['Testi Testinen (testinen, testi.testinen@example.com)'])
      })

      it('should show failed shares', async () => {
        await renderModal()
        stores.QvainDatasets.share.setSelectedUsers([testUser, failTestUser])
        await user.type(screen.getByRole('textbox', { name: 'Message' }), 'This is a message')
        await user.click(getInviteButton())
        screen.getByRole('heading', { name: /Successfully shared/ })
        const successUsers = Array.from(document.querySelectorAll('ul.fail-users > li')).map(
          e => e.textContent
        )
        expect(successUsers).toEqual(['Fail Dude (fail, fail@example.com)'])
      })

      it('should return to invite tab and remove succesfully added users from selected', async () => {
        await renderModal()
        mockAdapter.onGet('/api/qvain/datasets/jeejee/editor_permissions').reply(200, {
          users: [
            {
              ...testUser,
              role: 'creator',
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
        stores.QvainDatasets.share.setSelectedUsers([testUser])
        await user.type(screen.getByRole('textbox', { name: 'Message' }), 'This is a message')
        await user.click(getInviteButton())

        // button should be disabled while inviting
        expect(getInviteButton()).toBeDisabled()

        await user.click(document.body)
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /discard invitation/ })).not.toBeInTheDocument()
        jest.advanceTimersByTime(100)
      })
    })
  })

  describe('Members tab', () => {
    const renderMembers = async () => {
      mockAdapter.onGet('/api/qvain/datasets/jeejee/editor_permissions').reply(200, {
        users: [
          {
            uid: 'teppo',
            name: 'teppo testaaja',
            email: 'teppo@example.com',
            is_project_member: true,
            role: 'creator',
          },
          {
            uid: 'member',
            name: 'Member Person',
            email: 'member@example.com',
            is_project_member: true,
          },
          {
            uid: 'not_in_ldap',
            is_project_member: false,
            role: 'editor',
          },
          {
            uid: 'longname',
            name: 'Longlong von Longlonglonglongname',
            email: 'long@example.com',
            is_project_member: false,
            role: 'editor',
          },
          {
            uid: 'editormember',
            name: 'Editor Member',
            email: 'editormember@example.com',
            is_project_member: true,
            role: 'editor',
          },
        ],
        project: 'some_project',
      })
      await renderModal()
      await stores.QvainDatasets.share.fetchPermissions()
      await user.click(screen.getByRole('tab', { name: /Members/ }))
    }

    it('should show error when loading permissions fails', async () => {
      await renderMembers()
      mockAdapter.onGet('/api/qvain/datasets/jeejee/editor_permissions').reply(400, '')
      await stores.QvainDatasets.share.fetchPermissions()
      expect(screen.getByText(/Error retrieving data/)).toBeInTheDocument()
      expect(console.error.mock.calls.length).toBe(1)
    })

    it('should list users with roles', async () => {
      await renderMembers()
      const expectedPermissions = [
        ['teppo testaaja (teppo, teppo@example.com)', 'Creator'],
        ['not_in_ldap', 'Editor'],
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
        .onDelete('/api/qvain/datasets/jeejee/editor_permissions/editormember')
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

    it('should remove non-member editor from permissions list', async () => {
      await renderMembers()
      const permissionCount = document.querySelectorAll('.permission-users .member-user').length
      const memberCount = document.querySelectorAll('.project-member-users .member-user').length
      mockAdapter
        .onDelete(RegExp('^/api/qvain/datasets/jeejee/editor_permissions/not_in_ldap$'))
        .reply(200, '')
      await openConfirmRemoveDialog('not_in_ldap')
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
        .onDelete('/api/qvain/datasets/jeejee/editor_permissions/editormember')
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

    it('should require extra confirmation non-member editor remove themself from permissions list', async () => {
      await renderMembers()
      stores.Auth.setUser({
        name: 'not_in_ldap',
      })
      mockAdapter
        .onDelete('/api/qvain/datasets/jeejee/editor_permissions/not_in_ldap')
        .reply(200, '')
      await openConfirmRemoveDialog('not_in_ldap')

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
      expect(document.querySelectorAll('.member-user')).toHaveLength(7)
      await openConfirmRemoveDialog('Editor Member (editormember, editormember@example.com)')
      await user.click(screen.getByRole('button', { name: 'Cancel' }))
      expect(document.querySelectorAll('.member-user')).toHaveLength(7)
    })

    it('should show error when deletion fails', async () => {
      await renderMembers()
      mockAdapter
        .onDelete('/api/qvain/datasets/jeejee/editor_permissions/editormember')
        .reply(400, '')

      await openConfirmRemoveDialog('Editor Member (editormember, editormember@example.com)')
      await user.click(screen.getByRole('button', { name: 'Remove' }))
      await waitFor(() => expect(screen.getAllByText(/There was an error/)[0]).toBeInTheDocument())
    })
  })
})
