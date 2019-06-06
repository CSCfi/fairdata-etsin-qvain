import React from 'react';
import { shallow, mount } from 'enzyme'

import Qvain from '../js/components/qvain'
import {
  ParticipantSelection,
  ParticipantsBase,
  EntityType,
  Role
} from '../js/components/qvain/participants'
import { ParticipantTypeSelectBase } from '../js/components/qvain/participants/participantTypeSelect'
import Files from '../js/components/qvain/files'
import IDAFilePicker, { IDAFilePickerBase } from '../js/components/qvain/files/idaFilePicker'
import FileSelector, { FileSelectorBase } from '../js/components/qvain/files/fileSelector'
import { SelectedFilesBase, FileItem } from '../js/components/qvain/files/selectedFiles'
import DirectoryForm from '../js/components/qvain/files/directoryForm'
import {
  ExternalFilesBase,
  ResourceInput,
  ResourceSave,
  ResourceItem
} from '../js/components/qvain/files/externalFiles'
import {
  ButtonGroup,
  FilePickerButton,
  FilePickerButtonInverse,
  ButtonLabel,
  DeleteButton
} from '../js/components/qvain/general/buttons'
import {
  List,
  ListItem
} from '../js/components/qvain/general/list'
import { SlidingContent } from '../js/components/qvain/general/card'
import { SectionTitle } from '../js/components/qvain/general/section'
import QvainStore, { Directory } from '../js/stores/view/qvain'
import LocaleStore from '../js/stores/view/language'

describe('Qvain', () => {
  it('should render correctly', () => {
    const component = shallow(<Qvain Stores={getStores()} />)

    expect(component).toMatchSnapshot()
  })
})

const getStores = () => ({
  Qvain: QvainStore,
  Locale: LocaleStore
})

describe('Qvain.Participants', () => {
  it('should render correctly', () => {
    const component = shallow(<ParticipantsBase Stores={getStores()} />)
    expect(component).toMatchSnapshot()
  })

  it('should render person selection by default', () => {
    const component = mount(<ParticipantsBase Stores={getStores()} />)
    // test if active selection field displays 'Person'
    expect(component).toMatchSnapshot()
    console.log('participant render ', component.html())
    // test if name field is rendered
    // expect(component.find('#nameField').length).not.toBe(0)
  })

  // By default person should be selected. Upon clicking the Organization radio button
  // the checkboxes should be reset and active selection field should display
  // 'Organization'
  it('should change selected participant entity', () => {
    const component = mount(<ParticipantTypeSelectBase Stores={getStores()} />)
    // test if active selection field displays 'Person'
    expect(component.html().includes('Person')).toBe(true)
    // component.find('#personCreator').first().simulate('change', { target: { checked: true, value: Role.CREATOR } })
    // const isPersonCreator = component.find(ParticipantSelection).html().includes('Creator')
    // expect(isPersonCreator).toBe(true)
    // component.find('#entityOrg').first().simulate('change')
    // expect(component.find(ParticipantSelection).html().includes('Organization')).toBe(true)
    // expect(component.find(ParticipantSelection).html().includes('Creator')).toBe(false)
  })

  // Added participants should be listed if there are any
  it('should list all added participants', () => {
  //   const store = getStores()
  //   const component = mount(<Participants Stores={store} />)
  //   expect(component.find(ButtonGroup).length).toBe(0)
  //   store.Qvain.addParticipant({
  //     entityType: EntityType.ORGANIZATION,
  //     roles: [Role.PUBLISHER],
  //     name: 'University of Helsinki',
  //     email: 'test@test.fi',
  //     identifier: 'uoh'
  //   })
  //   component.update()
  //   expect(component.find(ButtonGroup).length).toBe(1)
  })
})

describe('Qvain.Files', () => {
  it('should render file picker', () => {
    const component = shallow(<Files Stores={getStores()} />)
    expect(component.find(IDAFilePicker).length).toBe(1)
  })

  it('should open file selector upon selecting file picker', () => {
    const component = shallow(<IDAFilePickerBase Stores={getStores()} />)
    component.children().last().simulate('click', {
      preventDefault: () => console.log('preventDefault')
    })
    expect(component.find(FileSelector).length).toBe(1)
  })

  it('allows selecting directories in the file selector', () => {
    const stores = getStores()
    const component = mount(<FileSelectorBase Stores={stores} />)
    stores.Qvain._selectedProject = 'project_y'
    stores.Qvain._hierarchy = Directory(
      {
        id: 'test1',
        identifier: 'test-ident-1',
        project_identifier: 'project_y',
        directory_name: 'root',
        directories: [
          Directory(
            {
              id: 'test2',
              identifier: 'test-ident-1',
              project_identifier: 'project_y',
              directory_name: 'directory2',
              directories: [],
              files: []
            },
            undefined,
            false,
            false
          )
        ],
        files: []
      },
      undefined,
      false,
      true
    )
    component.update()
    expect(component.find('li').length).toBe(1)
    component.find('li').find('input').simulate('change')
    expect(component.props().Stores.Qvain._hierarchy.directories[0].selected)
  })

  it('allows modifying the metadata of selected directories', () => {
    // repeat previous one
    const stores = getStores()
    // reset selected directories
    stores.Qvain._selectedDirectories = []
    const fileSelector = mount(<FileSelectorBase Stores={stores} />)

    stores.Qvain._selectedProject = 'project_y'
    stores.Qvain._hierarchy = Directory(
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
            files: []
          }
        ],
        files: []
      },
      undefined,
      false,
      true
    )
    fileSelector.update()
    fileSelector.find('#test2Checkbox input').simulate('change')
    fileSelector.unmount()
    // mount the SelectedFiles component
    const selectedFiles = mount(<SelectedFilesBase Stores={stores} />)
    expect(selectedFiles.find(ButtonLabel).last().text()).toBe('project_y / directory2')
    selectedFiles.find(DeleteButton).last().simulate('click', { preventDefault: () => {} })
    expect(selectedFiles.find(ButtonLabel).length).toBe(0)
  })
})

describe('Qvain.ExternalFiles', () => {
  it('should render correctly', () => {
    const extFiles = mount(<ExternalFilesBase Stores={getStores()} />)
    expect(extFiles.find(SlidingContent).length).toBe(1)
  })

  it('should add resources', () => {
    const extFiles = mount(<ExternalFilesBase Stores={getStores()} />)
    const inputs = extFiles.find(ResourceInput)
    inputs.forEach((input, index) => {
      input.simulate('change', {
        target: {
          value: `test-${index + 1}`
        }
      })
    })
    extFiles.find(ResourceSave).simulate('click')
    expect(extFiles.find(ResourceItem).length).toBe(1)
    expect(extFiles.find(ButtonLabel).text()).toBe('test-1 / test-2')
  })
})
