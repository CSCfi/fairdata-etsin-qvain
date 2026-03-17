import Adapter from '@/stores/view/qvain/qvain.adapter'

describe('Qvain Adapter convertV3ToV2', () => {
  it('maps user_roles from V3 dataset to V2 dataset and its versions', () => {
    const auth = { userName: 'different-user' }
    const adapter = new Adapter(auth)

    const datasetV3 = {
      id: 'dataset-1',
      data_catalog: 'catalog-1',
      title: {},
      description: {},
      keyword: [],
      issued: null,
      language: null,
      field_of_science: null,
      theme: null,
      other_identifiers: [],
      access_rights: null,
      spatial: null,
      relation: [],
      temporal: null,
      remote_resources: [],
      actors: [],
      provenance: [],
      projects: [],
      persistent_identifier: null,
      bibliographic_citation: null,
      created: '2024-01-01T00:00:00Z',
      removed: null,
      state: 'draft',
      generate_pid_on_publish: null,
      draft_of: null,
      next_draft: null,
      cumulative_state: null,
      metadata_owner: {
        user: {
          username: 'owner-user',
          first_name: 'Owner',
          last_name: 'User',
          organization: 'Org 1',
          admin_organizations: ['org-1'],
        },
        organization: 'Org 1',
        admin_organization: 'org-1',
      },
      preservation: {
        state: 0,
        pas_process_running: false,
        pas_package_created: false,
      },
      user_roles: ['organization_admin'],
      dataset_versions: [
        {
          id: 'dataset-1-v2',
          data_catalog: 'catalog-1',
          title: {},
          description: {},
          keyword: [],
          issued: null,
          language: null,
          field_of_science: null,
          theme: null,
          other_identifiers: [],
          access_rights: null,
          spatial: null,
          relation: [],
          temporal: null,
          remote_resources: [],
          actors: [],
          provenance: [],
          projects: [],
          persistent_identifier: null,
          bibliographic_citation: null,
          created: '2024-01-02T00:00:00Z',
          removed: null,
          state: 'draft',
          generate_pid_on_publish: null,
          draft_of: null,
          next_draft: null,
          cumulative_state: null,
          metadata_owner: {
            user: {
              username: 'owner-user',
              first_name: 'Owner',
              last_name: 'User',
              organization: 'Org 1',
              admin_organizations: ['org-1'],
            },
            organization: 'Org 1',
            admin_organization: 'org-1',
          },
          preservation: {
            state: 0,
            pas_process_running: false,
            pas_package_created: false,
          },
          user_roles: ['organization_admin'],
          dataset_versions: [],
          fileset: null,
        },
      ],
      fileset: null,
    }

    const datasetV2 = adapter.convertV3ToV2(datasetV3)

    expect(datasetV2.user_roles).toEqual(['organization_admin'])
    expect(datasetV2.dataset_version_set).toHaveLength(1)
    expect(datasetV2.dataset_version_set[0].user_roles).toEqual(['organization_admin'])
  })
})

