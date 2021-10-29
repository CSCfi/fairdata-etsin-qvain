import React from 'react'
import { mount } from 'enzyme'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import ReactModal from 'react-modal'
import { components } from 'react-select'

import '@/../locale/translations'
import etsinTheme from '@/styles/theme'
import { StoresProvider } from '@/stores/stores'
import { buildStores } from '@/stores'
import ShareModal from '@/components/qvain/views/datasetsV2/shareModal'

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

const testinen = {
  attributes: {
    givenName: ['Testi'],
    mail: ['testi.testinen@example.com'],
    sn: ['Testinen'],
    uid: ['testinen'],
  },
  dn: 'CN=testinen,OU=testinen_set,OU=Academic,OU=External,OU=Users,ou=idm,dc=csc,dc=fi',
}

const otherTesti = {
  attributes: {
    givenName: ['Othertesti'],
    mail: ['othertes.person@example.com'],
    sn: ['Person'],
    uid: ['person'],
  },
  dn: 'CN=testinen,OU=testinen_set,OU=Academic,OU=External,OU=Users,ou=idm,dc=csc,dc=fi',
}

const searchResultsTesti = [testinen, otherTesti]

const searchResultsTestinen = [testinen]

const mockAdapter = new MockAdapter(axios)
mockAdapter.onGet(RegExp('^/api/ldap/users/testi$')).reply(200, searchResultsTesti)
mockAdapter.onGet(RegExp('^/api/ldap/users/testinen$')).reply(200, searchResultsTestinen)
mockAdapter.onGet(RegExp('^/api/ldap/users/empty$')).reply(200, [])
mockAdapter.onGet(RegExp('^/api/ldap/users/error$')).reply(500, 'error happened')

let stores, wrapper, helper

const render = async () => {
  wrapper?.unmount?.()
  if (helper) {
    document.body.removeChild(helper)
    helper = null
  }
  stores?.QvainDatasetsV2?.share?.promiseManager?.reset()
  stores = buildStores()
  stores.Auth.setUser({
    name: 'teppo',
  })
  stores.Env.Flags.setFlag('UI.NEW_DATASETS_VIEW', true)

  const dataset = { identifier: 'jeejee' }
  stores.QvainDatasetsV2.share.modal.open({ dataset })

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
  await render()
})

const getInviteButton = () => wrapper.find('button.send-invite')

describe('ShareModal', () => {
  it('should have "Invite" tab selected', async () => {
    wrapper
      .find('button.tab-invite')
      .should.have.lengthOf(1)
  })

  it('should have "Members" tab not selected', async () => {
    wrapper
    .find('button.tab-members')
      .should.have.lengthOf(1)
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
      stores.QvainDatasetsV2.share.selectedUsers.should.eql([testUser])

      input.instance().value = 'testi'
      input.simulate('change')
      await wait(() => wrapper.find(components.Option).length > 0)
      const option2 = wrapper.find(components.Option).filter('[label*="Othertesti"]')
      option2.should.have.lengthOf(1)
      option2.simulate('click')

      wrapper.find(components.MultiValue).should.have.lengthOf(2)
      stores.QvainDatasetsV2.share.selectedUsers.should.eql([testUser, otherTestUser])
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
      stores.QvainDatasetsV2.share.inviteMessage.should.eql('This is a message')
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
          stores.QvainDatasetsV2.share.setSelectedUsers([testUser])
        })

        it('should allow canceling confirmation open', async () => {
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
          wrapper
            .find('button.tab-members[aria-selected=true]')
            .should.have.lengthOf(1)

          // click close button, modal should still be open
          wrapper.find('button[aria-label="Close"]').simulate('click')
          wrapper.find('[aria-label="shareDatasetModal"]').should.have.lengthOf(1)

          // click confirm, modal should close
          wrapper.find('span[children*="discard invitation"]').closest('button').simulate('click')
          wrapper.find('[aria-label="shareDatasetModal"]').should.have.lengthOf(0)
        })
      })

      it('should enable "invite" button', async () => {
        stores.QvainDatasetsV2.share.setSelectedUsers([testUser])
        wrapper.update()
        getInviteButton().prop('disabled').should.be.false
      })

      it('should close modal after sending invitation', async () => {
        stores.QvainDatasetsV2.share.setSelectedUsers([testUser])
        wrapper
          .find('textarea[placeholder*="message"]')
          .simulate('change', { target: { value: 'This is a message' } })
        getInviteButton().simulate('click', { button: 0 })
        jest.advanceTimersByTime(10000)
        await wait(() => wrapper.find('[aria-label="shareDatasetModal"]').length === 0)
      })

      it('should not allow closing modal while sending invitation', async () => {
        stores.QvainDatasetsV2.share.setSelectedUsers([testUser])
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
    beforeEach(() => {
      // cancel fetching permissions, set values manually
      stores.QvainDatasetsV2.share.promiseManager.reset('permissions')
      stores.QvainDatasetsV2.share.setUserPermissions([
        {
          uid: 'teppo',
          name: 'teppo testaaja',
          email: 'teppo@example.com',
          isProjectMember: true,
          role: 'owner',
        },
        {
          uid: 'member',
          name: 'Member Person',
          email: 'member@example.com',
          isProjectMember: true,
        },
        {
          uid: 'longname',
          name: 'Longlong von Longlonglonglongname',
          email: 'long@example.com',
          isProjectMember: false,
          role: 'editor',
        },
      ])

      wrapper.find('button.tab-members').simulate('click')
    })

    it('should be selected', async () => {
      wrapper
        .find('button.tab-members')
        .hostNodes()
        .should.have.lengthOf(1)
    })

    it('should show loader for tab and content', async () => {
      stores.QvainDatasetsV2.share.fetchPermissions()
      wrapper.update()
      wrapper.find('.loader-active').hostNodes().should.have.lengthOf(2)
    })

    it('should list users with roles', () => {
      const expectedPermissions = [
        ['teppo testaaja (teppo, teppo@example.com)', 'Owner'],
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
        'Member Person (member, member@example.com)',
      ]
      const members = wrapper
        .find('ul.project-member-users')
        .find('.member-name')
        .map(member => member.text())
      members.should.eql(expectedMembers)
    })
  })
})
