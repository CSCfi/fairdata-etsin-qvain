import { buildStores } from '@/stores'
import { Project, ParticipatingOrganization } from '@/stores/view/qvain/sections/qvain.projects.v3'

const org = {
  url: 'http://test.org/1234',
  pref_label: { fi: 'testi org', en: 'test org' },
}

const expectedResultOrg = {
  url: 'http://test.org/1234',
}

const otherOrg = {
  url: 'http://other-test.org/1234',
  pref_label: { fi: 'toinen org', en: 'other org' },
}

const fullOrg = {
  url: 'http://test.org/1234/subdepartment',
  pref_label: {
    fi: 'subi',
    en: 'sub',
  },
  parent: {
    url: 'http://test.org/1234/department',
    pref_label: {
      fi: 'depi',
      en: 'dep',
    },
    parent: {
      url: 'http://test.org/1234',
      pref_label: {
        fi: 'orgga',
        en: 'org',
      },
    },
  },
}

const expectedResultOtherOrg = {
  url: 'http://other-test.org/1234',
}

const testProjectPayload = {
  title: { fi: 'projekti' },
  project_identifier: 'abcd-1234',
  participating_organizations: [org, otherOrg],
  funding: [
    {
      funding_identifier: 'https://abcd-1234',
      funder: {
        organization: fullOrg,
        funder_type: {
          url: 'http://uri.suomi.fi/codelist/fairdata/funder_type/code/tekes-shok',
        },
      },
    },
  ],
}

describe('projects', () => {
  let projects, stores

  beforeEach(() => {
    stores = buildStores()
    projects = stores.Qvain.Projects
  })

  test('basic project actions', () => {
    // create
    projects.controller.create()
    expect(stores.Qvain.Modals.modals).toHaveLength(1)

    // set value
    let inEdit = stores.Qvain.Modals.modals[0]
    const title = { fi: 'testi', en: 'test', und: '' }
    const project_identifier = 'identifier'

    inEdit.participating_organizations.controller.create()
    inEdit.participating_organizations.inEdit.controller.setOrganization(org)
    inEdit.participating_organizations.controller.save()
    expect(inEdit.participating_organizations.storage).toHaveLength(1)

    expect(inEdit.isNew).toBe(true)
    inEdit.controller.set({ fieldName: 'title', value: title })
    inEdit.controller.set({ fieldName: 'project_identifier', value: project_identifier })

    inEdit.controller.setHasChanged()
    expect(inEdit.controller.hasChanged).toBe(true)

    // save
    stores.Qvain.Modals.save('project')
    expect(stores.Qvain.Modals.modals).toHaveLength(0)
    expect(projects.storage).toHaveLength(1)
    expect(projects.storage[0].itemId).toEqual(inEdit.itemId)
    expect(projects.storage[0].title).toEqual(title)
    expect(projects.storage[0].project_identifier).toEqual(project_identifier)

    // start editing
    projects.controller.edit(projects.storage[0].itemId)
    expect(stores.Qvain.Modals.modals).toHaveLength(1)

    // set value
    inEdit = stores.Qvain.Modals.modals[0]
    const new_project_identifier = 'project_identifier'

    expect(inEdit.controller.hasChanged).toBe(false)
    inEdit.controller.set({ fieldName: 'project_identifier', value: new_project_identifier })
    expect(inEdit.project_identifier).toEqual(new_project_identifier)

    // save
    stores.Qvain.Modals.save('project')
    expect(stores.Qvain.Modals.modals).toHaveLength(0)
    expect(projects.storage).toHaveLength(1)
    expect(projects.storage[0].itemId).toEqual(inEdit.itemId)
    expect(projects.storage[0].title).toEqual(title)
    expect(projects.storage[0].project_identifier).toEqual(new_project_identifier)
  })
})

describe('project', () => {
  let project
  beforeEach(() => {
    project = new Project()
  })
  test('label', () => {
    project.adapter.fromMetaxV3(testProjectPayload)
    expect(project.getLabel()).toEqual({ fi: 'projekti', en: '', und: '' })
  })
})

describe('participating organization', () => {
  let organization

  beforeEach(() => {
    organization = new ParticipatingOrganization()
  })

  test('label', () => {
    organization.adapter.fromMetaxV3(org)
    expect(organization.getLabel()).toEqual(org.pref_label)
  })

  test('full org', () => {
    organization.adapter.fromMetaxV3(fullOrg)
    expect(organization.getLabel()).toEqual({
      fi: 'orgga, depi, subi',
      en: 'org, dep, sub',
    })
  })

  test('save', () => {
    const testOrg = {
      pref_label: { fi: 'artesaani org', en: 'custom org' },
      external_identifier: 'abcd-1234',
      isReference: false,
    }
    organization.controller.setOrganization(testOrg)
    expect(organization.organization).toEqual(testOrg)
    expect(organization.organization.isReference).toBe(false)

    testOrg.isReference = true
    organization.controller.setOrganization(testOrg)
    expect(organization.organization).toEqual(testOrg)
    expect(organization.organization.isReference).toBe(true)
  })
})
