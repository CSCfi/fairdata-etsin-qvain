import { expect } from 'chai'
import { v4 as uuidv4 } from 'uuid'
import { makeObservable } from 'mobx'
import Projects from '../../../js/stores/view/qvain/qvain.project'

jest.mock('mobx', () => {
  const actual = jest.requireActual('mobx')
  return {
    ...actual,
    makeObservable: jest.fn(),
  }
})

jest.mock('uuid')

describe('Projects', () => {
  let projects
  const Parent = {
    readonly: false,
    setChanged: jest.fn(),
  }

  beforeEach(() => {
    projects = new Projects(Parent)
  })

  describe('when calling constructor with Parent', () => {
    test('should call makeObservable', () => {
      expect(makeObservable).to.have.beenCalledWith(projects)
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

    test('should call Parent setChanged with true', () => {
      expect(Parent.setChanged).to.have.beenCalledWith(true)
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

    test('should call Parent setChanged with true', () => {
      expect(Parent.setChanged).to.have.beenCalledWith(true)
    })
  })

  describe('when calling fromBackend', () => {
    const dataset = {
      is_output_of: [
        {
          name: { fi: 'fi-name' },
          identifier: 'identifier',
          has_funder_identifier: 'funder_identifier',
          funder_type: {
            pref_label: 'name',
            identifier: 'url',
          },
          source_organization: [
            {
              name: { en: 'subdep_name' },
              identifier: 'subdep_identifier',
              email: 'subdep_email',
              is_part_of: {
                name: { en: 'dep_name' },
                identifier: 'dep_identifier',
                email: 'dep_email',
                is_part_of: {
                  name: { en: 'org_name' },
                  identifier: 'org_identifier',
                  email: 'org_email',
                },
              },
            },
          ],
          has_funding_agency: [
            {
              name: { en: 'fund_subdep_name' },
              identifier: 'fund_subdep_identifier',
              email: 'fund_subdep_email',
              is_part_of: {
                name: { en: 'fund_dep_name' },
                identifier: 'fund_dep_identifier',
                email: 'fund_dep_email',
                is_part_of: {
                  name: { en: 'fund_org_name' },
                  identifier: 'fund_org_identifier',
                  email: 'fund_org_email',
                },
              },
              contributor_type: [
                {
                  identifier: 'contr_identifier',
                  pref_label: 'contr_pref_label',
                },
              ],
            },
          ],
        },
      ],
    }

    beforeEach(() => {
      uuidv4.mockReturnValue('id')
      projects.fromBackend(dataset)
    })

    test('should set projects with expected array', () => {
      const expectedObj = {
        id: 'id',
        details: {
          title: { fi: 'fi-name' },
          identifier: 'identifier',
          fundingIdentifier: 'funder_identifier',
          funderType: { url: 'url', name: 'name' },
        },
        organizations: [
          {
            id: 'id',
            organization: {
              name: { en: 'org_name' },
              identifier: 'org_identifier',
              email: 'org_email',
            },
            department: {
              name: { en: 'dep_name' },
              identifier: 'dep_identifier',
              email: 'dep_email',
            },
            subDepartment: {
              name: { en: 'subdep_name' },
              identifier: 'subdep_identifier',
              email: 'subdep_email',
            },
          },
        ],
        fundingAgencies: [
          {
            id: 'id',
            organization: {
              id: 'id',
              organization: {
                name: { en: 'fund_org_name' },
                identifier: 'fund_org_identifier',
                email: 'fund_org_email',
              },
              department: {
                name: { en: 'fund_dep_name' },
                identifier: 'fund_dep_identifier',
                email: 'fund_dep_email',
              },
              subDepartment: {
                name: { en: 'fund_subdep_name' },
                identifier: 'fund_subdep_identifier',
                email: 'fund_subdep_email',
              },
            },
            contributorTypes: [
              {
                id: 'id',
                identifier: 'contr_identifier',
                label: 'contr_pref_label',
              },
            ],
          },
        ],
      }

      projects.projects.should.deep.eql([expectedObj])
    })
  })

  describe('given existing project', () => {
    const initialProjects = [
      {
        id: 'id',
        details: {
          title: { fi: 'fi-name' },
          identifier: 'identifier',
          fundingIdentifier: 'funder_identifier',
          funderType: { url: 'url', name: 'name' },
        },
        organizations: [
          {
            id: 'id',
            organization: {
              name: { en: 'org_name' },
              identifier: 'org_identifier',
              email: 'org_email',
            },
            department: {
              name: { en: 'dep_name' },
              identifier: 'dep_identifier',
              email: 'dep_email',
            },
            subDepartment: {
              name: { en: 'subdep_name' },
              identifier: 'subdep_identifier',
              email: 'subdep_email',
            },
          },
        ],
        fundingAgencies: [
          {
            id: 'id',
            organization: {
              id: 'id',
              organization: {
                name: { en: 'fund_org_name' },
                identifier: 'fund_org_identifier',
                email: 'fund_org_email',
              },
              department: {
                name: { en: 'fund_dep_name' },
                identifier: 'fund_dep_identifier',
                email: 'fund_dep_email',
              },
              subDepartment: {
                name: { en: 'fund_subdep_name' },
                identifier: 'fund_subdep_identifier',
                email: 'fund_subdep_email',
              },
            },
            contributorTypes: [
              {
                id: 'id',
                identifier: 'contr_identifier',
                label: 'contr_pref_label',
                definition: 'contr_definition',
                inScheme: 'contr_in_scheme',
              },
            ],
          },
        ],
      },
    ]

    beforeEach(() => {
      projects.projects = initialProjects
    })

    describe('when calling toBackend', () => {
      let returnValue
      beforeEach(() => {
        returnValue = projects.toBackend()
      })

      test('should return backend ready array', () => {
        const expectedReturn = [
          {
            funder_type: { identifier: 'url' },
            has_funder_identifier: 'funder_identifier',
            identifier: 'identifier',
            name: {
              fi: 'fi-name',
            },
            has_funding_agency: [
              {
                '@type': 'Organization',
                contributor_type: [
                  {
                    identifier: 'contr_identifier',
                  },
                ],
                name: { en: 'fund_subdep_name' },
                identifier: 'fund_subdep_identifier',
                email: 'fund_subdep_email',
                is_part_of: {
                  '@type': 'Organization',
                  name: { en: 'fund_dep_name' },
                  identifier: 'fund_dep_identifier',
                  email: 'fund_dep_email',
                  is_part_of: {
                    '@type': 'Organization',
                    name: { en: 'fund_org_name' },
                    identifier: 'fund_org_identifier',
                    email: 'fund_org_email',
                  },
                },
              },
            ],
            source_organization: [
              {
                '@type': 'Organization',
                name: { en: 'subdep_name' },
                identifier: 'subdep_identifier',
                email: 'subdep_email',
                is_part_of: {
                  '@type': 'Organization',
                  name: { en: 'dep_name' },
                  identifier: 'dep_identifier',
                  email: 'dep_email',
                  is_part_of: {
                    '@type': 'Organization',
                    name: { en: 'org_name' },
                    identifier: 'org_identifier',
                    email: 'org_email',
                  },
                },
              },
            ],
          },
        ]

        returnValue.should.deep.eql(expectedReturn)
      })
    })
  })
})
