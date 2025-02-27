import React from 'react'
import { mount } from 'enzyme'
import axios from 'axios'
import { when } from 'mobx'
import MockAdapter from 'axios-mock-adapter'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import ReactModal from 'react-modal'
import { components } from 'react-select'

import '@/../locale/translations'
import etsinTheme from '@/styles/theme'
import { StoresProvider } from '@/stores/stores'
import { buildStores } from '@/stores'
import ShareModal from '@/components/qvain/views/datasetsV2/ShareModal'

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

const render = async () => {
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
  stores.QvainDatasets.share.modal.open({ dataset })

  await when(() => !stores.QvainDatasets.share.isLoadingPermissions)

  helper = document.createElement('div')
  document.body.appendChild(helper)
  ReactModal.setAppElement(helper)
  wrapper = mount(
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

const wait = async cond => {
  let counter = 0
  while (!cond()) {
    counter += 1
    if (counter > 100) {
      throw new Error('Wait timed out')
    }
    jest.advanceTimersByTime(1000)
    await Promise.resolve()
    wrapper.update()
  }
}

beforeEach(async () => {
  jest.resetAllMocks()
  jest.spyOn(console, 'warn').mockImplementation(() => {}) // to supress axios-mock-adapter 404 warnings
  mockAdapter = new MockAdapter(axios)
  mockAdapter.onGet(RegExp('^/api/ldap/users/testi$')).reply(200, searchResultsTesti)
  mockAdapter.onGet(RegExp('^/api/ldap/users/testinen$')).reply(200, searchResultsTestinen)
  mockAdapter.onGet(RegExp('^/api/ldap/users/empty$')).reply(200, [])
  mockAdapter.onGet(RegExp('^/api/ldap/users/error$')).reply(500, 'error happened')
  mockAdapter.onGet(RegExp('^/api/qvain/datasets/jeejee/editor_permissions$')).reply(200, [])
  mockAdapter.onPost(RegExp('^/api/qvain/datasets/jeejee/editor_permissions$')).reply(config => {
    const statuses = JSON.parse(config.data).users.map(uid => ({
      ...userInviteResponses[uid],
    }))
    return [200, { users: statuses }]
  })

  await render()
})

const getInviteButton = () => wrapper.find('button.send-invite')

describe('ShareModal', () => {
  it('should have "Invite" tab selected', async () => {
    wrapper.find('button.tab-invite').should.have.lengthOf(1)
  })

  it('should have "Members" tab not selected', async () => {
    wrapper.find('button.tab-members').should.have.lengthOf(1)
  })

  describe('Invite tab', () => {
    it('should select multiple users', async () => {
      wrapper.find(components.MultiValue).should.have.lengthOf(0)

      const input = wrapper.find('input#search-users-input')
      input.instance().value = 'testi'
      input.simulate('change')
      await wait(() => wrapper.find(components.Option).length > 0)

      const option = wrapper.find(components.Option).filter('[label*="Testi Testinen"]')
      option.should.have.lengthOf(1)
      option.simulate('click')

      wrapper.find(components.MultiValue).should.have.lengthOf(1)
      stores.QvainDatasets.share.selectedUsers.should.eql([testUser])

      input.instance().value = 'testi'
      input.simulate('change')
      await wait(() => wrapper.find(components.Option).length > 0)
      const option2 = wrapper.find(components.Option).filter('[label*="Othertesti"]')
      option2.should.have.lengthOf(1)
      option2.simulate('click')

      wrapper.find(components.MultiValue).should.have.lengthOf(2)
      stores.QvainDatasets.share.selectedUsers.should.eql([testUser, otherTestUser])
    })

    it('should show results for current input', async () => {
      const input = wrapper.find('input#search-users-input')
      input.instance().value = 'testi'
      input.simulate('change')
      jest.advanceTimersByTime(100)

      input.instance().value = 'testinen'
      input.simulate('change') // cancels previous input
      await wait(() => wrapper.find(components.Option).length > 0)

      wrapper.find(components.Option).filter('[label*="Testi Testinen"]').should.have.lengthOf(1)
      wrapper.find(components.Option).filter('[label*="Othertesti Person"]').should.have.lengthOf(0)
    })

    it('should show "no results" message', async () => {
      const input = wrapper.find('input#search-users-input')
      input.instance().value = 'empty'
      input.simulate('change')
      await wait(() => wrapper.find(components.NoOptionsMessage).length > 0)
      wrapper.find(components.NoOptionsMessage).text().should.include('No matching users found.')
    })

    it('should show error message and log error', async () => {
      jest.spyOn(console, 'error').mockImplementationOnce(() => {})
      const input = wrapper.find('input#search-users-input')
      input.instance().value = 'error'
      input.simulate('change')
      await wait(() => wrapper.find(components.NoOptionsMessage).length > 0)
      wrapper.find(components.NoOptionsMessage).text().should.include('There was an error')
      console.error.mock.calls.length.should.eql(1)
    })

    it('should clear results when trimmed string is shorter than 2 characters', async () => {
      const input = wrapper.find('input#search-users-input')
      input.instance().value = 'testi'
      input.simulate('change')
      await wait(() => wrapper.find(components.Option).length > 0)

      input.instance().value = '  z  '
      input.simulate('change')
      await wait(() => wrapper.find(components.Option).length === 0)
    })

    it('should set invite message', async () => {
      wrapper
        .find('textarea[placeholder*="message"]')
        .simulate('change', { target: { value: 'This is a message' } })
      stores.QvainDatasets.share.inviteMessage.should.eql('This is a message')
    })

    describe('given no selected users', () => {
      it('should close modal when close is clicked', async () => {
        wrapper.find('button[aria-label="Close"]').simulate('click')
        wrapper.find('[aria-label="shareDatasetModal"]').should.have.lengthOf(0)
      })

      it('should disable "invite" button', async () => {
        getInviteButton().prop('disabled').should.be.true
      })
    })

    describe('given selected users', () => {
      describe('close confirmation', () => {
        beforeEach(() => {
          stores.QvainDatasets.share.setSelectedUsers([testUser])
        })

        it('should allow canceling confirmation', async () => {
          // click close button, modal should still be open
          wrapper.find('button[aria-label="Close"]').simulate('click')
          wrapper.find('[aria-label="shareDatasetModal"]').should.have.lengthOf(1)

          // click cancel, modal should not close
          wrapper.find('span[children*="continue editing"]').closest('button').simulate('click')
          wrapper.find('[aria-label="shareDatasetModal"]').should.have.lengthOf(1)
          wrapper.find('span[children*="continue editing"]').should.have.lengthOf(0)
        })

        it('should require confirmation even if invite tab is not open', async () => {
          // open "Members" tab
          wrapper.find('button.tab-members').simulate('click')
          wrapper.find('button.tab-members[aria-selected=true]').should.have.lengthOf(1)

          // click close button, modal should still be open
          wrapper.find('button[aria-label="Close"]').simulate('click')
          wrapper.find('[aria-label="shareDatasetModal"]').should.have.lengthOf(1)

          // click confirm, modal should close
          wrapper.find('span[children*="discard invitation"]').closest('button').simulate('click')
          wrapper.find('[aria-label="shareDatasetModal"]').should.have.lengthOf(0)
        })
      })

      it('should enable "invite" button', async () => {
        stores.QvainDatasets.share.setSelectedUsers([testUser])
        wrapper.update()
        getInviteButton().prop('disabled').should.be.false
      })

      it('should show successful share', async () => {
        stores.QvainDatasets.share.setSelectedUsers([testUser])
        wrapper
          .find('textarea[placeholder*="message"]')
          .simulate('change', { target: { value: 'This is a message' } })
        getInviteButton().simulate('click', { button: 0 })
        await wait(
          () => wrapper.find('h3[children*="Successfully shared editing rights"]').length === 1
        )
        wrapper
          .find('ul.success-users')
          .text()
          .should.eql('Testi Testinen (testinen, testi.testinen@example.com)')
        wrapper
          .find('h3[children*="There was an error sharing editing rights"]')
          .should.have.lengthOf(0)
      })

      it('should show failed shares', async () => {
        stores.QvainDatasets.share.setSelectedUsers([testUser, failTestUser])
        wrapper
          .find('textarea[placeholder*="message"]')
          .simulate('change', { target: { value: 'This is a message' } })
        getInviteButton().simulate('click', { button: 0 })
        await wait(
          () => wrapper.find('h3[children*="Successfully shared editing rights"]').length === 1
        )
        wrapper.find('ul.fail-users').text().should.eql('Fail Dude (fail, fail@example.com)')
        wrapper
          .find('h3[children*="There was an error sharing editing rights"]')
          .should.have.lengthOf(1)
      })

      it('should return to invite tab and remove succesfully added users from selected', async () => {
        mockAdapter.onGet(RegExp('^/api/qvain/datasets/jeejee/editor_permissions$')).reply(200, {
          users: [
            {
              ...testUser,
              role: 'creator',
            },
          ],
        })
        stores.QvainDatasets.share.setSelectedUsers([testUser, failTestUser])
        wrapper
          .find('textarea[placeholder*="message"]')
          .simulate('change', { target: { value: 'This is a message' } })
        getInviteButton().simulate('click', { button: 0 })
        await wait(
          () => wrapper.find('h3[children*="Successfully shared editing rights"]').length === 1
        )
        wrapper.find('button[aria-label="Close"]').simulate('click')
        await wait(() => wrapper.find('input#search-users-input').length === 1)
        stores.QvainDatasets.share.selectedUsers.should.eql([failTestUser])
      })

      it('should not allow closing modal while sending invitation', async () => {
        stores.QvainDatasets.share.setSelectedUsers([testUser])
        wrapper
          .find('textarea[placeholder*="message"]')
          .simulate('change', { target: { value: 'This is a message' } })
        getInviteButton().simulate('click', { button: 0 })
        getInviteButton().prop('disabled').should.be.true // button should be disabled while inviting
        wrapper.find('button.tab-invite[aria-selected=true]').should.have.lengthOf(1)

        wrapper.find('.ReactModal__Overlay').simulate('click')
        wrapper.find('button.tab-invite[aria-selected=true]').should.have.lengthOf(1)
        wrapper.find('span[children*="discard invitation"]').should.have.lengthOf(0) // no confirmation modal
      })
    })
  })

  describe('Members tab', () => {
    beforeEach(async () => {
      mockAdapter.onGet(RegExp('^/api/qvain/datasets/jeejee/editor_permissions$')).reply(200, {
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
      await stores.QvainDatasets.share.fetchPermissions()
      wrapper.find('button.tab-members').simulate('click')
    })

    it('should be selected', async () => {
      wrapper.find('button.tab-members').hostNodes().should.have.lengthOf(1)
    })

    it('should show loader while loading permissions', async () => {
      const promise = stores.QvainDatasets.share.fetchPermissions()
      wrapper.update()
      wrapper.find('.loader-active').hostNodes().should.have.lengthOf(1)
      await promise
      wrapper.update()
      wrapper.find('.loader-active').hostNodes().should.have.lengthOf(0)
    })

    it('should show error when loading permissions fails', async () => {
      jest.spyOn(console, 'error').mockImplementationOnce(() => {})
      mockAdapter.onGet(RegExp('^/api/qvain/datasets/jeejee/editor_permissions$')).reply(400, '')
      stores.QvainDatasets.share.fetchPermissions()
      await wait(() => wrapper.find('div[children*="Error retrieving data"]').length > 0)
      expect(console.error.mock.calls.length).toBe(1)
    })

    it('should list users with roles', () => {
      const expectedPermissions = [
        ['teppo testaaja (teppo, teppo@example.com)', 'Creator'],
        ['not_in_ldap', 'Editor'],
        ['Editor Member (editormember, editormember@example.com)', 'Editor'],
        ['Longlong von Longlonglonglongname (longname, long@example.com)', 'Editor'],
      ]

      const permissions = wrapper
        .find('ul.permission-users .member-user')
        .map(user => [user.find('.member-name').text(), user.find('.member-role').text()])
      permissions.should.eql(expectedPermissions)
    })

    it('should list project members', () => {
      const expectedMembers = [
        'teppo testaaja (teppo, teppo@example.com)',
        'Editor Member (editormember, editormember@example.com)',
        'Member Person (member, member@example.com)',
      ]
      const members = wrapper
        .find('ul.project-member-users')
        .find('.member-name')
        .map(member => member.text())
      members.should.eql(expectedMembers)
    })

    it('should show project help', () => {
      // wrapper.simulate does not support triggering global events so we need to mock them here
      const handlers = {}
      jest.spyOn(document, 'addEventListener').mockImplementation((type, event) => {
        handlers[type] = event
      })

      wrapper.find('button[aria-label="Info"]').simulate('click')
      wrapper.find({ content: 'qvain.datasets.share.members.projectHelp' }).should.have.lengthOf(1)
      handlers.mousedown({})
      wrapper.update()
      wrapper.find({ content: 'qvain.datasets.share.members.projectHelp' }).should.have.lengthOf(0)
    })

    const openConfirmRemoveDialog = async memberLabel => {
      const getMember = name =>
        wrapper
          .find('.permission-users .member-user')
          .filterWhere(u => u.find('span.member-name').text() === name)
      const dropdownButton = getMember(memberLabel).find('button[aria-label="Editor"]')
      dropdownButton.simulate('click')
      const removeButton = getMember(memberLabel).find('ul[role="menu"] button[children="Remove"]')
      removeButton.simulate('click')
      await wait(() => wrapper.find('button span[children="Remove"]').length === 1)
    }

    it('should remove member editor from permissions list', async () => {
      const permissionCount = wrapper.find('.permission-users .member-user').length
      const memberCount = wrapper.find('.project-member-users .member-user').length
      mockAdapter
        .onDelete(RegExp('^/api/qvain/datasets/jeejee/editor_permissions/editormember$'))
        .reply(200, '')
      await openConfirmRemoveDialog('Editor Member (editormember, editormember@example.com)')
      wrapper.find('button span[children="Remove"]').simulate('click')
      await wait(() => wrapper.find('button span[children="Remove"]').length === 0)
      wrapper.find('.permission-users .member-user').should.have.lengthOf(permissionCount - 1)
      wrapper.find('.project-member-users .member-user').should.have.lengthOf(memberCount)
    })

    it('should remove non-member editor from permissions list', async () => {
      const permissionCount = wrapper.find('.permission-users .member-user').length
      const memberCount = wrapper.find('.project-member-users .member-user').length
      mockAdapter
        .onDelete(RegExp('^/api/qvain/datasets/jeejee/editor_permissions/not_in_ldap$'))
        .reply(200, '')
      await openConfirmRemoveDialog('not_in_ldap')
      wrapper.find('button span[children="Remove"]').simulate('click')
      await wait(() => wrapper.find('button span[children="Remove"]').length === 0)
      wrapper.find('.permission-users .member-user').should.have.lengthOf(permissionCount - 1)
      wrapper.find('.project-member-users .member-user').should.have.lengthOf(memberCount)
    })

    it('should allow member editors remove themselves from permissions list', async () => {
      stores.Auth.setUser({
        name: 'editormember',
      })
      const permissionCount = wrapper.find('.permission-users .member-user').length
      const memberCount = wrapper.find('.project-member-users .member-user').length
      mockAdapter
        .onDelete(RegExp('^/api/qvain/datasets/jeejee/editor_permissions/editormember$'))
        .reply(200, '')
      await openConfirmRemoveDialog('Editor Member (editormember, editormember@example.com)')

      wrapper.find('input#remove-self-check').should.have.lengthOf(0) // no extra check required

      wrapper.find('button span[children="Remove"]').simulate('click')
      await wait(() => wrapper.find('button span[children="Remove"]').length === 0)
      wrapper.find('.permission-users .member-user').should.have.lengthOf(permissionCount - 1)
      wrapper.find('.project-member-users .member-user').should.have.lengthOf(memberCount)
    })

    it('should require extra confirmation non-member editor remove themself from permissions list', async () => {
      stores.Auth.setUser({
        name: 'not_in_ldap',
      })
      const permissionCount = wrapper.find('.permission-users .member-user').length
      const memberCount = wrapper.find('.project-member-users .member-user').length
      mockAdapter
        .onDelete(RegExp('^/api/qvain/datasets/jeejee/editor_permissions/not_in_ldap$'))
        .reply(200, '')
      await openConfirmRemoveDialog('not_in_ldap')

      // "remove" should be disabled until checkbox is clicked
      wrapper.find('button span[children="Remove"]').closest('button').prop('disabled').should.be
        .true
      wrapper.find('input#remove-self-check').simulate('change', { target: { checked: true } })
      await wait(
        () => !wrapper.find('button span[children="Remove"]').closest('button').prop('disabled')
      )

      wrapper.find('h3[children="Share metadata editing rights"]').should.have.lengthOf(1)
      wrapper.find('button span[children="Remove"]').simulate('click')
      await wait(() => wrapper.find('button span[children="Remove"]').length === 0)

      // Modal should be closed after removing permissions from self
      wrapper.find('h3[children="Share metadata editing rights"]').should.have.lengthOf(0)
    })

    it('should cancel removing user from permissions list', async () => {
      mockAdapter
        .onDelete(RegExp('^/api/qvain/datasets/jeejee/editor_permissions/editormember$'))
        .reply(200, '')
      wrapper.find('.member-user').should.have.lengthOf(7)
      await openConfirmRemoveDialog('Editor Member (editormember, editormember@example.com)')
      wrapper.find('button[children="Cancel"]').simulate('click')
      await wait(() => wrapper.find('button span[children="Remove"]').length === 0)
      wrapper.find('.member-user').should.have.lengthOf(7)
    })

    it('should show error when deletion fails', async () => {
      mockAdapter
        .onDelete(RegExp('^/api/qvain/datasets/jeejee/editor_permissions/editormember$'))
        .reply(400, '')

      await openConfirmRemoveDialog('Editor Member (editormember, editormember@example.com)')
      wrapper.find('button span[children="Remove"]').simulate('click')
      await wait(() => wrapper.find('[children*="There was an error"]').length > 0)
    })
  })
})
