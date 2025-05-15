import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { configure } from 'mobx'
import React from 'react'
import ReactModal from 'react-modal'

import { contextRenderer } from '@/../__tests__/test-helpers'
import AddedActors from '@/components/qvain/sections/Actors/Field/addedActors'
import ActorModal from '@/components/qvain/sections/Actors/Modal'
import EnvClass from '@/stores/domain/env'
import { useStores } from '@/stores/stores'
import LocaleClass from '@/stores/view/locale'
import QvainClass from '@/stores/view/qvain'
import { Actor, Organization, Person, maybeReference } from '@/stores/view/qvain/qvain.actors'
import { ENTITY_TYPE, ROLE } from '@/utils/constants'
import removeEmpty from '@/utils/removeEmpty'
import organizationMockGet, {
  AaltoDepartmentOfMediaIdentifier,
  AaltoIdentifier,
  NotReallyReferenceIdentifier,
  dataset,
} from '../../__testdata__/qvain.actors.data'

const helper = document.createElement('div')
ReactModal.setAppElement(helper)

// Make sure MobX store values are not mutated outside actions.
configure({
  enforceActions: 'always',
})

const mockAdapter = new MockAdapter(axios)

jest.mock('@/stores/stores', () => ({
  ...jest.requireActual('@/stores/stores'),
  useStores: jest.fn(),
}))

const Env = new EnvClass()
const Qvain = new QvainClass(Env)
const Locale = new LocaleClass(Env)

const stores = {
  Env,
  Qvain,
  Locale,
}

beforeEach(() => {
  mockAdapter.reset()
  stores.Qvain.resetQvainStore()
  stores.Qvain.Actors.clearReferenceOrganizations()
  useStores.mockReturnValue(stores)
})

describe('Qvain.Actors', () => {
  it('should list all added actors', async () => {
    contextRenderer(<AddedActors />, { stores })
    expect(screen.getByText('No actors have been added.')).toBeInTheDocument()
    stores.Qvain.Actors.saveActor(
      Actor({
        type: ENTITY_TYPE.ORGANIZATION,
        roles: [ROLE.PUBLISHER],
        organizations: [
          Organization({
            name: {
              en: 'University of Helsinki',
            },
          }),
        ],
      })
    )
    stores.Qvain.Actors.saveActor(
      Actor({
        type: ENTITY_TYPE.PERSON,
        roles: [ROLE.CREATOR],
        person: Person({
          name: 'Teppo Testaaja',
          email: 'teppo@test.fi',
        }),
        organizations: [
          Organization({
            name: {
              en: 'University of Helsinki',
            },
          }),
        ],
      })
    )
    stores.Qvain.Actors.saveActor(
      Actor({
        type: ENTITY_TYPE.PERSON,
        roles: [ROLE.RIGHTS_HOLDER],
        person: Person({
          name: 'Tuppo Testaaja',
          email: 'tuppo@test.fi',
        }),
        organizations: [
          Organization({
            name: {
              en: 'University of Helsinki',
            },
          }),
        ],
      })
    )
    stores.Qvain.Actors.saveActor(
      Actor({
        type: ENTITY_TYPE.PERSON,
        roles: [ROLE.CONTRIBUTOR],
        person: Person({
          name: 'Toppo Testaaja',
          email: 'toppo@test.fi',
        }),
        organizations: [
          Organization({
            name: {
              en: 'University of Test',
            },
          }),
          Organization({
            name: {
              en: 'Department of Testing',
            },
          }),
        ],
      })
    )

    await waitFor(() => {
      const labels = Array.from(document.querySelectorAll('.actor-label')).map(e => e.textContent)
      expect(labels).toEqual([
        'University of Helsinki / Publisher',
        'Teppo Testaaja / Creator',
        'Tuppo Testaaja / Rights holder',
        'Toppo Testaaja / Contributor',
      ])
    })
  })
})

describe('Qvain.Actors modal', () => {
  const renderModal = async () => {
    mockAdapter.onGet().reply(({ url }) => [200, organizationMockGet(url)])
    await stores.Qvain.editDataset(dataset)
    stores.Qvain.Actors.editActor(Actor())
    useStores.mockReturnValue(stores)
    contextRenderer(<ActorModal />, { stores })
    await Promise.delay(0) // wait for reference data to get loaded
  }

  it('renders person selection by default', async () => {
    await renderModal()
    expect(screen.getByRole('radio', { name: 'Person' }).hasAttribute('checked')).toBe(true)
    const { actorInEdit } = stores.Qvain.Actors
    expect(actorInEdit.type).toBe(ENTITY_TYPE.PERSON)
  })

  it('changes actor type', async () => {
    await renderModal()
    await userEvent.click(screen.getByRole('radio', { name: 'Organization' }))
    const { actorInEdit } = stores.Qvain.Actors
    expect(actorInEdit.type).toBe(ENTITY_TYPE.ORGANIZATION)
  })

  it('adds role', async () => {
    await renderModal()
    await userEvent.click(screen.getByRole('checkbox', { name: /Creator/ }))
    expect(stores.Qvain.Actors.actorInEdit.roles).toEqual(['creator'])
  })

  it('removes role', async () => {
    await renderModal()
    const { actors, editActor } = stores.Qvain.Actors
    editActor(actors.find(actor => actor.person.name === 'Teppo Testihenkilö'))
    const { actorInEdit } = stores.Qvain.Actors
    expect(actorInEdit.roles.slice().sort()).toEqual(['contributor', 'creator', 'rights_holder'])
    await userEvent.click(screen.getByRole('checkbox', { name: /Creator/ }))
    expect(actorInEdit.roles.slice().sort()).toEqual(['contributor', 'rights_holder'])
  })

  it('removes organization levels one at a time', async () => {
    await renderModal()
    const { actors, editActor } = stores.Qvain.Actors
    editActor(actors.find(actor => actor.organizations.length === 2))
    const { actorInEdit } = stores.Qvain.Actors
    expect(actorInEdit.organizations.length).toBe(2)

    await userEvent.click(await screen.findByRole('button', { name: 'Remove' }))
    expect(actorInEdit.organizations.length).toBe(1)

    await userEvent.click(await screen.findByRole('button', { name: 'Remove' }))
    expect(actorInEdit.organizations.length).toBe(0)
  })

  it('adds new organization when "add organization manually" is clicked in menu', async () => {
    await renderModal()
    const { actors, editActor, setActorOrganizations } = stores.Qvain.Actors
    editActor(actors.find(actor => actor.organizations.length === 2))
    const { actorInEdit } = stores.Qvain.Actors
    setActorOrganizations(actorInEdit, [])
    expect(actorInEdit.organizations.length).toBe(0)

    const topOrg = screen.getByTestId('org-level-0')
    await userEvent.click(within(topOrg).getByRole('combobox')) // open menu
    await userEvent.click(within(topOrg).getByRole('option', { name: 'Add new organization' }))
    expect(actorInEdit.organizations.length).toBe(1)
    expect(actorInEdit.organizations[0].isReference).toBe(false)
  })

  it('shows dataset organizations in menu', async () => {
    await renderModal()
    const { actors, editActor, setActorOrganizations } = stores.Qvain.Actors
    editActor(actors.find(actor => actor.organizations.length === 2))
    const { actorInEdit } = stores.Qvain.Actors
    setActorOrganizations(actorInEdit, [])

    const topOrg = screen.getByTestId('org-level-0')
    await userEvent.click(within(topOrg).getByRole('combobox')) // open menu
    const opts = within(topOrg)
      .getAllByRole('option')
      .map(o => o.textContent)
    expect(opts).toEqual([
      'Add new organization',
      'Aalto University',
      'Aalto University, Department of Media',
      'Not Really a Reference Org',
      'Not Really a Reference Org, Manual Org',
      'Some Organization',
      'Some University',
      'Aalto University',
      'University of Eastern Finland',
    ])
  })

  it('loads email address for manually added organization', async () => {
    await renderModal()
    const { allOrganizationsFlat } = stores.Qvain.Actors
    const org = allOrganizationsFlat.find(o => o.name.en === 'Manual Org')
    expect(org.email).toBe('manual@notreference.com')
  })

  it('adds organization when clicked', async () => {
    await renderModal()
    const { allOrganizationsFlat, actors, editActor, setActorOrganizations } = stores.Qvain.Actors
    const aalto = allOrganizationsFlat.find(org => org.name.en === 'Aalto University')

    editActor(actors.find(actor => actor.organizations.length === 2))
    const { actorInEdit } = stores.Qvain.Actors
    setActorOrganizations(actorInEdit, [])
    expect(actorInEdit.organizations.length).toBe(0)

    const topOrg = screen.getByTestId('org-level-0')
    await userEvent.click(within(topOrg).getByRole('combobox')) // open menu
    await userEvent.click(within(topOrg).getAllByRole('option', { name: 'Aalto University' })[0])

    expect(actorInEdit.organizations).toEqual([aalto])
    expect(actorInEdit.organizations[0].isReference).toBe(true)
  })

  it('adds child organization when clicked', async () => {
    await renderModal()
    const { actors, editActor, setActorOrganizations } = stores.Qvain.Actors
    const { allOrganizationsFlat } = stores.Qvain.Actors
    const aalto = allOrganizationsFlat.find(org => org.name.en === 'Aalto University')
    const department = allOrganizationsFlat.find(org => org.name.en === 'Department of Media')

    editActor(actors.find(actor => actor.organizations.length === 2))
    const { actorInEdit } = stores.Qvain.Actors
    setActorOrganizations(actorInEdit, [aalto])
    expect(actorInEdit.organizations).toEqual([aalto])

    const subOrg = await screen.findByTestId('org-level-1')
    await userEvent.click(within(subOrg).getByRole('combobox')) // open menu
    await userEvent.click(within(subOrg).getAllByRole('option', { name: 'Department of Media' })[0])
    expect(actorInEdit.organizations).toEqual([aalto, department])
    expect(actorInEdit.organizations[1].isReference).toBe(true)
  })

  it('adds entire organization hierarchy at once', async () => {
    await renderModal()
    const { actors, editActor, setActorOrganizations } = stores.Qvain.Actors
    const { allOrganizationsFlat } = stores.Qvain.Actors
    const aalto = allOrganizationsFlat.find(org => org.name.en === 'Aalto University')
    const department = allOrganizationsFlat.find(org => org.name.en === 'Department of Media')

    editActor(actors.find(actor => actor.organizations.length === 2))
    const { actorInEdit } = stores.Qvain.Actors
    setActorOrganizations(actorInEdit, [])

    const topOrg = screen.getByTestId('org-level-0')
    await userEvent.click(within(topOrg).getByRole('combobox')) // open menu
    await userEvent.click(
      within(topOrg).getByRole('option', { name: 'Aalto University, Department of Media' })
    )

    expect(actorInEdit.organizations).toEqual([aalto, department])
    expect(actorInEdit.organizations[0].isReference).toBe(true)
  })

  it('edits manually added organization', async () => {
    await renderModal()
    const { actors, editActor, setActorOrganizations } = stores.Qvain.Actors

    editActor(actors.find(actor => actor.organizations.length === 2))
    const { actorInEdit } = stores.Qvain.Actors
    setActorOrganizations(actorInEdit, [
      Organization({
        name: { en: 'Org', fi: 'Moro' },
        email: 'org@example.com',
        identifier: 'custom_identifier',
      }),
    ])

    await userEvent.click(await screen.findByLabelText('Edit organization details'))

    const nameInput = screen.getByLabelText('Organization name', { exact: false })
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'New Name')
    expect(actorInEdit.organizations[0].name.en).toBe('New Name')
    expect(actorInEdit.organizations[0].name.fi).toBe('Moro')

    const emailInput = screen.getByLabelText('Organization email', { exact: false })
    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'new_email@example.com')
    expect(actorInEdit.organizations[0].email).toBe('new_email@example.com')

    const identifierInput = screen.getByLabelText('Organization identifier', { exact: false })
    await userEvent.clear(identifierInput)
    await userEvent.type(identifierInput, 'new_identifier')
    expect(actorInEdit.organizations[0].identifier).toBe('new_identifier')
  })

  it('adds language to organization name if none exist', async () => {
    await renderModal()
    const { actors, editActor, setActorOrganizations } = stores.Qvain.Actors

    editActor(actors.find(actor => actor.organizations.length === 2))
    const { actorInEdit } = stores.Qvain.Actors
    setActorOrganizations(actorInEdit, [
      Organization({
        name: {},
        email: 'org@example.com',
        identifier: 'custom_identifier',
      }),
    ])

    await userEvent.click(await screen.findByLabelText('Edit organization details'))
    const nameInput = screen.getByLabelText('Organization name', { exact: false })
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'New Name')
    expect(actorInEdit.organizations[0].name.en).toBe('New Name')
  })

  it('prevents editing person', async () => {
    await renderModal()
    const { editActor, actors } = stores.Qvain.Actors
    editActor(actors.find(actor => actor.type === ENTITY_TYPE.PERSON))
    stores.Qvain.setPreservationState(80)

    // Expect disabled inputs:
    // - person/organization radio buttons
    // - 5 role checkboxes
    // - name, email, identifier
    await waitFor(() => {
      const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"])'))
      expect(inputs.length).toBe(11)
      inputs.forEach(c => expect(c).toBeDisabled())
    })

    // Organization selection should be disabled
    const selects = Array.from(document.querySelectorAll('combobox'))
    selects.forEach(c => expect(c).toBeDisabled())

    // 1 manual org details button, 2 modal close buttons
    const enabledButtons = Array.from(document.querySelectorAll('button:not([disabled])'))
    expect(enabledButtons.length).toBe(3)
  })

  it('prevents editing organization', async () => {
    await renderModal()
    const { editActor, actors } = stores.Qvain.Actors
    editActor(actors.find(actor => actor.type === ENTITY_TYPE.ORGANIZATION))
    stores.Qvain.setPreservationState(80)

    // Expect disabled inputs:
    // - person/organization radio buttons
    // - 5 role checkboxes
    // - name, email, identifier
    await waitFor(() => {
      const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"])'))
      expect(inputs.length).toBe(8)
      inputs.forEach(c => expect(c).toBeDisabled())
    })

    // Organization selection should be disabled
    const selects = Array.from(document.querySelectorAll('combobox'))
    selects.forEach(c => expect(c).toBeDisabled())

    // 2 modal close buttons
    const enabledButtons = Array.from(document.querySelectorAll('button:not([disabled])'))
    expect(enabledButtons.length).toBe(2)
  })
})

describe('Qvain.Actors reference organizations', () => {
  beforeEach(() => {
    mockAdapter.onGet().reply(({ url }) => [200, organizationMockGet(url)])
  })

  it('fetches reference organizations', async () => {
    const orgs = await stores.Qvain.Actors.fetchReferenceOrganizations()
    expect(orgs.length).toBe(2)
    const testOrg = orgs[0]
    expect(testOrg.identifier).toBe(AaltoIdentifier)
    expect(testOrg.name.en).toBe('Aalto University')
  })

  it('fails to fetch reference organizations', async () => {
    mockAdapter.onGet().reply(400, 'Oops. Fail.')

    const { referenceOrganizations, referenceOrganizationErrors, fetchReferenceOrganizations } =
      stores.Qvain.Actors

    expect.assertions(3)
    try {
      await fetchReferenceOrganizations()
    } catch (error) {
      expect(error.response.data).toBe('Oops. Fail.')
    }
    expect(Object.values(referenceOrganizations).length).toBe(0)
    expect(Object.values(referenceOrganizationErrors).length).toBe(1)
  })

  it('identifies actor being edited as a reference organization', async () => {
    mockAdapter.onGet().reply(({ url }) => [200, organizationMockGet(url)])
    const { editActor, referenceOrganizations, fetchReferenceOrganizations } = stores.Qvain.Actors
    editActor(
      Actor({
        organizations: [
          Organization({
            name: {
              fi: 'Aalto yliopisto',
              und: 'Aalto yliopisto',
              en: 'Aalto University',
              sv: 'Aalto universitetet',
            },
            email: '',
            identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076',
            isReference: null,
          }),
        ],
      })
    )
    const { actorInEdit } = stores.Qvain.Actors

    expect(actorInEdit.organizations[0].isReference).toBe(null)
    await fetchReferenceOrganizations()
    expect(actorInEdit.organizations[0].isReference).toBe(true)

    // Should be a copy of the reference organization.
    const aalto = referenceOrganizations[''].find(org => org.identifier === AaltoIdentifier)
    expect(actorInEdit.organizations[0]).toEqual(aalto)
    expect(actorInEdit.organizations[0]).not.toBe(aalto)
  })

  it('uses cached reference organizations when fetching again', async () => {
    mockAdapter.onGet().reply(({ url }) => [200, organizationMockGet(url)])
    const orgs = await stores.Qvain.Actors.fetchReferenceOrganizations()
    expect(await stores.Qvain.Actors.fetchReferenceOrganizations()).toBe(orgs)
  })

  it('returns empty array for non-reference organization for get', async () => {
    const org = Organization({ identifier: 'http://example.com/not_reference' })
    expect(stores.Qvain.Actors.getReferenceOrganizations(org)).toEqual([])
  })

  it('returns empty array for non-reference organization for fetch', async () => {
    const org = Organization({ identifier: 'http://example.com/not_reference' })
    expect(await stores.Qvain.Actors.fetchReferenceOrganizations(org)).toEqual([])
  })

  it('fetches child reference organizations', async () => {
    mockAdapter.onGet().reply(({ url }) => [200, organizationMockGet(url)])
    const orgs = await stores.Qvain.Actors.fetchReferenceOrganizations()
    const testOrg = orgs[0]
    const childOrgs = await stores.Qvain.Actors.fetchReferenceOrganizations(testOrg)
    expect(childOrgs.length).toBe(6)
  })

  it('fetches reference organizations only once', async () => {
    mockAdapter.onGet().reply(({ url }) => [200, organizationMockGet(url)])
    const promise1 = stores.Qvain.Actors.fetchReferenceOrganizations()
    const promise2 = stores.Qvain.Actors.fetchReferenceOrganizations()
    const orgs1 = await promise1
    const orgs2 = await promise2
    expect(orgs1.length).toBe(2)
    expect(orgs2).toEqual(orgs1)
    expect(mockAdapter.history.get.length).toBe(1)
  })

  it('fetches child reference organizations only once', async () => {
    mockAdapter.onGet().reply(({ url }) => [200, organizationMockGet(url)])
    const orgs = await stores.Qvain.Actors.fetchReferenceOrganizations()
    const testOrg = orgs[0]

    const promise1 = stores.Qvain.Actors.fetchReferenceOrganizations(testOrg)
    const promise2 = stores.Qvain.Actors.fetchReferenceOrganizations(testOrg)
    const orgs1 = await promise1
    const orgs2 = await promise2
    expect(orgs1.length).toBe(6)
    expect(orgs2).toEqual(orgs1)
    expect(mockAdapter.history.get.length).toBe(2)
  })

  it('determines which organizations are reference organizations', async () => {
    mockAdapter.onGet().reply(({ url }) => [200, organizationMockGet(url)])
    const { actors, fetchAllDatasetReferenceOrganizations } = stores.Qvain.Actors
    stores.Qvain.editDataset(dataset)

    // References haven't been fetched yet, so we only know that some
    // organizations definitely aren't reference organizations.
    actors.forEach(actor => {
      actor.organizations.forEach(org => {
        if (maybeReference(org.identifier)) {
          expect(org.isReference).toBe(null) // maybe reference
        } else {
          expect(org.isReference).toBe(false) // not reference
        }
      })
    })

    await fetchAllDatasetReferenceOrganizations()

    // Now isReference is known for all organizations.
    actors.forEach(actor => {
      actor.organizations.forEach(org => {
        if (org.identifier === NotReallyReferenceIdentifier) {
          expect(org.isReference).toBe(false)
        } else {
          expect(org.isReference).toBe(maybeReference(org.identifier))
        }
      })
    })
  })

  it('fetches reference organizations for actor', async () => {
    mockAdapter.onGet().reply(({ url }) => [200, organizationMockGet(url)])
    const { fetchReferenceOrganizations, getReferenceOrganizationsForActor } = stores.Qvain.Actors
    const orgs = await fetchReferenceOrganizations()
    const aalto = orgs.find(org => org.identifier === AaltoIdentifier)
    const childOrgs = await fetchReferenceOrganizations(aalto)

    const actor = Actor({
      roles: ['creator'],
      person: Person({
        name: 'Teppo Testaaja',
        email: 'teppo@example.com',
      }),
      organizations: [aalto],
    })

    expect(getReferenceOrganizationsForActor(actor, 0)).toEqual(orgs)
    expect(getReferenceOrganizationsForActor(actor, 1)).toEqual(childOrgs)
    expect(getReferenceOrganizationsForActor(actor, 2)).toEqual([])
  })

  it('fetches reference organizations for actor', async () => {
    const { fetchReferenceOrganizations, getReferenceOrganizationsForActor } = stores.Qvain.Actors
    mockAdapter.onGet().replyOnce(({ url }) => [200, organizationMockGet(url)])
    const orgs = await fetchReferenceOrganizations()
    const aalto = orgs.find(org => org.identifier === AaltoIdentifier)
    mockAdapter.onGet().replyOnce(({ url }) => [200, organizationMockGet(url)])
    const childOrgs = await fetchReferenceOrganizations(aalto)

    const actor = Actor({
      roles: ['creator'],
      person: Person({
        name: 'Teppo Testaaja',
        email: 'teppo@example.com',
      }),
      organizations: [aalto],
    })

    expect(getReferenceOrganizationsForActor(actor, 0)).toEqual(orgs)
    expect(getReferenceOrganizationsForActor(actor, 1)).toEqual(childOrgs)
    expect(getReferenceOrganizationsForActor(actor, 2)).toEqual([])
  })

  it('return 0 reference child organizations for manually added organization', async () => {
    const { fetchReferenceOrganizations, getReferenceOrganizationsForActor } = stores.Qvain.Actors
    mockAdapter.onGet().replyOnce(({ url }) => [200, organizationMockGet(url)])
    const orgs = await fetchReferenceOrganizations()
    const someOrg = orgs.find(org => org.name.en === 'Some Organization')

    const actor = Actor({
      roles: ['creator'],
      person: Person({
        name: 'Teppo Testaaja',
        email: 'teppo@example.com',
      }),
      organizations: [someOrg],
    })

    // manually added org has no child reference organizations
    expect(getReferenceOrganizationsForActor(actor, 0)).toEqual(orgs)
    expect(getReferenceOrganizationsForActor(actor, 1)).toEqual([])
  })
})

describe('Qvain.Actors store', () => {
  it('loads actors from dataset', async () => {
    stores.Qvain.editDataset(dataset)

    const asdasd = stores.Qvain.Actors.actors.find(
      actor => actor.person && actor.person.name === 'Asdasd J. Qwerty'
    )
    expect(asdasd.roles.slice().sort()).toEqual(['creator', 'publisher', 'rights_holder'])
    expect(asdasd.person.email).toEqual('asdasd@test.com')

    const teppo = stores.Qvain.Actors.actors.find(
      actor => actor.person && actor.person.name === 'Teppo Testihenkilö'
    )
    expect(teppo.roles.slice().sort()).toEqual(['contributor', 'creator', 'rights_holder'])

    const aalto = stores.Qvain.Actors.actors.find(
      actor =>
        actor.type === ENTITY_TYPE.ORGANIZATION &&
        actor.organizations[0].name.en === 'Aalto University'
    )
    expect(aalto.roles.slice().sort()).toEqual(['creator', 'curator'])
    expect(aalto.organizations[0].identifier).toBe(AaltoIdentifier)

    expect(aalto.organizations[1].name.en).toBe('Department of Media')
    expect(aalto.organizations[1].identifier).toBe(AaltoDepartmentOfMediaIdentifier)
  })

  it('merges identical actor organizations', async () => {
    stores.Qvain.editDataset(dataset)
    const { actors } = stores.Qvain.Actors
    const aalto = actors.find(actor => actor.organizations[0].name.en === 'Aalto University')
    const aaltoUIID = aalto.organizations[0].uiid
    let count = 0
    actors.forEach(actor =>
      actor.organizations.forEach(org => {
        if (org.name.en === 'Aalto University') {
          expect(org.uiid).toBe(aaltoUIID)
          count += 1
        } else {
          expect(org.uiid).not.toBe(aaltoUIID)
        }
      })
    )
    expect(count).toBe(2)
  })

  it('merges actor organizations with top-level reference organizations', async () => {
    stores.Qvain.editDataset(dataset)
    const { actors, referenceOrganizations } = stores.Qvain.Actors

    mockAdapter.onGet().replyOnce(({ url }) => [200, organizationMockGet(url)])
    await stores.Qvain.Actors.fetchReferenceOrganizations()
    const aalto = referenceOrganizations[''].find(org => org.name.en === 'Aalto University')
    const aaltoUIID = aalto.uiid
    let count = 0
    actors.forEach(actor =>
      actor.organizations.forEach(org => {
        if (org.name.en === 'Aalto University') {
          expect(org.uiid).toBe(aaltoUIID)
          count += 1
        } else {
          expect(org.uiid).not.toBe(aaltoUIID)
        }
      })
    )
    expect(count).toBe(2)
  })

  it('merges actor organizations with child reference organizations', async () => {
    stores.Qvain.editDataset(dataset)
    const { actors, referenceOrganizations } = stores.Qvain.Actors

    mockAdapter.onGet().replyOnce(({ url }) => [200, organizationMockGet(url)])
    await stores.Qvain.Actors.fetchReferenceOrganizations()
    const aalto = referenceOrganizations[''].find(org => org.name.en === 'Aalto University')

    let count = 0
    mockAdapter.onGet().replyOnce(({ url }) => [200, organizationMockGet(url)])
    await stores.Qvain.Actors.fetchReferenceOrganizations(aalto)
    const department = referenceOrganizations[AaltoIdentifier].find(
      org => org.name.en === 'Department of Media'
    )
    const departmentUIID = department.uiid

    actors.forEach(actor =>
      actor.organizations.forEach(org => {
        if (org.name.en === 'Department of Media') {
          expect(org.uiid).toBe(departmentUIID)
          count += 1
        } else {
          expect(org.uiid).not.toBe(departmentUIID)
        }
      })
    )
    expect(count).toBe(1)
  })

  it('always considers child org of a non-reference org to be a non-reference org', async () => {
    stores.Qvain.editDataset(dataset)
    const {
      actors,
      fetchReferenceOrganizations,
      mergeActorsOrganizationsWithReferences,
      setActors,
    } = stores.Qvain.Actors
    mockAdapter.onGet().reply(({ url }) => [200, organizationMockGet(url)])
    await fetchReferenceOrganizations()
    const actor = Actor({
      type: ENTITY_TYPE.ORGANIZATION,
      roles: [ROLE.PUBLISHER],
      organizations: [
        Organization({
          name: {
            en: 'Manually added non-reference org',
          },
          identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/1234567890',
        }),
        Organization({
          name: {
            en: 'Aalto University',
            fi: 'Aalto yliopisto',
            sv: 'Aalto universitetet',
            und: 'Aalto yliopisto',
          },
          identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076',
          isReference: null,
        }),
      ],
    })
    setActors([actor])
    mergeActorsOrganizationsWithReferences()
    expect(actors[0].organizations[0].isReference).toBe(false)
    expect(actors[0].organizations[1].isReference).toBe(false)
  })
})

describe('Qvain.Actors store', () => {
  it('removes actor', async () => {
    stores.Qvain.editDataset(dataset)
    const { removeActor, actors } = stores.Qvain.Actors
    const first = actors[0]
    const second = actors[1]
    await removeActor(first)
    expect(actors[0]).toBe(second)
  })

  it('edits a clone of actor', async () => {
    stores.Qvain.editDataset(dataset)
    const { editActor, actors } = stores.Qvain.Actors
    editActor(actors[0])
    const { actorInEdit } = stores.Qvain.Actors
    expect(actorInEdit.uiid).toBe(actors[0].uiid)
    expect(actorInEdit).not.toBe(actors[0])
    expect(actorInEdit.person).not.toBe(actors[0].person)
    expect(actorInEdit.organizations).not.toBe(actors[0].organizations)
  })

  it('saves changes made to cloned actor', async () => {
    stores.Qvain.editDataset(dataset)
    const { saveActor, editActor, actors } = stores.Qvain.Actors
    editActor(actors[0])
    const { actorInEdit, updateActor, updateOrganization } = stores.Qvain.Actors
    updateActor(actorInEdit, {
      person: {
        name: 'Mauno',
      },
    })
    updateOrganization(actorInEdit.organizations[0], {
      name: {
        en: 'New Org',
      },
    })
    expect(actors[0].person.name).not.toBe('Mauno')
    expect(actors[0].organizations[0].name.en).not.toBe('New Org')
    saveActor(actorInEdit)
    expect(actors[0].person.name).toBe('Mauno')
    expect(actors[0].organizations[0].name.en).toBe('New Org')
  })

  it('creates a new actor and organization', async () => {
    stores.Qvain.editDataset(dataset)
    const { saveActor, actors } = stores.Qvain.Actors
    const actor = Actor({
      roles: ['creator'],
      person: Person({
        name: 'Teppo Testaaja',
        email: 'teppo@example.com',
      }),
      organizations: [
        Organization({
          name: {
            en: 'New Org',
          },
        }),
      ],
    })
    const oldLength = actors.length
    saveActor(actor)

    expect(actors.length).toBe(oldLength + 1)
    expect(actors[actors.length - 1].person.name).toBe('Teppo Testaaja')
    expect(actors[actors.length - 1].uiid).toEqual(expect.anything())
    expect(actors[actors.length - 1].organizations[0].name.en).toBe('New Org')
    expect(actors[actors.length - 1].organizations[0].uiid).toEqual(expect.anything())
  })

  it('creates new actor and updates existing organization', async () => {
    stores.Qvain.editDataset(dataset)
    const { saveActor, actors } = stores.Qvain.Actors
    const someOrg = actors[3].organizations[0]
    const orgCopy = JSON.parse(JSON.stringify(someOrg)) // clone org
    orgCopy.name.en = 'New Name'
    const actor = Actor({
      roles: ['creator'],
      person: Person({
        name: 'Teppo Testaaja',
        email: 'teppo@example.com',
      }),
      organizations: [orgCopy],
    })

    // check that existing organization is unchanged and is not the same object as the copy
    expect(someOrg.name.en).toBe('Some Organization')
    expect(actor.organizations[0]).not.toBe(someOrg)

    // save new actor, check that the copied organization is merged with the existing one
    const oldLength = actors.length
    saveActor(actor)
    expect(actors.length).toBe(oldLength + 1)
    expect(someOrg.name.en).toBe('New Name')
    expect(actor.organizations[0]).toBe(someOrg)
  })

  it('sets actor organizations', async () => {
    stores.Qvain.editDataset(dataset)
    const { setActorOrganizations, actors } = stores.Qvain.Actors
    const orgs = [
      Organization({
        name: {
          en: 'New Org',
        },
      }),
    ]
    setActorOrganizations(actors[0], orgs)
    expect(actors[0].organizations).toEqual(orgs)
  })

  it('gets top-level dataset organizations', async () => {
    stores.Qvain.editDataset(dataset)
    const { getDatasetOrganizations } = stores.Qvain.Actors
    const datasetOrganizations = getDatasetOrganizations(null)
    expect(datasetOrganizations.length).toBe(6)
    expect(datasetOrganizations[1].length).toBe(2)
  })

  it('gets child dataset organizations', async () => {
    stores.Qvain.editDataset(dataset)
    const { getDatasetOrganizations } = stores.Qvain.Actors
    const datasetOrganizations = getDatasetOrganizations(null)
    const aalto = datasetOrganizations.find(
      orgs => orgs.length === 1 && orgs[0].identifier === AaltoIdentifier
    )[0]

    const childDatasetOrganizations = getDatasetOrganizations(aalto)
    expect(childDatasetOrganizations.length).toBe(1)
  })

  it('opens and saves actors in same format', async () => {
    stores.Qvain.editDataset(dataset)

    const getName = metaxActor => metaxActor.name.en || metaxActor.name.fi || metaxActor.name

    const tidy = metaxActors => {
      // normalize actors for comparison.
      // order of actors may change and fields with nonexistent values may be added/removed
      if (!metaxActors) {
        return metaxActors
      }
      if (!Array.isArray(metaxActors)) {
        return removeEmpty(metaxActors) // single actor
      }
      const sorted = [...metaxActors].sort((a, b) => getName(a).localeCompare(getName(b)))
      return removeEmpty(sorted)
    }

    const originalCreator = dataset.research_dataset.creator
    const originalRightsHolder = dataset.research_dataset.rights_holder
    const originalPublisher = dataset.research_dataset.publisher
    const originalCurator = dataset.research_dataset.curator
    const originalContributor = dataset.research_dataset.contributor

    const {
      creator,
      publisher,
      rights_holder: rightsHolder,
      curator,
      contributor,
    } = stores.Qvain.Actors.toBackend()

    expect(tidy(creator)).toEqual(tidy(originalCreator))
    expect(tidy(rightsHolder)).toEqual(tidy(originalRightsHolder))
    expect(tidy(publisher)).toEqual(tidy(originalPublisher))
    expect(tidy(curator)).toEqual(tidy(originalCurator))
    expect(tidy(contributor)).toEqual(tidy(originalContributor))
  })

  describe('otherActorsHaveRole', () => {
    let Actors
    beforeEach(() => {
      Actors = stores.Qvain.Actors
      Actors.reset()
      Actors.setActors([
        {
          uiid: 1,
          roles: ['creator'],
        },
        {
          uiid: 2,
          roles: ['publisher', 'creator'],
        },
        {
          uiid: 3,
          roles: ['curator'],
        },
      ])
    })

    it('should return true when another actor has role', () => {
      expect(Actors.otherActorsHaveRole({ uiid: 3 }, 'publisher')).toBe(true)
    })

    it('should return false when only current actor has role', () => {
      expect(Actors.otherActorsHaveRole({ uiid: 2 }, 'publisher')).toBe(false)
    })

    it('should return true when current and another actor have role', () => {
      expect(Actors.otherActorsHaveRole({ uiid: 1 }, 'creator')).toBe(true)
    })

    it('should return false when no actors have role', () => {
      expect(Actors.otherActorsHaveRole({ uiid: 2 }, 'somerole')).toBe(false)
    })
  })

  it('maintains order of creators', () => {
    const first = { '@type': 'Person', name: 'First' }
    const second = { '@type': 'Person', name: 'Second' }
    const third = { '@type': 'Person', name: 'Third' }
    const nonCreator = { '@type': 'Person', name: 'Not Creator' }

    const data = {
      creator: [first, second, third],
      publisher: third,
      contributor: [nonCreator, third],
      rights_holder: [third],
      curator: [third],
    }

    stores.Qvain.Actors.fromBackend(data)
    expect(stores.Qvain.Actors.actors.length).toBe(4)
    const creators = stores.Qvain.Actors.actors.filter(actor => actor.roles.includes('creator'))
    expect(creators.map(actor => actor.person.name)).toEqual([first.name, second.name, third.name])
  })
})
