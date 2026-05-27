import Adapter from '@/stores/view/qvain/qvain.adapter'
import { DATA_CATALOG_IDENTIFIER } from '@/utils/constants'

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

  it('maps daas remote_resources to daas_resources when data_catalog is object', () => {
    const auth = { userName: 'different-user' }
    const adapter = new Adapter(auth)
    const datasetV3 = {
      id: 'dataset-daas',
      data_catalog: { id: DATA_CATALOG_IDENTIFIER.DAAS },
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
      remote_resources: [
        {
          title: { en: 'DaaS item' },
          description: { en: 'desc' },
          use_category: { url: 'use' },
          file_type: { url: 'file' },
          access_url: 'https://example.org/access',
          download_url: 'https://example.org/download',
        },
      ],
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
      metadata_owner: {},
      preservation: {},
      user_roles: [],
      dataset_versions: [],
      fileset: null,
    }

    const datasetV2 = adapter.convertV3ToV2(datasetV3)
    expect(datasetV2.research_dataset.daas_resources).toHaveLength(1)
    expect(datasetV2.research_dataset.remote_resources).toEqual([])
  })
})

describe('Qvain Adapter convertQvainV2ToV3', () => {
  it('maps daas remote_resources fallback when daas_resources is missing', () => {
    const auth = { userName: 'different-user' }
    const adapter = new Adapter(auth)
    const datasetV2 = {
      data_catalog: DATA_CATALOG_IDENTIFIER.DAAS,
      title: {},
      description: {},
      keyword: [],
      issued: null,
      language: [],
      field_of_science: [],
      theme: [],
      other_identifier: [],
      access_rights: { license: [] },
      spatial: [],
      provenance: [],
      relation: [],
      temporal: [],
      remote_resources: [
        {
          title: { en: 'DaaS item' },
          description: 'desc',
          use_category: { identifier: 'use' },
          file_type: { identifier: 'file' },
          byte_size: '12345',
          access_url: { identifier: 'https://example.org/access' },
          download_url: { identifier: 'https://example.org/download' },
        },
      ],
      actors: [],
      projects: [],
      cumulative_state: 0,
      bibliographic_citation: '',
    }

    const datasetV3 = adapter.convertQvainV2ToV3(datasetV2)
    expect(datasetV3.remote_resources).toHaveLength(1)
    expect(datasetV3.remote_resources[0].title).toEqual({ en: 'DaaS item' })
    expect(datasetV3.remote_resources[0].byte_size).toBe('12345')
  })

  it('maps remote resource byte_size from v3 to v2', () => {
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
      remote_resources: [
        {
          title: { en: 'Remote item' },
          description: { en: 'desc' },
          use_category: { url: 'use' },
          file_type: { url: 'file' },
          byte_size: '8888',
          access_url: 'https://example.org/access',
          download_url: 'https://example.org/download',
        },
      ],
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
      metadata_owner: {},
      preservation: {},
      user_roles: [],
      dataset_versions: [],
      fileset: null,
    }

    const datasetV2 = adapter.convertV3ToV2(datasetV3)
    expect(datasetV2.research_dataset.remote_resources).toHaveLength(1)
    expect(datasetV2.research_dataset.remote_resources[0].file_size).toBe('8888')
  })
})
