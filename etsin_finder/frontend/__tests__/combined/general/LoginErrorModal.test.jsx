import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import ReactModal from 'react-modal'

import '@/../locale/translations'
import etsinTheme from '@/styles/theme'
import { StoresProvider } from '@/stores/stores'
import LoginErrorModal from '@/layout/LoginErrorModal'
import { buildStores } from '@/stores'

import axios from 'axios'

jest.mock('axios')

axios.get.mockReturnValue(Promise.resolve({}))
const mockLocation = {
  pathname: '/',
}

const unauthenticated = {
  is_authenticated: false,
  is_authenticated_CSC_user: false,
  home_organization_id: null,
  home_organization_name: null,
  user_ida_projects: [],
  is_using_rems: true,
}

const authenticated = {
  is_authenticated: true,
  is_authenticated_CSC_user: true,
  home_organization_id: 'csc.fi',
  home_organization_name: 'CSC - Tieteen tietotekniikan keskus Oy',
  user_ida_projects: ['test_project'],
  is_using_rems: false,
  user_csc_name: 'masa',
  first_name: 'Matti',
  last_name: 'Tepponen',
}

const noUserName = { ...authenticated, user_csc_name: null }

const noOrganizationId = { ...authenticated, home_organization_id: null }

describe('Etsin frontpage', () => {
  let wrapper, helper

  const render = async () => {
    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)
    const stores = buildStores()
    await stores.Auth.checkLogin()

    wrapper = mount(
      <StoresProvider store={stores}>
        <ThemeProvider theme={etsinTheme}>
          <main>
            <LoginErrorModal location={mockLocation} />
          </main>
        </ThemeProvider>
      </StoresProvider>,
      { attachTo: helper }
    )
  }
  beforeAll(async () => {})

  it('should not show modal for successful login', async () => {
    axios.get.mockReturnValueOnce(Promise.resolve({ data: authenticated }))
    await render()
    wrapper.find(LoginErrorModal).children().should.have.lengthOf(0)
  })

  it('should not show modal for unauthenticated user', async () => {
    axios.get.mockReturnValueOnce(Promise.resolve({ data: unauthenticated }))
    await render()
    wrapper.find(LoginErrorModal).children().should.have.lengthOf(0)
  })

  it('should show modal for login with missing username', async () => {
    axios.get.mockReturnValueOnce(Promise.resolve({ data: noUserName }))
    await render()
    wrapper
      .find('[aria-modal]')
      .text()
      .should.contain('Please make sure that you have a valid CSC account.')
  })

  it('should show modal for login with missing home organization', async () => {
    axios.get.mockReturnValueOnce(Promise.resolve({ data: noOrganizationId }))
    await render()
    wrapper
      .find('[aria-modal]')
      .text()
      .should.contain('your account does not seem to have a home organization')
  })

  it('should delete session when modal is closed', async () => {
    axios.delete.mockClear()
    axios.get.mockReturnValueOnce(Promise.resolve({ data: noOrganizationId }))
    await render()
    wrapper.find('[aria-modal]').should.have.lengthOf(1)
    wrapper.find('button[aria-label="Close"]').simulate('click')
    wrapper.find('[aria-modal]').should.have.lengthOf(0)
    expect(axios.delete.mock.calls).toHaveLength(1)
  })

  afterAll(() => {
    wrapper?.unmount?.()
    document.body.removeChild(helper)
  })
})
