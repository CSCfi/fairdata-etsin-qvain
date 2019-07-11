import React from 'react';
import { shallow, mount } from 'enzyme'

import Qvain from '../js/components/qvain'
import {
  ParticipantsBase
} from '../js/components/qvain/participants'
import { ParticipantTypeSelectBase } from '../js/components/qvain/participants/participantTypeSelect'
import { SelectedParticipantBase, ParticipantSelection } from '../js/components/qvain/participants/participantSelection'
import { ParticipantInfoBase } from '../js/components/qvain/participants/participantInfo'
import { AddedParticipantsBase } from '../js/components/qvain/participants/addedParticipants'
import Files from '../js/components/qvain/files'
import IDAFilePicker, { IDAFilePickerBase } from '../js/components/qvain/files/idaFilePicker'
import FileSelector, { FileSelectorBase } from '../js/components/qvain/files/fileSelector'
import { SelectedFilesBase, FileItem } from '../js/components/qvain/files/selectedFiles'
import DirectoryForm from '../js/components/qvain/files/directoryForm'
import {
  ExternalEditFormBase,
  ResourceInput,
  ResourceSave
} from '../js/components/qvain/files/externalFileForm'
import {
  ExternalFilesBase,
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
import QvainStore, {
  Directory,
  EntityType,
  Role,
  Participant
} from '../js/stores/view/qvain'
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
    const component = mount(<SelectedParticipantBase Stores={getStores()} />)
    expect(component.find(ParticipantSelection).html().includes('Person')).toBe(true)
    component.unmount()
    const form = mount(<ParticipantTypeSelectBase Stores={getStores()} />)
    expect(form.find('#entityPerson input').props().checked).toBe(true)
  })

  // By default person should be selected. Upon clicking the Organization radio button
  // the checkboxes should be reset and active selection field should display
  // 'Organization'
  it('should change selected participant entity', () => {
    const stores = getStores()
    const entityRoleForm = mount(<ParticipantTypeSelectBase Stores={stores} />)
    entityRoleForm.find('#personCreator').first().simulate('change', {
      target: {
        checked: true
      }
    })
    entityRoleForm.unmount()
    const selectedParticipant = mount(<SelectedParticipantBase Stores={stores} />)
    expect(selectedParticipant.text()).toBe('Person / Creator')
    selectedParticipant.unmount()
    entityRoleForm.mount()
    entityRoleForm.find('#entityOrg input').simulate('change')
    entityRoleForm.find('#orgPublisher input').simulate('change', {
      target: {
        checked: true
      }
    })
    // expect(entityRoleForm.find('#entityOrg input').checked).toBe(true)
    entityRoleForm.unmount()
    selectedParticipant.mount()
    expect(selectedParticipant.text()).toBe('Organization / Publisher')
  })

  // Added participants should be listed if there are any
  it('should list all added participants', () => {
    const stores = getStores()
    const addedParticipants = mount(<AddedParticipantsBase Stores={stores} />)
    expect(addedParticipants.find(ButtonGroup).length).toBe(0)
    stores.Qvain.addParticipant(Participant(
      EntityType.ORGANIZATION,
      [Role.PUBLISHER],
      'University of Helsinki',
      'test@test.fi',
      'uohIdentifier'
    ))
    addedParticipants.update()
    expect(addedParticipants.find(ButtonGroup).length).toBe(1)
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
    const extFiles = shallow(<ExternalFilesBase Stores={getStores()} />)
    expect(extFiles.find(SlidingContent).length).toBe(1)
  })

  it('should add resources', async () => {
    const stores = getStores()
    const extFileForm = mount(<ExternalEditFormBase Stores={stores} />)
    const title = 'Test title'
    extFileForm.find('#titleInput').first().simulate('change', {
      target: {
        value: title
      }
    })
    const url = 'https://en.wikipedia.org'
    extFileForm.find('#urlInput').first().simulate('change', {
      target: {
        value: url
      }
    })
    // extFiles.find(ResourceSave).simulate('click')
    await extFileForm.instance().handleAddResource({
      preventDefault: () => console.log('handleAddResource preventDefault')
    })
    extFileForm.unmount()
    const extFiles = shallow(<ExternalFilesBase Stores={stores} />)
    expect(extFiles.find(ResourceItem).length).toBe(1)
    expect(extFiles.find(ButtonLabel).text()).toBe(`${title} / ${url}`)
  })
})
