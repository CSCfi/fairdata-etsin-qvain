import React from 'react'
import { shallow } from 'enzyme'
import translate from 'counterpart'

import '../locale/translations'
import Qvain from '../js/components/qvain'
import Description from '../js/components/qvain/description'
import DescriptionField from '../js/components/qvain/description/descriptionField'
import OtherIdentifierField from '../js/components/qvain/description/otherIdentifierField'
import FieldOfScienceField from '../js/components/qvain/description/fieldOfScienceField'
import KeywordsField from '../js/components/qvain/description/keywordsField'
import RightsAndLicenses from '../js/components/qvain/licenses'
import { License } from '../js/components/qvain/licenses/licenses'
import { AccessType } from '../js/components/qvain/licenses/accessType'
import RestrictionGrounds from '../js/components/qvain/licenses/resctrictionGrounds'
import EmbargoExpires from '../js/components/qvain/licenses/embargoExpires'
import { AccessTypeURLs, LicenseUrls } from '../js/components/qvain/utils/constants'
import { qvainFormSchema } from '../js/components/qvain/utils/formValidation'
import { ExternalFilesBase } from '../js/components/qvain/files/external/externalFiles'
import { ButtonGroup } from '../js/components/qvain/general/buttons'
import { SlidingContent } from '../js/components/qvain/general/card'
import QvainStore, {
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

const getStores = () => {
  QvainStore.setMetaxApiV2(true)
  return {
    Qvain: QvainStore,
    Locale: LocaleStore,
  }
}

describe('Qvain', () => {
  it('should render correctly', () => {
    const component = shallow(<Qvain Stores={getStores()} />)

    expect(component).toMatchSnapshot()
  })

  it('should open existing dataset when the identifier in the url changes', () => {
    const stores = getStores()

    // Mock react router matches for identifier
    const emptyMatch = { params: { identifier: null } }
    const identifierMatch = { params: { identifier: 'some_identifier' } }
    const anotherMatch = { params: { identifier: 'another_identifier' } }

    // Replace Qvain.getDataset so we can test it was called correctly
    let callCount = 0
    let lastCall
    class FakeQvain extends Qvain.WrappedComponent.wrappedComponent {
      getDataset(identifier) {
        callCount += 1
        lastCall = identifier
      }
    }

    // Create empty dataset, getDataset should not be called
    shallow(<FakeQvain Stores={stores} match={emptyMatch} history={{}} />)
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
    shallow(<FakeQvain Stores={datasetOpenedStore} match={identifierMatch} history={{}} />)
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
    shallow(<FakeQvain Stores={anotherDatasetOpenedStore} match={identifierMatch} history={{}} />)
    expect(callCount).toBe(1)
    expect(lastCall).toBe(identifierMatch.params.identifier)

    // Edit existing dataset, getDataset should be called
    lastCall = undefined
    const wrapper = shallow(<FakeQvain Stores={stores} match={identifierMatch} history={{}} />)
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
    const component = shallow(<OtherIdentifierField Stores={getStores()} />)
    expect(component).toMatchSnapshot()
  })
  it('should render <FieldOfScienceField />', () => {
    const component = shallow(<FieldOfScienceField Stores={getStores()} />)
    expect(component).toMatchSnapshot()
  })
  it('should render <KeywordsField />', () => {
    const component = shallow(<KeywordsField Stores={getStores()} />)
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
    expect(filterByTitle('dataset', datasets)).toEqual([dataset, datasets[1], datasets[2], dataset2])
  })
})

describe('Qvain.RightsAndLicenses', () => {
  it('should render <RightsAndLicenses />', () => {
    const component = shallow(<RightsAndLicenses />)
    expect(component).toMatchSnapshot()
  })
  it('should render <Licenses />', () => {
    const component = shallow(<License Stores={getStores()} />)
    expect(component).toMatchSnapshot()
  })
  it('should render other license URL field', () => {
    const stores = getStores()
    stores.Qvain.setLicense(LicenseConstructor({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'other'))
    const component = shallow(<License Stores={stores} />)
    expect(component.find('#otherLicenseURL').length).toBe(1)
  })
  it('should NOT render other license URL field', () => {
    const stores = getStores()
    stores.Qvain.setLicense(LicenseConstructor(undefined, LicenseUrls.CCBY4))
    const component = shallow(<License Stores={stores} />)
    expect(component.find('#otherLicenseURL').length).toBe(0)
  })
  it('should render <AccessType />', () => {
    const component = shallow(<AccessType Stores={getStores()} />)
    expect(component).toMatchSnapshot()
  })
  it('should render <RestrictionGrounds />', () => {
    const stores = getStores()
    stores.Qvain.setAccessType(AccessTypeConstructor(undefined, AccessTypeURLs.EMBARGO))
    const component = shallow(<AccessType Stores={stores} />)
    expect(component.find(RestrictionGrounds).length).toBe(1)
  })
  it('should NOT render <RestrictionGrounds />', () => {
    const stores = getStores()
    stores.Qvain.setAccessType(AccessTypeConstructor(undefined, AccessTypeURLs.OPEN))
    const component = shallow(<AccessType Stores={stores} />)
    expect(component.find(RestrictionGrounds).length).toBe(0)
  })
  it('should render <EmbargoExpires />', () => {
    const stores = getStores()
    stores.Qvain.setAccessType(AccessTypeConstructor(undefined, AccessTypeURLs.EMBARGO))
    const component = shallow(<AccessType Stores={stores} />)
    expect(component.find(EmbargoExpires).length).toBe(1)
  })
  it('should NOT render <EmbargoExpires />', () => {
    const stores = getStores()
    stores.Qvain.setAccessType(AccessTypeConstructor(undefined, AccessTypeURLs.OPEN))
    const component = shallow(<AccessType Stores={stores} />)
    expect(component.find(EmbargoExpires).length).toBe(0)
  })
})

describe('Qvain.ExternalFiles', () => {
  it('should render correctly', () => {
    const externalFiles = shallow(<ExternalFilesBase Stores={getStores()} />)
    expect(externalFiles.find(SlidingContent).length).toBe(1)
  })

  // External resources should be listed if there are any
  it('should list all added resources', () => {
    const stores = getStores()
    const externalFiles = shallow(<ExternalFilesBase Stores={stores} />)
    expect(externalFiles.find(ButtonGroup).length).toBe(0)
    stores.Qvain.saveExternalResource(
      ExternalResource(
        1,
        'External Resource Title',
        'http://en.wikipedia.org',
        'https://en.wikipedia.org/wiki/Portal:Arts'
      )
    )
    externalFiles.update()
    expect(externalFiles.find(ButtonGroup).length).toBe(1)
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
      license: {
        name: { en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)' },
        identifier: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
      },
      dataCatalog: 'urn:nbn:fi:att:data-catalog-ida',
      actors,
      accessType: {
        url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
      },
    }
  })

  it('should validate dataset', async () => {
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
          translate('qvain.validationMessages.actors.requiredActors.publisherIfDOI'),
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
