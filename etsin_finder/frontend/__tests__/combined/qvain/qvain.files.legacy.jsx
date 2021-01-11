import React from 'react'
import { shallow, mount } from 'enzyme'
import { runInAction } from 'mobx'

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
import { DATA_CATALOG_IDENTIFIER } from '../../../js/utils/constants'
import { useStores } from '../../../js/stores/stores'

global.Promise = require('bluebird')
const QvainStore = new QvainStoreClass(Env)

const getStores = () => {
  Env.Flags.setFlag('METAX_API_V2', false)
  return {
    Env,
    Qvain: QvainStore,
    Locale: LocaleStore,
  }
}

jest.mock('../../../js/stores/stores', () => {
  const DATA_CATALOG_IDENTIFIER = require('../../../js/utils/constants').DATA_CATALOG_IDENTIFIER
  const useStores = jest.fn()
  useStores.mockReturnValue({
    Qvain: {
      idaPickerOpen: true,
      dataCatalog: DATA_CATALOG_IDENTIFIER.IDA,
    },
    Env: {
      metaxApiV2: false,
    },
  })
  return { ...jest.requireActual('../../../js/stores/stores'), useStores }
})

describe('Qvain.Files', () => {
  let stores

  beforeEach(() => {
    stores = getStores()
    stores.Qvain.resetQvainStore()
    useStores.mockReturnValue(stores)
  })

  it('should render file picker', () => {
    stores.Qvain.dataCatalog = DATA_CATALOG_IDENTIFIER.IDA
    stores.Qvain.idaPickerOpen = true
    const component = shallow(<Files />)
    expect(component.dive().find(IDAFilePicker).length).toBe(1)
  })

  it('should open file selector upon selecting file picker', () => {
    const component = shallow(<IDAFilePickerBase Stores={stores} />)
    component
      .children()
      .last()
      .simulate('click', {
        preventDefault: () => console.log('preventDefault'),
      })
    expect(component.find(FileSelector).length).toBe(1)
  })

  it('allows selecting directories in the file selector', () => {
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
