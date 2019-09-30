import React from 'react';
import { shallow, mount } from 'enzyme'

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
import {
  ActorsBase
} from '../js/components/qvain/actors'
import { ActorTypeSelectBase } from '../js/components/qvain/actors/actorTypeSelect'
import { SelectedActorBase, ActorSelection } from '../js/components/qvain/actors/actorSelection'
import { AddedActorsBase } from '../js/components/qvain/actors/addedActors'
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
  Actor,
  ExternalResource,
  AccessType as AccessTypeConstructor,
  License as LicenseConstructor
} from '../js/stores/view/qvain'
import LocaleStore from '../js/stores/view/language'
import { DataCatalogIdentifiers, EntityType, Role, } from '../js/components/qvain/utils/constants'
import { RadioInput } from '../js/components/qvain/general/form';
import { ListItem } from '../js/components/qvain/general/list';

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
  it('should render <DescriptionField />', () => {
    const component = shallow(<DescriptionField Stores={getStores()}/>)
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

describe('Qvain.Actors', () => {
  it('should render correctly', () => {
    const component = shallow(<ActorsBase Stores={getStores()} />)
    expect(component).toMatchSnapshot()
  })

  it('should render person selection by default', () => {
    const component = mount(<SelectedActorBase Stores={getStores()} />)
    expect(component.find(ActorSelection).html().includes('Person')).toBe(true)
    component.unmount()
    const form = mount(<ActorTypeSelectBase Stores={getStores()} />)
    expect(form.find('#entityPerson input').props().checked).toBe(true)
  })

  // By default person should be selected. Upon clicking the Organization radio button
  // the checkboxes should be reset and active selection field should display
  // 'Organization'
  it('should change selected actor entity', () => {
    const stores = getStores()
    const entityRoleForm = mount(<ActorTypeSelectBase Stores={stores} />)
    entityRoleForm.find('#personCreator').first().simulate('change', {
      target: {
        checked: true
      }
    })
    entityRoleForm.unmount()
    const selectedActor = mount(<SelectedActorBase Stores={stores} />)
    expect(selectedActor.text()).toBe('Person / Creator')
    selectedActor.unmount()
    entityRoleForm.mount()
    entityRoleForm.find('#entityOrg input').simulate('change')
    entityRoleForm.find('#orgPublisher input').simulate('change', {
      target: {
        checked: true
      }
    })
    // expect(entityRoleForm.find('#entityOrg input').checked).toBe(true)
    entityRoleForm.unmount()
    selectedActor.mount()
    expect(selectedActor.text()).toBe('Organization / Publisher')
  })

  // Added actors should be listed if there are any
  it('should list all added actors', () => {
    const stores = getStores()
    const addedActors = mount(<AddedActorsBase Stores={stores} />)
    expect(addedActors.find(ButtonGroup).length).toBe(0)
    stores.Qvain.saveActor(Actor(
      EntityType.ORGANIZATION,
      [Role.PUBLISHER],
      'University of Helsinki',
      'test@test.fi',
      'uohIdentifier'
    ))
    stores.Qvain.saveActor(Actor(
      EntityType.PERSON,
      [Role.CREATOR],
      'Teppo Testaaja',
      'test@test.fi',
      'uohIdentifier'
    ))
    stores.Qvain.saveActor(Actor(
      EntityType.PERSON,
      [Role.RIGHTS_HOLDER],
      'Tuppo Testaaja',
      'test@test.fi',
      'uohIdentifier'
    ))
    stores.Qvain.saveActor(Actor(
      EntityType.PERSON,
      [Role.CONTRIBUTOR],
      'Toppo Testaaja',
      'test@test.fi',
      'uohIdentifier'
    ))
    addedActors.update()
    expect(addedActors.find(ButtonGroup).length).toBe(4)
  })

  // Test that <ActorTypeSelectBase> renders correctly
  const component = shallow(<ActorTypeSelectBase Stores={getStores()} />)
  it('ActorTypeSelect contains two <Column> elements', () => {
    expect(component.find('Column').length).toBe(2);
  })

  it('ActorTypeSelect contains two <RadioInput> elements', () => {
    expect(component.find(RadioInput).length).toBe(2);
  })

  it('ActorTypeSelect contains two <RadioInput> elements for Person and Org', () => {
    expect(component.find(RadioInput).length).toBe(2);
    expect(component.find('#entityPerson').length).toBe(1);
    expect(component.find('#entityOrg').length).toBe(1);
  })

  it('ActorTypeSelect contains 10 <ListItem> elements with right ids', () => {
    expect(component.find(ListItem).length).toBe(10);
    expect(component.find('#personCreator').length).toBe(1);
    expect(component.find('#personPublisher').length).toBe(1);
    expect(component.find('#personCurator').length).toBe(1);
    expect(component.find('#personRightsHolder').length).toBe(1);
    expect(component.find('#personContributor').length).toBe(1);
    expect(component.find('#orgCreator').length).toBe(1);
    expect(component.find('#orgPublisher').length).toBe(1);
    expect(component.find('#orgCurator').length).toBe(1);
    expect(component.find('#orgRightsHolder').length).toBe(1);
    expect(component.find('#orgContributor').length).toBe(1);
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
