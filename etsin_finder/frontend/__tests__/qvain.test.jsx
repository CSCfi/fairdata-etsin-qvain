import React from 'react'
import { shallow, mount } from 'enzyme'
import translate from 'counterpart'
import { components } from 'react-select'
import CreatableSelect from 'react-select/creatable'

import etsinTheme from '../js/styles/theme'
import '../locale/translations'
import { Qvain as QvainBase } from '../js/components/qvain/main'
import Description from '../js/components/qvain/description'
import DescriptionField from '../js/components/qvain/description/descriptionField'
import OtherIdentifierField from '../js/components/qvain/description/otherIdentifierField'
import FieldOfScienceField from '../js/components/qvain/description/fieldOfScienceField'
import IssuedDateField from '../js/components/qvain/description/issuedDateField'
import LanguageField from '../js/components/qvain/description/languageField'
import KeywordsField from '../js/components/qvain/description/keywordsField'
import RightsAndLicenses from '../js/components/qvain/licenses'
import { License } from '../js/components/qvain/licenses/licenses'
import { AccessType } from '../js/components/qvain/licenses/accessType'
import RestrictionGrounds from '../js/components/qvain/licenses/restrictionGrounds'
import EmbargoExpires from '../js/components/qvain/licenses/embargoExpires'
import { ACCESS_TYPE_URL, LICENSE_URL, DATA_CATALOG_IDENTIFIER } from '../js/utils/constants'
import { qvainFormSchema } from '../js/components/qvain/utils/formValidation'
import { ExternalFilesBase } from '../js/components/qvain/files/external/externalFiles'
import DoiSelection, { DoiCheckbox } from '../js/components/qvain/files/doiSelection'
import { ButtonGroup } from '../js/components/qvain/general/buttons'
import {
  ValidationErrors,
  ValidationErrorItem,
} from '../js/components/qvain/general/errors/validationError'
import { SlidingContent } from '../js/components/qvain/general/card'
import Env from '../js/stores/domain/env'
import QvainStoreClass, {
  ExternalResource,
  AccessType as AccessTypeConstructor,
  License as LicenseConstructor,
} from '../js/stores/view/qvain'
import LocaleStore from '../js/stores/view/language'
import TablePasState from '../js/components/qvain/datasets/tablePasState'
import {
  filterByTitle,
  filterGroupsByTitle,
  groupDatasetsByVersionSet,
} from '../js/components/qvain/datasets/filter'
import DatePicker from '../js/components/qvain/general/input/datepicker'
import { StoresProvider, withStores } from '../js/stores/stores'

jest.mock('uuid', original => {
  let id = 0
  return {
    ...original,
    v4: () => id++,
  }
})

const QvainStore = new QvainStoreClass(Env)

const getStores = () => {
  Env.setMetaxApiV2(true)
  return {
    Env,
    Qvain: QvainStore,
    Locale: LocaleStore,
  }
}

const emptyMatch = { params: { identifier: null } }

describe('Qvain', () => {
  it('should render correctly', () => {
    const component = shallow(
      <QvainBase Stores={getStores()} history={{}} location={{ pathname: '' }} match={emptyMatch} />
    )

    expect(component).toMatchSnapshot()
  })

  it('should open existing dataset when the identifier in the url changes', () => {
    const stores = getStores()

    // Mock react router matches for identifier
    const identifierMatch = { params: { identifier: 'some_identifier' } }
    const anotherMatch = { params: { identifier: 'another_identifier' } }

    // Replace Qvain.getDataset so we can test it was called correctly
    let callCount = 0
    let lastCall
    class FakeQvain extends QvainBase {
      getDataset(identifier) {
        callCount += 1
        lastCall = identifier
      }
    }

    // Create empty dataset, getDataset should not be called
    shallow(
      <FakeQvain Stores={stores} match={emptyMatch} history={{}} location={{ pathname: '/' }} />
    )
    expect(callCount).toBe(0)
    expect(lastCall).toBe(undefined)

    // Dataset already opened for editing (e.g. in the dataset view), getDataset should not be called
    lastCall = undefined
    const datasetOpenedStore = {
      ...stores,
      Qvain: {
        ...stores.Qvain,
        original: { identifier: identifierMatch.params.identifier },
      },
    }
    shallow(
      <FakeQvain
        Stores={datasetOpenedStore}
        match={identifierMatch}
        history={{}}
        location={{ pathname: '/' }}
      />
    )
    expect(callCount).toBe(0)
    expect(lastCall).toBe(undefined)

    // Different dataset already opened, getDataset should be called with the new identifier
    lastCall = undefined
    const anotherDatasetOpenedStore = {
      ...stores,
      Qvain: {
        ...stores.Qvain,
        original: { identifier: anotherMatch.params.identifier },
      },
    }
    shallow(
      <FakeQvain
        Stores={anotherDatasetOpenedStore}
        match={identifierMatch}
        history={{}}
        location={{ pathname: '/' }}
      />
    )
    expect(callCount).toBe(1)
    expect(lastCall).toBe(identifierMatch.params.identifier)

    // Edit existing dataset, getDataset should be called
    lastCall = undefined
    const wrapper = shallow(
      <FakeQvain
        Stores={stores}
        match={identifierMatch}
        history={{}}
        location={{ pathname: '/' }}
      />
    )
    expect(callCount).toBe(2)
    expect(lastCall).toBe(identifierMatch.params.identifier)

    // Switch to another dataset, getDataset should be called
    lastCall = undefined
    wrapper.setProps({ match: anotherMatch })
    expect(callCount).toBe(3)
    expect(lastCall).toBe(anotherMatch.params.identifier)
  })
})

describe('Qvain dataset list PreservationStates', () => {
  it('should render <TablePasState />', () => {
    const component = shallow(<TablePasState preservationState={0} />)
    expect(component).toMatchSnapshot()
  })
})

describe('Qvain.Description', () => {
  it('should render <Description />', () => {
    const component = shallow(<Description Stores={getStores()} />)
    expect(component).toMatchSnapshot()
  })
  it('should render <DescriptionField />', () => {
    const component = shallow(<DescriptionField Stores={getStores()} />)
    expect(component).toMatchSnapshot()
  })
  it('should render <OtherIdentifierField />', () => {
    const component = shallow(
      <StoresProvider store={getStores()}>
        <OtherIdentifierField />
      </StoresProvider>
    )
    expect(component).toMatchSnapshot()
  })
  it('should render <FieldOfScienceField />', () => {
    const component = shallow(
      <StoresProvider store={getStores()}>
        <FieldOfScienceField />
      </StoresProvider>
    )
    expect(component).toMatchSnapshot()
  })
  it('should render <LanguageField />', () => {
    const component = shallow(
      <StoresProvider store={getStores()}>
        <LanguageField />
      </StoresProvider>
    )
    expect(component).toMatchSnapshot()
  })
  it('should render <KeywordsField />', () => {
    const component = shallow(
      <StoresProvider store={getStores()}>
        <KeywordsField />
      </StoresProvider>
    )
    expect(component).toMatchSnapshot()
  })
})

describe('Qvain dataset list filtering', () => {
  const datasets = [
    {
      identifier: '1',
      research_dataset: {
        title: { en: 'Dataset', fi: 'Aineisto' },
      },
    },
    {
      identifier: '2',
      research_dataset: {
        title: { en: 'Version 1 of Dataset Versions' },
      },
      dataset_version_set: [{ identifier: '2' }, { identifier: '3' }, { identifier: '4' }],
    },
    {
      identifier: '3',
      research_dataset: {
        title: { en: 'Version 2, Dataset' },
      },
      dataset_version_set: [{ identifier: '2' }, { identifier: '3' }, { identifier: '4' }],
    },
    {
      identifier: '5',
      research_dataset: {
        title: { en: 'Another Dataset' },
      },
    },
    {
      identifier: '4',
      research_dataset: {
        title: { en: 'Version 3', fi: 'Aineiston versio 3' },
      },
      dataset_version_set: [{ identifier: '2' }, { identifier: '3' }, { identifier: '4' }],
    },
  ]

  const dataset = datasets[0]
  const versions = [datasets[1], datasets[2], datasets[4]]
  const dataset2 = datasets[3]

  it('groups datasets by version set', () => {
    const groups = groupDatasetsByVersionSet(datasets)
    expect(groups).toEqual([[dataset], versions, [dataset2]])
  })

  it('filters dataset groups by title', () => {
    const groups = groupDatasetsByVersionSet(datasets)
    expect(filterGroupsByTitle('Dataset', groups)).toEqual([[dataset], versions, [dataset2]])
  })

  it('filters datasets by title in any language', () => {
    expect(filterByTitle('Aineisto', datasets)).toEqual([dataset, datasets[4]])
    expect(filterByTitle('Version', datasets)).toEqual(versions)
  })

  it('filters dataset groups by title in any language', () => {
    const groups = groupDatasetsByVersionSet(datasets)
    expect(filterGroupsByTitle('Aineisto', groups)).toEqual([[dataset], versions])
  })

  it('ignores case when filtering by title', () => {
    expect(filterByTitle('dataset', datasets)).toEqual([
      dataset,
      datasets[1],
      datasets[2],
      dataset2,
    ])
  })
})

describe('Qvain.RightsAndLicenses', () => {
  const getRenderedLicenseUrls = shallowLicenseComponent => {
    const selectedOptions = shallowLicenseComponent
      .findWhere(c => c.prop('component') == CreatableSelect)
      .dive()
      .dive()
      .dive()
      .dive()
      .find(components.MultiValue)
    return selectedOptions.map(opt => opt.prop('data').identifier)
  }

  it('should render <RightsAndLicenses />', () => {
    const component = shallow(<RightsAndLicenses />)
    expect(component).toMatchSnapshot()
  })
  it('should render <Licenses />', () => {
    const stores = getStores()
    const component = shallow(<License Stores={stores} theme={etsinTheme} />)
    expect(component).toMatchSnapshot()
  })
  it('should render default license', () => {
    const stores = getStores()
    stores.Qvain.resetQvainStore()
    const component = shallow(<License Stores={stores} theme={etsinTheme} />)
    expect(getRenderedLicenseUrls(component)).toEqual([LICENSE_URL.CCBY4])
  })
  it('should render one added license, Other (URL)', () => {
    const stores = getStores()
    stores.Qvain.setLicenseArray([
      LicenseConstructor({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'https://test.url'),
    ])
    const component = shallow(<License Stores={stores} theme={etsinTheme} />)
    expect(getRenderedLicenseUrls(component)).toEqual(['https://test.url'])
  })
  it('should render one added license, CCBY4', () => {
    const stores = getStores()
    stores.Qvain.setLicenseArray([])
    stores.Qvain.setLicenseArray([
      LicenseConstructor(
        { en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)' },
        LICENSE_URL.CCBY4
      ),
    ])
    const component = shallow(<License Stores={stores} theme={etsinTheme} />)
    expect(getRenderedLicenseUrls(component)).toEqual([LICENSE_URL.CCBY4])
  })
  it('should render three added licenses, Other (URL) x 2 + CCBY4', () => {
    const stores = getStores()
    stores.Qvain.setLicenseArray([
      LicenseConstructor({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'https://test.url'),
      LicenseConstructor({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'https://test2.url'),
      LicenseConstructor(
        { en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)' },
        LICENSE_URL.CCBY4
      ),
    ])
    const component = shallow(<License Stores={stores} theme={etsinTheme} />)
    expect(getRenderedLicenseUrls(component)).toEqual([
      'https://test.url',
      'https://test2.url',
      LICENSE_URL.CCBY4,
    ])
  })
  it('should render four licenses where two have errors', () => {
    const stores = getStores()
    stores.Qvain.setLicenseArray([
      LicenseConstructor(
        { en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)' },
        LICENSE_URL.CCBY4
      ),
      LicenseConstructor({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'httpöötest.url'),
      LicenseConstructor({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'http://ok.url'),
      LicenseConstructor({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'httppp:/fail.url'),
    ])
    const component = shallow(<License Stores={stores} theme={etsinTheme} />)
    component.instance().validateLicenses()
    expect(getRenderedLicenseUrls(component)).toEqual([
      LICENSE_URL.CCBY4,
      'httpöötest.url',
      'http://ok.url',
      'httppp:/fail.url',
    ])
    const errors = component
      .find(ValidationErrors)
      .dive()
      .find(ValidationErrorItem)
      .map(item => item.text())
    expect(errors.length).toBe(2)
    expect(errors[0].startsWith('httpöötest.url'))
    expect(errors[1].startsWith('httppp:/fail.url'))
  })
  it('should render <AccessType />', () => {
    const component = shallow(<AccessType Stores={getStores()} />)
    expect(component).toMatchSnapshot()
  })
  it('should render <RestrictionGrounds />', () => {
    const stores = getStores()
    stores.Qvain.setAccessType(AccessTypeConstructor(undefined, ACCESS_TYPE_URL.EMBARGO))
    const component = shallow(<AccessType Stores={stores} />)
    expect(component.find(RestrictionGrounds).length).toBe(1)
  })
  it('should NOT render <RestrictionGrounds />', () => {
    const stores = getStores()
    stores.Qvain.setAccessType(AccessTypeConstructor(undefined, ACCESS_TYPE_URL.OPEN))
    const component = shallow(<AccessType Stores={stores} />)
    expect(component.find(RestrictionGrounds).length).toBe(0)
  })
  it('should render <EmbargoExpires />', () => {
    const stores = getStores()
    stores.Qvain.setAccessType(AccessTypeConstructor(undefined, ACCESS_TYPE_URL.EMBARGO))
    const component = shallow(<AccessType Stores={stores} />)
    expect(component.find(EmbargoExpires).length).toBe(1)
  })
  it('should NOT render <EmbargoExpires />', () => {
    const stores = getStores()
    stores.Qvain.setAccessType(AccessTypeConstructor(undefined, ACCESS_TYPE_URL.OPEN))
    const component = shallow(<AccessType Stores={stores} />)
    expect(component.find(EmbargoExpires).length).toBe(0)
  })
})

jest.mock('../js/components/qvain/utils/stores', () => {
  const withStores = require('../js/stores/stores').withStores
  const DATA_CATALOG_IDENTIFIER = require('../js/utils/constants').DATA_CATALOG_IDENTIFIER
  const useStores = jest.fn()
  const mockExternalFilesEmpty = {
    Qvain: {
      addedExternalResources: [],
    },
  }
  const mockExternalFilesOneItem = {
    Qvain: {
      addedExternalResources: [{ id: 'id', accessUrl: 'accessUrl', downloadUrl: 'downloadUrl' }],
    },
  }
  const mockIssuedDateUseDoiFalse = {
    Qvain: {
      original: {},
      useDoi: false,
    },
    Locale: {
      lang: 'fi',
    },
  }
  const mockIssuedDateOriginalExist = {
    Qvain: {
      original: { identifier: 'test' },
      useDoi: false,
    },
    Locale: {
      lang: 'fi',
    },
  }
  const mockIssuedDateUseDoiTrue = {
    Qvain: {
      original: { identifier: 'test' },
      useDoi: true,
    },
    Locale: {
      lang: 'fi',
    },
  }
  const mockDoiSelectionAtt = {
    Qvain: {
      dataCatalog: DATA_CATALOG_IDENTIFIER.ATT,
    },
  }
  const mockDoiSelectionPas = {
    Qvain: {
      dataCatalog: DATA_CATALOG_IDENTIFIER.PAS,
    },
  }
  const mockDoiSelectionIda = {
    Qvain: {
      dataCatalog: DATA_CATALOG_IDENTIFIER.IDA,
      useDoi: false, // TODO: setOriginal needs to be tested that it correctly sets useDoi to false when the dataset is new
    },
  }
  const mockDoiSelectionIdaPublished = {
    Qvain: {
      dataCatalog: DATA_CATALOG_IDENTIFIER.IDA,
      original: { state: 'published' },
    },
  }
  const mockDoiSelectionIdaDraft = {
    Qvain: {
      dataCatalog: DATA_CATALOG_IDENTIFIER.IDA,
      original: { state: 'draft' },
      useDoi: false,
    },
  }
  const mockDoiSelectionIdaDraftOf = {
    Qvain: {
      dataCatalog: DATA_CATALOG_IDENTIFIER.IDA,
      original: { state: 'draft', draft_of: { identifier: 'mock_id' } },
    },
  }
  const mockDoiSelectionIdaUseDoi = {
    Qvain: {
      dataCatalog: DATA_CATALOG_IDENTIFIER.IDA,
      useDoi: true,
    },
  }

  useStores.mockReturnValueOnce(mockExternalFilesEmpty)
  useStores.mockReturnValueOnce(mockExternalFilesEmpty)
  useStores.mockReturnValueOnce(mockExternalFilesOneItem)
  useStores.mockReturnValueOnce(mockIssuedDateUseDoiFalse)
  useStores.mockReturnValueOnce(mockIssuedDateOriginalExist)
  useStores.mockReturnValueOnce(mockIssuedDateUseDoiTrue)
  useStores.mockReturnValueOnce(mockDoiSelectionAtt)
  useStores.mockReturnValueOnce(mockDoiSelectionPas)
  useStores.mockReturnValueOnce(mockDoiSelectionIda)
  useStores.mockReturnValueOnce(mockDoiSelectionIdaPublished)
  useStores.mockReturnValueOnce(mockDoiSelectionIdaDraft)
  useStores.mockReturnValueOnce(mockDoiSelectionIdaDraftOf)
  useStores.mockReturnValueOnce(mockDoiSelectionIdaUseDoi)

  return {
    withStores,
    useStores,
  }
})

describe('Qvain.ExternalFiles', () => {
  it('should render correctly', async () => {
    let externalFiles = shallow(<ExternalFilesBase />)
    expect(externalFiles.find(SlidingContent).length).toBe(1)
  })

  // External resources should be listed if there are any
  it('should list all added resources', () => {
    const stores = getStores()
    let externalFiles = shallow(<ExternalFilesBase />)
    expect(externalFiles.find(ButtonGroup).length).toBe(0)
    stores.Qvain.saveExternalResource(
      ExternalResource(
        1,
        'External Resource Title',
        'http://en.wikipedia.org',
        'https://en.wikipedia.org/wiki/Portal:Arts'
      )
    )
    externalFiles = shallow(<ExternalFilesBase />)
    expect(externalFiles.find(ButtonGroup).length).toBe(1)
  })
})

describe('Qvain issued date', () => {
  let Qvain
  let Stores
  beforeEach(() => {
    Stores = getStores()
    Qvain = Stores.Qvain
    Qvain.resetQvainStore()
  })

  it('is enabled', () => {
    const component = shallow(<IssuedDateField />)
    expect(component.find(DatePicker).prop('disabled')).toEqual(false)
  })

  it('is enabled for unpublished DOI dataset', () => {
    Qvain.setUseDoi(true)
    const component = shallow(<IssuedDateField />)
    expect(component.find(DatePicker).prop('disabled')).toEqual(false)
  })

  it('is disabled for published DOI dataset', () => {
    Qvain.setUseDoi(true)
    Qvain.setOriginal({ identifier: 'test' })
    const component = shallow(<IssuedDateField />)
    expect(component.find(DatePicker).prop('disabled')).toEqual(true)
  })
})

describe('Qvain DOI selection', () => {
  it('should not render DOI selector for ATT catalog', () => {
    const component = shallow(<DoiSelection />)
    expect(component.type()).toBe(null)
  })

  it('should not render DOI selector for PAS catalog', () => {
    const component = shallow(<DoiSelection />)
    expect(component.type()).toBe(null)
  })

  it('renders DOI selector for new dataset with IDA catalog', () => {
    const component = shallow(<DoiSelection />)
    const checkbox = component.find(DoiCheckbox)
    expect(checkbox.prop('checked')).toBe(false)
  })

  it('should not render DOI selector for published dataset', () => {
    const component = shallow(<DoiSelection />)
    expect(component.type()).toBe(null)
  })

  it('renders DOI selector for new draft', () => {
    const component = shallow(<DoiSelection />)
    const checkbox = component.find(DoiCheckbox)
    expect(checkbox.prop('checked')).toBe(false)
  })

  it('should not render DOI selector for draft of published dataset', () => {
    const component = shallow(<DoiSelection />)
    expect(component.type()).toBe(null)
  })

  it('checks the checkbox', () => {
    const component = shallow(<DoiSelection />)
    const checkbox = component.find(DoiCheckbox)
    expect(checkbox.prop('checked')).toBe(true)
  })
})

describe('Qvain validation', () => {
  let actors
  let dataset
  beforeEach(() => {
    actors = [
      {
        type: 'organization',
        roles: ['creator'],
        organizations: [
          {
            name: {
              en: 'Test organization',
            },
          },
        ],
      },
    ]
    dataset = {
      title: { en: 'title' },
      description: { en: 'description' },
      keywords: ['keyword'],
      license: [
        {
          name: { en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)' },
          identifier: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
        },
      ],
      dataCatalog: 'urn:nbn:fi:att:data-catalog-ida',
      actors,
      accessType: {
        url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
      },
    }
  })

  it('should validate dataset', async () => {
    actors[0].roles.push('publisher')
    try {
      expect(await qvainFormSchema.validate(dataset, { abortEarly: false }))
    } catch (e) {
      if (e.errors) {
        fail(e.errors)
      } else {
        fail(e)
      }
    }
  })

  it('should fail when required fields for DOI are missing', async () => {
    dataset.useDoi = true // missing publisher role and issuedDate

    try {
      expect(await qvainFormSchema.validate(dataset, { abortEarly: false }))
      fail('should have thrown error')
    } catch (e) {
      expect(e.errors.length).toBe(2)
      expect(e.errors).toEqual(
        expect.arrayContaining([
          translate('qvain.validationMessages.issuedDate.requiredIfUseDoi'),
          translate('qvain.validationMessages.actors.requiredActors.mandatoryActors.publisher'),
        ])
      )
    }
  })

  it('should validate dataset with DOI enabled', async () => {
    dataset.useDoi = true
    dataset.issuedDate = '2020-06-01'
    actors[0].roles.push('publisher')

    try {
      expect(await qvainFormSchema.validate(dataset, { abortEarly: false }))
    } catch (e) {
      if (e.errors) {
        fail(e.errors)
      } else {
        fail(e)
      }
    }
  })
})
