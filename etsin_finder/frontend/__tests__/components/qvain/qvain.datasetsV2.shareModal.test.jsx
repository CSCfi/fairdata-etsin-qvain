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

const getInviteButton = () => wrapper.find('button span[children="Invite"]').closest('button')

describe('ShareModal', () => {
  it('should have "invite" tab selected', async () => {
    wrapper.find('[role="tab"][children="Invite"][aria-selected=true]').should.have.lengthOf(1)
  })

  it('should have "members" tab not selected', async () => {
    wrapper
      .find('[role="tab"][children="Members"]:not([aria-selected=true])')
      .should.have.lengthOf(1)
  })

  it('should select user', async () => {
    const input = wrapper.find('input#search-users-input')
    input.instance().value = 'testi'
    input.simulate('change')
    await wait(() => wrapper.find(components.Option).length > 0)

    const option = wrapper.find(components.Option).filter('[label*="Testi Testinen"]')
    option.should.have.lengthOf(1)

    option.simulate('click')
    wrapper
      .find(components.MultiValue)
      .find('div[children*="Testi Testinen"]')
      .should.have.lengthOf(1)
    stores.QvainDatasetsV2.share.selectedUsers.should.eql([testUser])
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
        wrapper.find('[role="tab"][children="Members"]').simulate('click')
        wrapper.find('[role="tab"][children="Members"][aria-selected=true]').should.have.lengthOf(1)

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
      wrapper.find('[role="tab"][children="Invite"][aria-selected=true]').should.have.lengthOf(1)

      wrapper.find('.ReactModal__Overlay').simulate('click')
      wrapper.find('[role="tab"][children="Invite"][aria-selected=true]').should.have.lengthOf(1)
      wrapper.find('span[children*="discard invitation"]').should.have.lengthOf(0) // no confirmation modal
    })
  })
})
