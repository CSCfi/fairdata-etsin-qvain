import { screen } from '@testing-library/react'

import { contextRenderer } from '@/../__tests__/test-helpers'
import AskForAccess from '@/components/etsin/Dataset/AskForAccess'
import REMSButton from '@/components/etsin/Dataset/AskForAccess/REMSButton'
import { buildStores } from '@/stores'
import EnvClass from '@/stores/domain/env'

const Env = new EnvClass()
Env.Flags.setFlag('ETSIN.REMS', true)

const getStores = () => {
  const stores = buildStores({ Env })
  stores.Auth.userLogged = true
  return stores
}

const access = {
  access_type: {
    url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/permit',
  },
  rems_approval_type: 'automatic',
}

describe('AskForAccess', () => {
  it('should render null', () => {
    const stores = getStores()
    const { container } = contextRenderer(<AskForAccess cr_id="test" />, { stores })
    expect(container.children).toHaveLength(0)
  })

  it('should render REMSButton', () => {
    const stores = getStores()
    stores.Access.updateAccess(access, false, 'apply')
    contextRenderer(<AskForAccess cr_id="test" />, { stores })
    expect(screen.getByRole('button', { name: 'Ask for access' })).toBeInTheDocument()
  })
})

describe('REMSButton', () => {
  const stores = getStores()

  const getById = id => document.getElementById(id)

  it('should render REMSButton as disabled', () => {
    contextRenderer(<REMSButton applicationState="disabled" loading={false} />, { stores })
    getById('rems-button-error')
    expect(getById('rems-button-error').hasAttribute('disabled')).toEqual(true)
  })

  it('should render REMSButton for apply', () => {
    contextRenderer(<REMSButton applicationState="apply" loading={false} />, {
      stores,
    })
    expect(getById('rems-button-apply')).toBeInTheDocument()
  })

  it('should render REMSButton for draft', () => {
    contextRenderer(<REMSButton applicationState="draft" loading={false} />, {
      stores,
    })
    expect(getById('rems-button-draft')).toBeInTheDocument()
  })

  it('should render REMSButton for submitted', () => {
    contextRenderer(<REMSButton applicationState="submitted" loading={false} />, { stores })
    expect(getById('rems-button-submitted')).toBeInTheDocument()
  })

  it('should render REMSButton for approved', () => {
    contextRenderer(<REMSButton applicationState="approved" loading={false} />, {
      stores,
    })
    expect(getById('rems-button-approved')).toBeInTheDocument()
  })

  it('should render REMSButton for rejected', () => {
    contextRenderer(<REMSButton applicationState="rejected" loading={false} />, {
      stores,
    })
    expect(getById('rems-button-rejected')).toBeInTheDocument()
  })

  it('should render REMSButton for loading', () => {
    contextRenderer(<REMSButton applicationState="apply" loading />, { stores })
    expect(document.querySelector('.loader-active')).toBeInTheDocument()
  })
})
