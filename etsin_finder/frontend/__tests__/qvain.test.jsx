import React from 'react';
import { shallow, mount } from 'enzyme'

import Qvain from '../js/components/qvain'
import Description from '../js/components/qvain/description'
import DescriptionFeild from '../js/components/qvain/description/descriptionField'
import OtherIdentifierField from '../js/components/qvain/description/otherIdentifierField'
import FieldOfScienceField from '../js/components/qvain/description/fieldOfScienceField'
import KeywordsField from '../js/components/qvain/description/keywordsField'
import RightsAndLicenses from '../js/components/qvain/licenses'
import { License } from '../js/components/qvain/licenses/licenses'
import { AccessType } from '../js/components/qvain/licenses/accessType'
import RestrictionGrounds from '../js/components/qvain/licenses/resctrictionGrounds'
import EmbargoExpires from '../js/components/qvain/licenses/embargoExpires'
import { AccessTypeURLs, LicenseUrls } from '../js/components/qvain/utils/constants'
import {
  ParticipantsBase
} from '../js/components/qvain/participants'
import { ParticipantTypeSelectBase } from '../js/components/qvain/participants/participantTypeSelect'
import { SelectedParticipantBase, ParticipantSelection } from '../js/components/qvain/participants/participantSelection'
import { AddedParticipantsBase } from '../js/components/qvain/participants/addedParticipants'
import Files from '../js/components/qvain/files'
import IDAFilePicker, { IDAFilePickerBase } from '../js/components/qvain/files/idaFilePicker'
import FileSelector, { FileSelectorBase } from '../js/components/qvain/files/fileSelector'
import { SelectedFilesBase } from '../js/components/qvain/files/selectedFiles'
import { ExternalFilesBase } from '../js/components/qvain/files/externalFiles'
import {
  ButtonGroup,
  ButtonLabel,
  DeleteButton
} from '../js/components/qvain/general/buttons'
import { SlidingContent } from '../js/components/qvain/general/card'
import QvainStore, {
  Directory,
  EntityType,
  Role,
  Participant,
  ExternalResource,
  AccessType as AccessTypeConstructor,
  License as LicenseConstructor
} from '../js/stores/view/qvain'
import LocaleStore from '../js/stores/view/language'
import { DataCatalogIdentifiers } from '../js/components/qvain/utils/constants'

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

describe('Qvain.Description', () => {
  it('should render <Description />', () => {
    const component = shallow(<Description Stores={getStores()} />)
    expect(component).toMatchSnapshot()
  })
  it('should render <DescriptionFeild />', () => {
    const component = shallow(<DescriptionFeild Stores={getStores()}/>)
    expect(component).toMatchSnapshot()
  })
  it('should render <OtherIdentifierField />', () => {
    const component = shallow(<OtherIdentifierField Stores={getStores()}/>)
    expect(component).toMatchSnapshot()
  })
  it('should render <FieldOfScienceField />', () => {
    const component = shallow(<FieldOfScienceField Stores={getStores()}/>)
    expect(component).toMatchSnapshot()
  })
  it('should render <KeywordsField />', () => {
    const component = shallow(<KeywordsField Stores={getStores()}/>)
    expect(component).toMatchSnapshot()
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
    stores.Qvain.setLicense(LicenseConstructor({en: 'Other (URL)', fi: 'Muu (URL)',},'other'))
    const component = shallow(<License Stores={stores} />)
    console.log(component.debug())
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
    stores.Qvain.saveParticipant(Participant(
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
    const store = getStores()
    store.Qvain.dataCatalog = DataCatalogIdentifiers.IDA
    store.Qvain.idaPickerOpen = true
    const component = shallow(<Files Stores={store} />)
    expect(component.dive().find(IDAFilePicker).length).toBe(1)
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
    const externalFiles = shallow(<ExternalFilesBase Stores={getStores()} />)
    expect(externalFiles.find(SlidingContent).length).toBe(1)
  })

  // External resources should be listed if there are any
  it('should list all added resources', () => {
    const stores = getStores()
    const externalFiles = shallow(<ExternalFilesBase Stores={stores} />)
    expect(externalFiles.find(ButtonGroup).length).toBe(0)
    stores.Qvain.saveExternalResource(ExternalResource(
      1,
      'External Resource Title',
      'http://en.wikipedia.org'
    ))
    externalFiles.update()
    expect(externalFiles.find(ButtonGroup).length).toBe(1)
  })
})
