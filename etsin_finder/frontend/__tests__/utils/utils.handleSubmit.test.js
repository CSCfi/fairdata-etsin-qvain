import 'chai/register-expect'

import handleSubmit, {
  directoriesToMetax,
  filesToMetax,
} from '../../js/components/qvain/utils/handleSubmit'

describe('when calling directoriesToMetax without args', () => {
  let returnValue

  beforeEach(() => {
    returnValue = directoriesToMetax()
  })

  test('should return empty Array', () => {
    const expectedReturn = []
    returnValue.should.eql(expectedReturn)
  })
})

describe('when callling directoriesToMetax with args', () => {
  let returnValue
  const selectedDirectories = [
    { identifier: 'id' },
    {
      identifier: 'id2',
      title: 'title',
      description: 'description',
      useCategory: 'useCategory',
      projectIdentifier: 'projectIdentifier',
    },
  ]
  const existingDirectories = [
    {
      identifier: 'id',
      title: 'title',
      description: 'description',
      useCategory: 'useCategory',
      projectIdentifier: 'projectIdentifier',
    },
  ]

  beforeEach(() => {
    returnValue = directoriesToMetax(selectedDirectories, existingDirectories)
  })

  test('should return expectedReturn', () => {
    const expectedReturn = [
      {
        identifier: 'id',
        title: undefined,
        description: undefined,
        useCategory: { identifier: undefined },
        projectIdentifier: undefined,
      },
      {
        identifier: 'id2',
        title: 'title',
        description: 'description',
        useCategory: { identifier: 'useCategory' },
        projectIdentifier: 'projectIdentifier',
      },
    ]

    returnValue.should.deep.eql(expectedReturn)
  })
})

describe('when calling filesToMetax without args', () => {
  let returnValue

  beforeEach(() => {
    returnValue = filesToMetax()
  })

  test('should return empty Array', () => {
    returnValue.should.eql([])
  })
})

describe('when calling filesToMetax with args', () => {
  let returnValue
  const selectedFiles = [
    { identifier: 'id' },
    {
      identifier: 'id2',
      title: 'title',
      description: 'description',
      fileType: 'fileType',
      useCategory: 'useCategory',
      projectIdentifier: 'projectIdentifier',
    },
  ]
  const existingFiles = [
    {
      identifier: 'id',
      title: 'title',
      description: 'description',
      fileType: 'fileType',
      useCategory: 'useCategory',
      projectIdentifier: 'projectIdentifier',
    },
  ]

  beforeEach(() => {
    returnValue = filesToMetax(selectedFiles, existingFiles)
  })

  test('should return expectedReturn', () => {
    const expectedReturn = [
      {
        description: undefined,
        fileType: undefined,
        identifier: 'id',
        projectIdentifier: undefined,
        title: undefined,
        useCategory: { identifier: undefined },
      },
      {
        description: 'description',
        fileType: { identifier: 'fileType' },
        identifier: 'id2',
        projectIdentifier: 'projectIdentifier',
        title: 'title',
        useCategory: { identifier: 'useCategory' },
      },
    ]

    returnValue.should.deep.eql(expectedReturn)
  })
})

describe('when calling handleSubmit with mockStores', () => {
  let returnValue
  const mockStores = {
    Env: {
      metaxApiV2: true,
    },
    Qvain: {
      Title: {
        toBackend: jest.fn(() => 'title'),
      },
      Description: {
        toBackend: jest.fn(() => 'description'),
      },
      SubjectHeadings: {
        toBackend: jest.fn(() => 'theme'),
      },
      Actors: {
        toBackend: jest.fn(() => 'actors'),
      },
      Spatials: {
        toBackend: jest.fn(() => 'spatial'),
      },
      Temporals: {
        toBackend: jest.fn(() => 'temporal'),
      },
      RelatedResources: {
        toBackend: jest.fn(() => 'relation'),
      },
      Provenances: {
        toBackend: jest.fn(() => 'provenance'),
      },
      FieldOfSciences: {
        toBackend: jest.fn(() => 'fieldOfScience'),
      },
      DatasetLanguages: {
        toBackend: jest.fn(() => 'datasetLanguage'),
      },
      IssuedDate: {
        toBackend: jest.fn(() => 'issuedDate'),
      },
      AccessType: {
        toBackend: jest.fn(() => 'accessType'),
      },
      Projects: {
        toBackend: jest.fn(() => 'projects'),
      },
      Licenses: {
        toBackend: jest.fn(() => 'license'),
      },
      EmbargoExpDate: {
        toBackend: jest.fn(() => 'embargoDate'),
      },
      RestrictionGrounds: {
        toBackend: jest.fn(() => 'restrictionGrounds'),
      },
      Keywords: {
        toBackend: jest.fn(() => 'keywords'),
      },
      OtherIdentifiers: {
        storage: 'identifiers',
      },
      Infrastructures: {
        storage: 'infrastructures',
      },
      dataCatalog: 'dataCatalog',
      cumulativeState: 'cumulativeState',
      useDoi: 'useDoi',
      externalResources: ['externalResources'],
    },
  }

  beforeEach(() => {
    returnValue = handleSubmit(mockStores.Env, mockStores.Qvain)
  })

  test('should return expectedReturn', () => {
    const expectedReturn = {
      title: 'title',
      description: 'description',
      identifiers: 'identifiers',
      keywords: 'keywords',
      theme: 'theme',
      actors: 'actors',
      infrastructure: 'infrastructures',
      restrictionGrounds: 'restrictionGrounds',
      embargoDate: 'embargoDate',
      license: 'license',
      // Send no values if empty instead of empty values.
      remote_resources: ['externalResources'],
      dataCatalog: 'dataCatalog',
      cumulativeState: 'cumulativeState',
      useDoi: 'useDoi',
      projects: 'projects',
      spatial: 'spatial',
      temporal: 'temporal',
      relation: 'relation',
      provenance: 'provenance',
      fieldOfScience: 'fieldOfScience',
      datasetLanguage: 'datasetLanguage',
      issuedDate: 'issuedDate',
      accessType: 'accessType',
    }

    returnValue.should.deep.eql(expectedReturn)
  })
})
