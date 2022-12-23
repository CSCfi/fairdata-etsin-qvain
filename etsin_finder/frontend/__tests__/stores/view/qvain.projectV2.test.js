import { expect } from 'chai'
import * as mobx from 'mobx'
import ProjectV2, { projectSchema } from '../../../js/stores/view/qvain/qvain.projectV2'

jest.spyOn(mobx, 'makeObservable')
jest.mock('uuid')

const getProject = () => {
  const metaxProject = {
    name: {
      en: 'Aaa',
    },
    funder_type: {
      in_scheme: 'http://uri.suomi.fi/codelist/fairdata/funder_type',
      identifier: 'http://uri.suomi.fi/codelist/fairdata/funder_type/code/eu-framework-programme',
      pref_label: {
        en: 'EU Framework Programme',
        fi: 'EU puiteohjelmat',
        und: 'EU puiteohjelmat',
      },
    },
    has_funding_agency: [
      {
        name: {
          en: 'Test Funding Agency',
          fi: 'Test Funding Agency',
          und: 'Test Funding Agency',
        },
        '@type': 'Organization',
        identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/123456',
      },
    ],
    source_organization: [
      {
        name: {
          fi: 'Test Org',
          en: 'Test Org',
          und: 'test org',
        },
        '@type': 'Organization',
        identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/12345678',
      },
    ],
  }

  const Parent = {
    readonly: false,
    setChanged: jest.fn(),
  }
  const projectStore = new ProjectV2(Parent)
  projectStore.fromBackend({ is_output_of: [metaxProject] })
  return projectStore
}

describe('ProjectV2', () => {
  describe('when calling constructor with Parent', () => {
    test('should call makeObservable', () => {
      const project = getProject()
      expect(mobx.makeObservable).to.have.beenCalledWith(project)
    })
  })

  describe('schema', () => {
    const isValid = project => {
      return projectSchema.isValidSync(project.storage[0], { strict: true })
    }

    it('should validate projects', () => {
      isValid(getProject()).should.be.true
    })

    it('should error on missing project name', () => {
      const project = getProject()
      project.storage[0].name = undefined
      isValid(project).should.be.false
    })

    it('should error on empty project name', () => {
      const project = getProject()
      project.storage[0].name = {}
      isValid(project).should.be.false
    })

    it('should error on missing organizations list', () => {
      const project = getProject()
      project.storage[0].organizations = undefined
      isValid(project).should.be.false
    })

    it('should error on empty organizations list', () => {
      const project = getProject()
      project.storage[0].organizations = []
      isValid(project).should.be.false
    })

    it('should error on missing organization name', () => {
      const project = getProject()
      project.storage[0].funderOrganization.organization.name = undefined
      isValid(project).should.be.false
    })

    it('should error on empty organization name', () => {
      const project = getProject()
      project.storage[0].funderOrganization.organization.name = {}
      isValid(project).should.be.false
    })
  })
})
