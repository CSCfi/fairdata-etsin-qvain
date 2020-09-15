import React from 'react'
import { shallow, mount } from 'enzyme'

import '../locale/translations'
import etsinTheme from '../js/styles/theme'
import Qvain from '../js/components/qvain/main'
import Description from '../js/components/qvain/description'
import DescriptionField from '../js/components/qvain/description/descriptionField'
import OtherIdentifierField from '../js/components/qvain/description/otherIdentifierField'
import FieldOfScienceField from '../js/components/qvain/description/fieldOfScienceField'
import KeywordsField from '../js/components/qvain/description/keywordsField'
import RightsAndLicenses from '../js/components/qvain/licenses'
import { License } from '../js/components/qvain/licenses/licenses'
import { AccessType } from '../js/components/qvain/licenses/accessType'
import RestrictionGrounds from '../js/components/qvain/licenses/restrictionGrounds'
import EmbargoExpires from '../js/components/qvain/licenses/embargoExpires'
import { ACCESS_TYPE_URL, LICENSE_URL, DATA_CATALOG_IDENTIFIER } from '../js/utils/constants'
import Files from '../js/components/qvain/files'
import IDAFilePicker, { IDAFilePickerBase } from '../js/components/qvain/files/legacy/idaFilePicker'
import FileSelector, { FileSelectorBase } from '../js/components/qvain/files/legacy/fileSelector'
import { SelectedFilesBase, FileLabel } from '../js/components/qvain/files/legacy/selectedFiles'
import { DeleteButton } from '../js/components/qvain/general/buttons'
import Env from '../js/stores/domain/env'
import QvainStoreClass, {
  Directory,
  AccessType as AccessTypeConstructor,
  License as LicenseConstructor,
} from '../js/stores/view/qvain'
import LocaleStore from '../js/stores/view/language'

jest.mock('uuid', () => {
  let id = 0
  return {
    v4: () => id++,
  }
})

const QvainStore = new QvainStoreClass(Env)
const getStores = () => {
  Env.setMetaxApiV2(false)
  return {
    Env,
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

describe('Qvain.RightsAndLicenses', () => {
  it('should render <RightsAndLicenses />', () => {
    const component = shallow(<RightsAndLicenses />)
    expect(component).toMatchSnapshot()
  })
  it('should render <Licenses />', () => {
    const stores = getStores()
    const component = shallow(<License Stores={stores} theme={etsinTheme} />)
    expect(component).toMatchSnapshot()
  })
  it('should render <AccessType />', () => {
    const stores = getStores()
    const component = shallow(<AccessType Stores={stores} />)
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

describe('Qvain.Files', () => {
  it('should render file picker', () => {
    const store = getStores()
    store.Qvain.dataCatalog = DATA_CATALOG_IDENTIFIER.IDA
    store.Qvain.idaPickerOpen = true
    const component = shallow(<Files Stores={store} />)
    expect(component.dive().find(IDAFilePicker).length).toBe(1)
  })

  it('should open file selector upon selecting file picker', () => {
    const component = shallow(<IDAFilePickerBase Stores={getStores()} />)
    component
      .children()
      .last()
      .simulate('click', {
        preventDefault: () => console.log('preventDefault'),
      })
    expect(component.find(FileSelector).length).toBe(1)
  })

  it('allows selecting directories in the file selector', () => {
    const stores = getStores()
    const component = mount(<FileSelectorBase Stores={stores} />)
    stores.Qvain.selectedProject = 'project_y'
    stores.Qvain.hierarchy = Directory(
      {
        id: 'test1',
        identifier: 'test-ident-1',
        project_identifier: 'project_y',
        directory_name: 'root',
        directories: [
          Directory(
            {
              id: 'test2',
              identifier: 'test-ident-2',
              project_identifier: 'project_y',
              directory_name: 'directory2',
              directories: [],
              files: [],
            },
            undefined,
            false,
            false
          ),
        ],
        files: [],
      },
      undefined,
      false,
      true
    )
    component.update()
    expect(component.find('li').length).toBe(1)
    component.find('li').find('input').simulate('change')
    expect(component.props().Stores.Qvain.hierarchy.directories[0].selected)
  })

  it('allows modifying the metadata of selected directories', () => {
    // repeat previous one
    const stores = getStores()
    // reset selected directories
    stores.Qvain.selectedDirectories = []
    const fileSelector = mount(<FileSelectorBase Stores={stores} />)

    stores.Qvain.selectedProject = 'project_y'
    stores.Qvain.hierarchy = Directory(
      {
        id: 'test1',
        identifier: 'test-ident-1',
        project_identifier: 'project_y',
        directory_name: 'root',
        directories: [
          {
            id: 'test2',
            identifier: 'test-ident-2',
            project_identifier: 'project_y',
            directory_name: 'directory2',
            directories: [],
            files: [],
          },
        ],
        files: [],
      },
      undefined,
      false,
      true
    )
    fileSelector.update()
    fileSelector.find('#test2Checkbox input').simulate('change')
    fileSelector.unmount()
    // mount the SelectedFiles component
    const selectedFiles = shallow(<SelectedFilesBase Stores={stores} />)
    expect(selectedFiles.find(FileLabel).last().text()).toBe(
      '<FontAwesomeIcon />project_y / directory2'
    )
    selectedFiles
      .find(DeleteButton)
      .last()
      .simulate('click', { preventDefault: () => {} })
    expect(selectedFiles.find(FileLabel).length).toBe(0)
  })
})
