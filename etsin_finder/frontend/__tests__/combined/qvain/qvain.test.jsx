import React from 'react'
import { shallow } from 'enzyme'
import Translate from 'react-translate-component'
import { components } from 'react-select'
import CreatableSelect from 'react-select/creatable'

import etsinTheme from '../../../js/styles/theme'
import '../../../locale/translations'
import { Qvain as QvainBase } from '../../../js/components/qvain/views/main'
import DescriptionField from '../../../js/components/qvain/fields/description'
import OtherIdentifierField from '../../../js/components/qvain/fields/description/otherIdentifier'
import FieldOfScienceField from '../../../js/components/qvain/fields/description/fieldOfScience'
import IssuedDateField from '../../../js/components/qvain/fields/description/issuedDate'
import LanguageField from '../../../js/components/qvain/fields/description/language'
import KeywordsField from '../../../js/components/qvain/fields/description/keywords'
import SubjectHeadingsField from '../../../js/components/qvain/fields/description/subjectHeadings'
import RightsAndLicenses from '../../../js/components/qvain/fields/licenses'
import { License } from '../../../js/components/qvain/fields/licenses/licenses'
import { AccessType } from '../../../js/components/qvain/fields/licenses/accessType'
import RestrictionGrounds from '../../../js/components/qvain/fields/licenses/restrictionGrounds'
import EmbargoExpires from '../../../js/components/qvain/fields/licenses/embargoExpires'
import { ACCESS_TYPE_URL, LICENSE_URL, DATA_CATALOG_IDENTIFIER } from '../../../js/utils/constants'
import { qvainFormSchema } from '../../../js/components/qvain/utils/formValidation'
import { ExternalFilesBase } from '../../../js/components/qvain/fields/files/external/externalFiles'
import DoiSelection, { DoiCheckbox } from '../../../js/components/qvain/fields/files/doiSelection'
import { ButtonGroup } from '../../../js/components/qvain/general/buttons'
import {
  ValidationErrors,
} from '../../../js/components/qvain/general/errors/validationError'
import { SlidingContent } from '../../../js/components/qvain/general/card'
import Env from '../../../js/stores/domain/env'
import QvainStoreClass, { ExternalResource } from '../../../js/stores/view/qvain'
import LocaleStore from '../../../js/stores/view/locale'
import TablePasState from '../../../js/components/qvain/views/datasets/tablePasState'
import {
  filterByTitle,
  filterGroupsByTitle,
  groupDatasetsByVersionSet,
} from '../../../js/components/qvain/views/datasets/filter'
import DatePicker from '../../../js/components/qvain/general/input/datepicker'
import TranslationTab from '../../../js/components/qvain/general/input/translationTab'
import { useStores } from '../../../js/stores/stores'

jest.mock('uuid', original => {
  let id = 0
  return {
    ...original,
    v4: () => {
      id += 1
      return id
    },
  }
})

jest.mock('moment', () => {
  const actual = jest.requireActual('moment')
  function momentMock(value) {
    return actual(value || '2020-11-02T12:34Z')
  }
  momentMock.locale = actual.locale
  return momentMock
})

jest.mock('../../../js/stores/stores', () => {
  const mockUseStores = jest.fn()
  return {
    ...jest.requireActual('../../../js/stores/stores'),
    useStores: mockUseStores,
  }
})

const getStores = () => {
  Env.Flags.setFlag('METAX_API_V2', true)
  LocaleStore.setLang('en')
  return {
    Env,
    Qvain: new QvainStoreClass(Env),
    Locale: LocaleStore,
  }
}

const emptyMatch = { params: { identifier: null } }

describe('Qvain', () => {
  let stores

  beforeEach(() => {
    stores = getStores()
    stores.Qvain.resetQvainStore()
    useStores.mockReturnValue(stores)
  })

  it('should render correctly', () => {
    const component = shallow(
      <QvainBase Stores={getStores()} history={{}} location={{ pathname: '' }} match={emptyMatch} />
    )

    expect(component).toMatchSnapshot()
  })

  it('should open existing dataset when the identifier in the url changes', () => {
    stores = getStores()

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
  let stores

  beforeEach(() => {
    stores = getStores()
    stores.Qvain.resetQvainStore()
    useStores.mockReturnValue(stores)
  })

  it('should render <TablePasState />', () => {
    const component = shallow(<TablePasState preservationState={0} />)
    expect(component).toMatchSnapshot()
  })
})

describe('Qvain.Description', () => {
  let stores

  beforeEach(() => {
    stores = getStores()
    stores.Qvain.resetQvainStore()
    useStores.mockReturnValue(stores)
  })

  it('should render <DescriptionField />', () => {
    const component = shallow(<DescriptionField />)
    expect(component).toMatchSnapshot()
  })
  it('should render <OtherIdentifierField />', () => {
    const component = shallow(<OtherIdentifierField.wrappedComponent />)
    expect(component).toMatchSnapshot()
  })
  it('should render <FieldOfScienceField />', () => {
    const component = shallow(<FieldOfScienceField.wrappedComponent />)
    expect(component).toMatchSnapshot()
  })
  it('should render <LanguageField />', () => {
    const component = shallow(<LanguageField.wrappedComponent />)
    expect(component).toMatchSnapshot()
  })
  it('should render <KeywordsField />', () => {
    const component = shallow(<KeywordsField.wrappedComponent />)
    expect(component).toMatchSnapshot()
  })
  it('should render <SubjectHeadingsField />', () => {
    const component = shallow(<SubjectHeadingsField.wrappedComponent Stores={getStores()} />)
    expect(component).toMatchSnapshot()
  })
})

describe('Qvain translation tabs', () => {
  let stores
  beforeEach(() => {
    stores = getStores()
    useStores.mockReturnValue(stores)
  })

  const getTranslationTabProps = (localeLanguage, activeTabLanguage) => {
    stores.Locale.setLang(localeLanguage, false)
    const component = shallow(
      <TranslationTab language={activeTabLanguage} setLanguage={() => {}} children="" />
    )
    const langButtons = component.find('[type="button"]').map(btn => btn.props())
    return langButtons.map(({ language, active }) => ({ language, active }))
  }

  it('shows correct TranslationTab', () => {
    expect(getTranslationTabProps('en', 'en')).toEqual([
      { language: 'en', active: true },
      { language: 'fi', active: false },
    ])
    expect(getTranslationTabProps('en', 'fi')).toEqual([
      { language: 'en', active: false },
      { language: 'fi', active: true },
    ])
    expect(getTranslationTabProps('fi', 'fi')).toEqual([
      { language: 'fi', active: true },
      { language: 'en', active: false },
    ])
    expect(getTranslationTabProps('fi', 'en')).toEqual([
      { language: 'fi', active: false },
      { language: 'en', active: true },
    ])
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
  let stores
  const getRenderedLicenseUrls = shallowLicenseComponent => {
    const selectedOptions = shallowLicenseComponent
      .findWhere(c => c.prop('component') === CreatableSelect)
      .dive()
      .dive()
      .dive()
      .dive()
      .find(components.MultiValue)
    return selectedOptions.map(opt => opt.prop('data').identifier)
  }

  beforeEach(() => {
    stores = getStores()
    stores.Qvain.resetQvainStore()
    useStores.mockReturnValue(stores)
  })

  it('should render <RightsAndLicenses />', () => {
    const component = shallow(<RightsAndLicenses />)
    expect(component).toMatchSnapshot()
  })
  it('should render <Licenses />', () => {
    const component = shallow(<License Stores={stores} theme={etsinTheme} />)
    expect(component).toMatchSnapshot()
  })
  it('should render default license', () => {
    const component = shallow(<License Stores={stores} theme={etsinTheme} />)
    expect(getRenderedLicenseUrls(component)).toEqual([LICENSE_URL.CCBY4])
  })
  it('should render one added license, Other (URL)', () => {
    const { set: setLicenseArray, Model: LicenseConstructor } = stores.Qvain.Licenses
    setLicenseArray([
      LicenseConstructor({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'https://test.url'),
    ])
    const component = shallow(<License Stores={stores} theme={etsinTheme} />)
    expect(getRenderedLicenseUrls(component)).toEqual(['https://test.url'])
  })
  it('should render one added license, CCBY4', () => {
    const { set: setLicenseArray, Model: LicenseConstructor } = stores.Qvain.Licenses
    setLicenseArray([])
    setLicenseArray([
      LicenseConstructor(
        { en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)' },
        LICENSE_URL.CCBY4
      ),
    ])
    const component = shallow(<License Stores={stores} theme={etsinTheme} />)
    expect(getRenderedLicenseUrls(component)).toEqual([LICENSE_URL.CCBY4])
  })
  it('should render three added licenses, Other (URL) x 2 + CCBY4', () => {
    const { set: setLicenseArray, Model: LicenseConstructor } = stores.Qvain.Licenses
    setLicenseArray([
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
    const { Licenses } = stores.Qvain
    Licenses.set([
      Licenses.Model(
        { en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)' },
        LICENSE_URL.CCBY4
      ),
      Licenses.Model({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'httpöötest.url'),
      Licenses.Model({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'http://ok.url'),
      Licenses.Model({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'httppp:/fail.url'),
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
      .find(Translate) // ValidationErrorItem
      .map(item => item.text())

    expect(errors.length).toBe(2)
    expect(errors[0].startsWith('httpöötest.url'))
    expect(errors[1].startsWith('httppp:/fail.url'))
  })
  it('should render <AccessType />', () => {
    const component = shallow(<AccessType Stores={stores} />)
    expect(component).toMatchSnapshot()
  })
  it('should render <RestrictionGrounds />', () => {
    const { set: setAccessType, Model: AccessTypeConstructor } = stores.Qvain.AccessType
    setAccessType(AccessTypeConstructor(undefined, ACCESS_TYPE_URL.EMBARGO))
    const component = shallow(<AccessType Stores={stores} />)
    expect(component.find(RestrictionGrounds).length).toBe(1)
  })
  it('should NOT render <RestrictionGrounds />', () => {
    const { set: setAccessType, Model: AccessTypeConstructor } = stores.Qvain.AccessType
    setAccessType(AccessTypeConstructor(undefined, ACCESS_TYPE_URL.OPEN))
    const component = shallow(<AccessType Stores={stores} />)
    expect(component.find(RestrictionGrounds).length).toBe(0)
  })
  it('should render <EmbargoExpires />', () => {
    const { set: setAccessType, Model: AccessTypeConstructor } = stores.Qvain.AccessType
    setAccessType(AccessTypeConstructor(undefined, ACCESS_TYPE_URL.EMBARGO))
    const component = shallow(<AccessType Stores={stores} />)
    expect(component.find(EmbargoExpires).length).toBe(1)
  })
  it('should NOT render <EmbargoExpires />', () => {
    const { set: setAccessType, Model: AccessTypeConstructor } = stores.Qvain.AccessType
    setAccessType(AccessTypeConstructor(undefined, ACCESS_TYPE_URL.OPEN))
    const component = shallow(<AccessType Stores={stores} />)
    expect(component.find(EmbargoExpires).length).toBe(0)
  })
})

describe('Qvain.ExternalFiles', () => {
  let stores

  beforeEach(() => {
    stores = getStores()
    stores.Qvain.resetQvainStore()
    useStores.mockReturnValue(stores)
  })

  it('should render correctly', async () => {
    const externalFiles = shallow(<ExternalFilesBase />)
    expect(externalFiles.find(SlidingContent).length).toBe(1)
    expect(externalFiles.find(ButtonGroup).length).toBe(0)
  })

  // External resources should be listed if there are any
  it('should list all added resources', () => {
    stores.Qvain.saveExternalResource(
      ExternalResource(
        1,
        'External Resource Title',
        'http://en.wikipedia.org',
        'https://en.wikipedia.org/wiki/Portal:Arts'
      )
    )
    const externalFiles = shallow(<ExternalFilesBase />)
    expect(externalFiles.find(ButtonGroup).length).toBe(1)
  })
})

describe('Qvain issued date', () => {
  let Qvain
  let stores

  beforeEach(() => {
    stores = getStores()
    useStores.mockReturnValue(stores)
    Qvain = stores.Qvain
    Qvain.resetQvainStore()
  })

  const IssuedDateFieldBase = IssuedDateField.wrappedComponent

  it('is enabled', () => {
    const component = shallow(<IssuedDateFieldBase />)
    expect(component.find(DatePicker).prop('disabled')).toEqual(false)
  })

  it('is enabled for unpublished DOI dataset', () => {
    Qvain.setUseDoi(true)
    const component = shallow(<IssuedDateFieldBase />)
    expect(component.find(DatePicker).prop('disabled')).toEqual(false)
  })

  it('is disabled for published DOI dataset', () => {
    Qvain.setUseDoi(true)
    Qvain.setOriginal({ identifier: 'test' })
    const component = shallow(<IssuedDateFieldBase />)
    expect(component.find(DatePicker).prop('disabled')).toEqual(true)
  })
})

describe('Qvain DOI selection', () => {
  let stores

  beforeEach(() => {
    stores = getStores()
    stores.Qvain.resetQvainStore()
    useStores.mockReturnValue(stores)
  })

  it('should not render DOI selector for ATT catalog', () => {
    stores.Qvain.setDataCatalog(DATA_CATALOG_IDENTIFIER.ATT)
    const component = shallow(<DoiSelection />)
    expect(component.type()).toBe(null)
  })

  it('should not render DOI selector for PAS catalog', () => {
    stores.Qvain.setDataCatalog(DATA_CATALOG_IDENTIFIER.PAS)
    const component = shallow(<DoiSelection />)
    expect(component.type()).toBe(null)
  })

  it('renders DOI selector for new dataset with IDA catalog', () => {
    stores.Qvain.setDataCatalog(DATA_CATALOG_IDENTIFIER.IDA)
    const component = shallow(<DoiSelection />)
    const checkbox = component.find(DoiCheckbox)
    expect(checkbox.prop('checked')).toBe(false)
  })

  it('should not render DOI selector for published dataset', () => {
    const { setDataCatalog, setOriginal } = stores.Qvain
    setDataCatalog(DATA_CATALOG_IDENTIFIER.IDA)
    setOriginal({
      state: 'published',
    })
    const component = shallow(<DoiSelection />)
    expect(component.type()).toBe(null)
  })

  it('renders DOI selector for new draft', () => {
    const { setDataCatalog, setOriginal } = stores.Qvain
    setDataCatalog(DATA_CATALOG_IDENTIFIER.IDA)
    setOriginal({
      state: 'draft',
    })
    const component = shallow(<DoiSelection />)
    const checkbox = component.find(DoiCheckbox)
    expect(checkbox.prop('checked')).toBe(false)
  })

  it('should not render DOI selector for draft of published dataset', () => {
    const { setDataCatalog, setOriginal } = stores.Qvain
    setDataCatalog(DATA_CATALOG_IDENTIFIER.IDA)
    setOriginal({
      state: 'draft',
      draft_of: {
        identifier: 'some_identifier',
      },
    })
    const component = shallow(<DoiSelection />)
    expect(component.type()).toBe(null)
  })

  it('checks the checkbox', () => {
    const { setDataCatalog, setUseDoi } = stores.Qvain
    setDataCatalog(DATA_CATALOG_IDENTIFIER.IDA)
    setUseDoi(true)
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
          'qvain.validationMessages.issuedDate.requiredIfUseDoi',
          'qvain.validationMessages.actors.requiredActors.mandatoryActors.publisher',
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
