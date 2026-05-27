import ExternalResources from '../../../js/stores/view/qvain/qvain.externalResources'

describe('ExternalResources.fromBackend with daas store', () => {
  let store

  beforeEach(() => {
    const qvain = {
      readonly: false,
      setChanged: vi.fn(),
    }
    store = new ExternalResources(qvain)
    store.translationsRoot = 'qvain.files.daasCatalog'
  })

  test('loads daas_resources when present', () => {
    const dataset = {
      daas_resources: [
        {
          title: { en: 'DaaS resource' },
          data_service: 'service:a',
          use_category: { pref_label: 'Publication', identifier: 'use:publication' },
          file_type: { pref_label: 'Text', identifier: 'file:text' },
          byte_size: '2048',
          access_url: { identifier: 'https://example.org/access' },
          download_url: { identifier: 'https://example.org/download' },
        },
      ],
      remote_resources: [],
    }

    store.fromBackend(dataset, { dataCatalog: 'daas' })
    expect(store.storage).toHaveLength(1)
    expect(store.storage[0].title).toEqual({ en: 'DaaS resource' })
    expect(store.storage[0].fileSize).toBe('2 KB')
    expect(store.storage[0].dataService).toEqual({
      label: null,
      url: 'service:a',
    })
  })

  test('falls back to remote_resources when daas_resources is missing', () => {
    const dataset = {
      remote_resources: [
        {
          title: { en: 'Remote fallback' },
          use_category: { pref_label: 'Publication', identifier: 'use:publication' },
          file_type: { pref_label: 'Text', identifier: 'file:text' },
          byte_size: '1024',
          access_url: { identifier: 'https://example.org/access' },
          download_url: { identifier: 'https://example.org/download' },
        },
      ],
    }

    store.fromBackend(dataset, { dataCatalog: 'daas' })
    expect(store.storage).toHaveLength(1)
    expect(store.storage[0].title).toEqual({ en: 'Remote fallback' })
    expect(store.storage[0].fileSize).toBe('1 KB')
  })

  test('converts file size abbreviation to bytes in toBackend payload', () => {
    store.storage = [
      {
        uiid: 'test-uiid',
        title: { en: 'DaaS resource' },
        dataService: { name: 'Service A', url: 'service:a' },
        useCategory: { name: 'Publication', url: 'use:publication' },
        fileType: { name: 'Text', url: 'file:text' },
        fileSize: '4 KB',
        accessUrl: 'https://example.org/access',
        downloadUrl: 'https://example.org/download',
      },
    ]

    const payload = store.toBackend()
    expect(payload[0].byte_size).toBe('4096')
    expect(payload[0].data_service).toBe('service:a')
  })

  test('keeps plain numeric bytes in toBackend payload', () => {
    store.storage = [
      {
        uiid: 'test-uiid',
        title: 'DaaS resource',
        useCategory: { name: 'Publication', url: 'use:publication' },
        fileType: { name: 'Text', url: 'file:text' },
        fileSize: '4096',
        accessUrl: 'https://example.org/access',
        downloadUrl: 'https://example.org/download',
      },
    ]

    const payload = store.toBackend()
    expect(payload[0].byte_size).toBe('4096')
  })

  test('allows file paths in accessUrl and downloadUrl for daas catalog', async () => {
    store.create({
      title: { en: 'DaaS local file' },
      useCategory: { pref_label: 'Publication', identifier: 'use:publication' },
      fileType: { pref_label: 'Text', identifier: 'file:text' },
    })
    store.inEdit.accessUrl = String.raw`C:\data\input\data.csv`
    store.inEdit.downloadUrl = String.raw`relative\exports\result.zip`
    store.inEdit.dataService = { label: { en: 'Allas', fi: 'Allas' }, url: 'Allas' }

    await store.validateAndSave()
    expect(store.validationError).toBe('')
    expect(store.storage).toHaveLength(1)
  })

  test('requires data_service for daas catalog resources', async () => {
    store.create({
      title: { en: 'DaaS without service' },
      useCategory: { pref_label: 'Publication', identifier: 'use:publication' },
      fileType: { pref_label: 'Text', identifier: 'file:text' },
    })
    store.inEdit.accessUrl = 'https://example.org/access'
    store.inEdit.downloadUrl = 'https://example.org/download'
    store.inEdit.dataService = null

    await store.validateAndSave()
    expect(store.validationError).toBe(
      'qvain.validationMessages.externalResources.dataService.required'
    )
    expect(store.storage).toHaveLength(0)
  })

  test('does not allow file paths in accessUrl and downloadUrl for non-daas catalog', async () => {
    const qvain = {
      readonly: false,
      setChanged: vi.fn(),
    }
    const nonDaasStore = new ExternalResources(qvain)
    nonDaasStore.create({
      title: { en: 'Regular external resource' },
      useCategory: { pref_label: 'Publication', identifier: 'use:publication' },
      fileType: { pref_label: 'Text', identifier: 'file:text' },
    })
    nonDaasStore.inEdit.accessUrl = String.raw`C:\data\input\data.csv`
    nonDaasStore.inEdit.downloadUrl = String.raw`relative\exports\result.zip`

    await nonDaasStore.validateAndSave()
    expect([
      'qvain.validationMessages.externalResources.accessUrl.validFormat',
      'qvain.validationMessages.externalResources.downloadUrl.validFormat',
    ]).toContain(nonDaasStore.validationError)
    expect(nonDaasStore.storage).toHaveLength(0)
  })
})
