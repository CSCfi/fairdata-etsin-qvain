import 'chai/register-expect'
import { makeObservable } from 'mobx'
import Projects from '../../../js/stores/view/qvain/qvain.project'

jest.mock('mobx')

describe('Projects', () => {
  let projects
  const Parent = {
    readonly: false,
  }

  beforeEach(() => {
    projects = new Projects(Parent)
  })

  describe('when calling constructor with Parent', () => {
    test('should call makeObservable', () => {
      expect(makeObservable).to.have.beenCalledWith(projects)
    })

    test('should set readonly', () => {
      projects.readonly.should.be.false
    })
  })

  describe('when calling reset', () => {
    beforeEach(() => {
      projects.projects = 'some data'
      projects.reset()
    })

    test('should set projects to empty array', async () => {
      projects.projects.should.eql([])
    })
  })

  describe('when calling setProject with object that is not in projects', () => {
    const project = {
      id: 1,
    }

    beforeEach(() => {
      projects.setProject(project)
    })

    test('should add project to projects', () => {
      projects.projects.should.include(project)
    })

    test('should set changed to true', () => {
      projects.changed.should.be.true
    })
  })

  describe('when calling setProject with object that is in projects', () => {
    const project = {
      id: 1,
      some: 'additional data',
    }

    const origProjects = [
      {
        id: 1,
      },
    ]

    beforeEach(() => {
      projects.projects = origProjects
      projects.setProject(project)
    })

    test('should add project to projects', () => {
      projects.projects.should.deep.include(project)
    })
  })

  describe('when calling removeProject with id', () => {
    const project = {
      id: 1,
    }

    beforeEach(() => {
      projects.changed = false
      projects.projects = [project]
      projects.removeProject(1)
    })

    test('should remove project with id 1', () => {
      projects.projects.should.eql([])
    })

    test('should set changed to true', () => {
      projects.changed.should.be.true
    })
  })

  describe('when calling fromBackend', () => {
    const dataset = {
      is_output_of: [
        {
          name: { fi: 'fi-name' },
          identifier: 'identifier',
          funder_type: {
            pref_label: 'name',
            identifier: 'url',
          },
          source_organization: [{ name: 'name', identifier: 'identifier', email: 'email' }],
        },
      ],
    }

    beforeEach(() => {
      projects.fromBackend(dataset)
    })

    test('', () => {})
  })
})
