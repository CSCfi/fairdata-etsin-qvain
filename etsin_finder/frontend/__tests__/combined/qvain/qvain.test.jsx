import React from 'react'
import { shallow } from 'enzyme'

import '../../../locale/translations'
import { Qvain as QvainBase } from '../../../js/components/qvain/views/main'
import { DATA_CATALOG_IDENTIFIER } from '../../../js/utils/constants'
import { qvainFormSchema } from '../../../js/stores/view/qvain/qvain.submit.schemas'
import { ExternalFilesBase } from '../../../js/components/qvain/fields/files/external/externalFiles'
import DoiSelection, { DoiCheckbox } from '../../../js/components/qvain/fields/files/doiSelection'
import { ButtonGroup } from '../../../js/components/qvain/general/buttons'
import { SlidingContent } from '../../../js/components/qvain/general/card'
import EnvClass from '../../../js/stores/domain/env'
import AccessibilityClass from '../../../js/stores/view/accessibility'
import ElasticQueryClass from '../../../js/stores/view/elasticquery'
import QvainClass, { ExternalResource } from '../../../js/stores/view/qvain'
import LocaleClass from '../../../js/stores/view/locale'
import TablePasState from '../../../js/components/qvain/views/datasets/tablePasState'
import TranslationTab from '../../../js/components/qvain/general/input/translationTab'
import { useStores } from '../../../js/stores/stores'

global.fdweRecordEvent = () => {}

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

const Env = new EnvClass()
const Accessibility = new AccessibilityClass(Env)
const ElasticQuery = new ElasticQueryClass(Env)
const Locale = new LocaleClass(Accessibility, ElasticQuery)
const Qvain = new QvainClass(Env)

const getStores = () => {
  Locale.setLang('en')
  return {
    Env,
    Qvain,
    Locale,
    Matomo: {
      recordEvent: jest.fn(),
    },
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

describe('Qvain translation tabs', () => {
  let stores
  beforeEach(() => {
    stores = getStores()
    useStores.mockReturnValue(stores)
  })

  const getTranslationTabProps = (localeLanguage, activeTabLanguage) => {
    stores.Locale.setLang(localeLanguage)
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
      expect(await qvainFormSchema.validate(dataset, { abortEarly: false, strict: true }))
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
      expect(await qvainFormSchema.validate(dataset, { abortEarly: false, strict: true }))
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
      expect(await qvainFormSchema.validate(dataset, { abortEarly: false, strict: true }))
    } catch (e) {
      if (e.errors) {
        fail(e.errors)
      } else {
        fail(e)
      }
    }
  })
})
