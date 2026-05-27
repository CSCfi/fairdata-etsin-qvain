import handleSubmitToBackend from '../../../js/components/qvain/utils/handleSubmit'
import { ACCESS_TYPE_URL, DATA_CATALOG_IDENTIFIER } from '../../../js/utils/constants'

const field = value => ({
  toBackend: vi.fn(() => value),
})

const createQvain = ({ dataCatalog, externalResources = [], daasResources = [] }) => ({
  Title: field({ en: 'title' }),
  Description: field({ en: 'description' }),
  SubjectHeadings: field([]),
  Actors: field({ creator: [] }),
  Spatials: field([]),
  Temporals: field([]),
  RelatedResources: field([]),
  Provenances: field([]),
  FieldOfSciences: field([]),
  DatasetLanguages: field([]),
  IssuedDate: field('2024-01-01'),
  AccessType: field({ identifier: ACCESS_TYPE_URL.OPEN }),
  ProjectV2: field([]),
  Projects: { adapter: { toMetaxV3: vi.fn(() => []) } },
  Licenses: field([]),
  EmbargoExpDate: field(undefined),
  RestrictionGrounds: field([]),
  Keywords: field([]),
  BibliographicCitation: field(''),
  AccessRightsDescription: field({}),
  OtherIdentifiers: field([]),
  Infrastructures: field([]),
  DataAccess: field({}),
  ExternalResources: field(externalResources),
  DaasResources: field(daasResources),
  Files: { root: undefined, actionsToMetax: vi.fn(() => ({})) },
  dataCatalog,
  cumulativeState: 0,
  useDoi: true,
  original: undefined,
  newCumulativeState: 0,
  isNewVersion: false,
})

describe('handleSubmitToBackend', () => {
  test('uses DaasResources as remote_resources for daas catalog', () => {
    const daasResources = [{ title: 'daas-resource' }]
    const qvain = createQvain({
      dataCatalog: DATA_CATALOG_IDENTIFIER.DAAS,
      externalResources: [{ title: 'att-resource' }],
      daasResources,
    })

    const payload = handleSubmitToBackend(qvain)
    expect(payload.remote_resources).toEqual(daasResources)
  })

  test('uses ExternalResources as remote_resources for att catalog', () => {
    const externalResources = [{ title: 'att-resource' }]
    const qvain = createQvain({
      dataCatalog: DATA_CATALOG_IDENTIFIER.ATT,
      externalResources,
      daasResources: [{ title: 'daas-resource' }],
    })

    const payload = handleSubmitToBackend(qvain)
    expect(payload.remote_resources).toEqual(externalResources)
  })
})
