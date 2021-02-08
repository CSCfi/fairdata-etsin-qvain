import React from 'react'
import { shallow, mount } from 'enzyme'
import { runInAction } from 'mobx'

import { StoresProvider } from '../../../js/stores/stores'
import '../../../locale/translations'
import etsinTheme from '../../../js/styles/theme'
import Qvain, { Qvain as QvainBase } from '../../../js/components/qvain/views/main'
import Description from '../../../js/components/qvain/fields/description'
import DescriptionField from '../../../js/components/qvain/fields/description'
import OtherIdentifierField from '../../../js/components/qvain/fields/description/otherIdentifier'
import FieldOfScienceField from '../../../js/components/qvain/fields/description/fieldOfScience'
import KeywordsField from '../../../js/components/qvain/fields/description/keywords'
import RightsAndLicenses from '../../../js/components/qvain/fields/licenses'
import { License } from '../../../js/components/qvain/fields/licenses/licenses'
import { AccessType } from '../../../js/components/qvain/fields/licenses/accessType'
import RestrictionGrounds from '../../../js/components/qvain/fields/licenses/restrictionGrounds'
import EmbargoExpires from '../../../js/components/qvain/fields/licenses/embargoExpires'
import { ACCESS_TYPE_URL, DATA_CATALOG_IDENTIFIER } from '../../../js/utils/constants'
import Files from '../../../js/components/qvain/fields/files'
import IDAFilePicker, {
  IDAFilePickerBase,
} from '../../../js/components/qvain/fields/files/legacy/idaFilePicker'
import FileSelector, {
  FileSelectorBase,
} from '../../../js/components/qvain/fields/files/legacy/fileSelector'
import {
  SelectedFilesBase,
  FileLabel,
} from '../../../js/components/qvain/fields/files/legacy/selectedFiles'
import { DeleteButton } from '../../../js/components/qvain/general/buttons'
import Env from '../../../js/stores/domain/env'
import QvainStoreClass from '../../../js/stores/view/qvain'
import { Directory } from '../../../js/stores/view/qvain/qvain.filesv1'
import LocaleStore from '../../../js/stores/view/locale'

jest.mock('uuid', () => {
  let id = 0
  return {
    v4: () => id++,
  }
})

jest.mock('moment', () => {
  return () => ({
    format: format => `moment formatted date: ${format}`,
  })
})

jest.mock('../../../js/stores/stores', () => {
  const DATA_CATALOG_IDENTIFIER = require('../../../js/utils/constants').DATA_CATALOG_IDENTIFIER
  const useStores = jest.fn()

  useStores.mockReturnValue({
    Qvain: {
      dataCatalog: DATA_CATALOG_IDENTIFIER.IDA,
    },
    Env: {
      metaxApiV2: false,
    },
  })

  return {
    ...jest.requireActual('../../../js/stores/stores'),
    useStores,
  }
})

const QvainStore = new QvainStoreClass(Env)
const getStores = () => {
  Env.Flags.setFlag('METAX_API_V2', false)
  return {
    Env,
    Qvain: QvainStore,
    Locale: LocaleStore,
  }
}

describe('Qvain', () => {
  it('should render correctly', () => {
    const component = shallow(
      <StoresProvider store={getStores()}>
        <Qvain />
      </StoresProvider>
    )

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

describe('Qvain.Description', () => {
  it('should render <Description />', () => {
    const component = shallow(
      <StoresProvider store={getStores()}>
        <Description />
      </StoresProvider>
    )
    expect(component).toMatchSnapshot()
  })
  it('should render <DescriptionField />', () => {
    const component = shallow(
      <StoresProvider store={getStores()}>
        <DescriptionField />
      </StoresProvider>
    )
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
  it('should render <KeywordsField />', () => {
    const component = shallow(
      <StoresProvider store={getStores()}>
        <KeywordsField />
      </StoresProvider>
    )
    expect(component).toMatchSnapshot()
  })
})

describe('Qvain.RightsAndLicenses', () => {
  let stores
  let Licenses
  let AccessTypeStore

  beforeEach(() => {
    stores = getStores()
    stores.Qvain.resetQvainStore()
    Licenses = stores.Qvain.Licenses
    AccessTypeStore = stores.Qvain.AccessType
  })

  it('should render <RightsAndLicenses />', () => {
    const component = shallow(<RightsAndLicenses />)
    expect(component).toMatchSnapshot()
  })
  it('should render <Licenses />', () => {
    const component = shallow(<License Stores={stores} theme={etsinTheme} />)
    expect(component).toMatchSnapshot()
  })
  it('should render <AccessType />', () => {
    const component = shallow(<AccessType Stores={stores} />)
    expect(component).toMatchSnapshot()
  })
  it('should render <RestrictionGrounds />', () => {
    AccessTypeStore.set(AccessTypeStore.Model(undefined, ACCESS_TYPE_URL.EMBARGO))
    const component = shallow(<AccessType Stores={stores} />)
    expect(component.find(RestrictionGrounds).length).toBe(1)
  })
  it('should NOT render <RestrictionGrounds />', () => {
    AccessTypeStore.set(AccessTypeStore.Model(undefined, ACCESS_TYPE_URL.OPEN))
    const component = shallow(<AccessType Stores={stores} />)
    expect(component.find(RestrictionGrounds).length).toBe(0)
  })
  it('should render <EmbargoExpires />', () => {
    AccessTypeStore.set(AccessTypeStore.Model(undefined, ACCESS_TYPE_URL.EMBARGO))
    const component = shallow(<AccessType Stores={stores} />)
    expect(component.find(EmbargoExpires).length).toBe(1)
  })
  it('should NOT render <EmbargoExpires />', () => {
    AccessTypeStore.set(AccessTypeStore.Model(undefined, ACCESS_TYPE_URL.OPEN))
    const component = shallow(<AccessType Stores={stores} />)
    expect(component.find(EmbargoExpires).length).toBe(0)
  })
})

describe('Qvain.Files', () => {
  it('should render file picker', () => {
    const store = getStores()
    store.Qvain.dataCatalog = DATA_CATALOG_IDENTIFIER.IDA
    store.Qvain.idaPickerOpen = true
    const component = shallow(<Files.wrappedComponent />)
    expect(component.find(IDAFilePicker).length).toBe(1)
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
    runInAction(() => {
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
    })
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

    runInAction(() => {
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
    })
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
