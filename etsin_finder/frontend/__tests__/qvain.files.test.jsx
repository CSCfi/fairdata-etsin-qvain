import React from 'react'
import axios from 'axios'
import { shallow } from 'enzyme'

import { getDirectories, getFiles } from '../js/components/qvain/utils/fileHierarchy'
import QvainStore from '../js/stores/view/qvain'
import LocaleStore from '../js/stores/view/language'

import SelectedItemsTree from '../js/components/qvain/files/ida/selectedItemsTree'
import SelectedItemsTreeItem from '../js/components/qvain/files/ida/selectedItemsTreeItem'
import { ShowMore } from '../js/components/qvain/files/ida/common/tree'
import AddItemsTree from '../js/components/qvain/files/ida/addItemsTree'
import AddItemsTreeItem from '../js/components/qvain/files/ida/addItemsTreeItem'


import handleSubmitToBackend from '../js/components/qvain/utils/handleSubmit'

import { get } from './__testdata__/qvain.files.data'

jest.mock('axios')

// Mock responses a dataset containing IDA files. See the data file for the project structure.
axios.get.mockImplementation(get)

const stores = {
  Qvain: QvainStore,
  Locale: LocaleStore
}

const datasetIdentifier = '6d2cb5f5-4867-47f7-9874-09357f2901a3'

let root
const { Qvain } = stores
const { Files } = Qvain
const SelectedItemsTreeBase = SelectedItemsTree.wrappedComponent
const AddItemsTreeBase = AddItemsTree.wrappedComponent

const itemPaths = (items) => items.map(item => item.prop('item').path)

const delayGet = () => {
  // delay mock response once until respond() is called
  let respond
  const promise = new Promise((resolve) => {
    respond = resolve
  })

  axios.get.mockImplementationOnce(async (...args) => {
    await promise
    return get(...args)
  })
  return respond
}

beforeEach(async () => {
  Qvain.resetQvainStore()
  Qvain.setLegacyFilePicker(false)
  const response = await axios.get(`/api/dataset/edit/${datasetIdentifier}`)
  stores.Qvain.editDataset(response.data)
  await Files.loadingProject.promise
  expect(Files.loadingProject).toBe(null)

  root = Files.root
  expect(root).toEqual(expect.anything())
})


describe('Qvain.Files store', () => {
  it('loads directories only when requested', async () => {
    expect(root.directories[0].loaded).toBe(false)
    await Files.loadDirectory(root.directories[0])
    expect(root.directories[0].loaded).toBe(true)
    expect(root.directories[0].directories[0].loaded).toBe(false)
    await Files.loadDirectory(root.directories[0].directories[0])
    expect(root.directories[0].directories[0].loaded).toBe(true)
  })

  it('loads all directories', async () => {
    expect(root.directories[0].loaded).toBe(false)
    expect(root.directories[0].loaded).toBe(false)
    await Files.loadAllDirectories()
    expect(root.directories[0].loaded).toBe(true)
    expect(root.directories[0].loaded).toBe(true)
    expect(root.directories[0].directories[0].loaded).toBe(true)
    expect(root.directories[0].directories[1].loaded).toBe(true)
    expect(root.directories[0].directories[0].directories[0].loaded).toBe(true)
    expect(root.directories[0].directories[0].directories[1].loaded).toBe(true)
  })

  it('shows directory as loading while it is being fetched', async () => {
    const dir = root.directories[0]
    const respond = delayGet() // delay directory load
    axios.get.mockClear() // clear call counts

    expect(dir.loaded).toBe(false)
    expect(dir.loading).toBe(false)
    const promise = Files.loadDirectory(dir)
    expect(dir.loaded).toBe(false)
    expect(dir.loading).toBe(true)
    respond() // load directory

    await promise
    expect(dir.loaded).toBe(true)
    expect(dir.loading).toBe(false)

    // two axios calls are needed per directory load
    expect(axios.get.mock.calls.length).toBe(2)
  })

  it('loads directory only once even with multiple loadDirectory calls', async () => {
    const dir = root.directories[0]
    const respond = delayGet() // delay directory load
    axios.get.mockClear() // clear call counts

    let resolveCount = 0
    const promise = Files.loadDirectory(dir).then(() => { resolveCount += 1 })
    const promise2 = Files.loadDirectory(dir).then(() => { resolveCount += 1 })
    const promise3 = Files.loadDirectory(dir).then(() => { resolveCount += 1 })
    expect(resolveCount).toBe(0)
    respond() // load directory
    await Promise.all([promise, promise2, promise3])

    expect(resolveCount).toBe(3)
    expect(axios.get.mock.calls.length).toBe(2)
  })

  it('has correct file properties', async () => {
    await Files.loadAllDirectories()
    expect(root.directories[0].parent).toBe(root)

    expect(root).toMatchObject({
      selectedChildCount: 5,
      addedChildCount: 0,
      removedChildCount: 0,
      directories: { length: 2 },
      files: { length: 0 }
    })

    const moredata = root.directories[1]
    expect(moredata).toMatchObject({
      directoryName: 'moredata',
      selected: false,
      selectedChildCount: 2,
      files: { length: 2 },
      directories: { length: 0 },
    })

    const data = root.directories[0]
    expect(data).toMatchObject({
      directoryName: 'data',
      selected: false,
      fileCount: 13,
      // implicitly included parent in a dataset has 0 fileCount in Metax
      existingFileCount: 0,
      selectedChildCount: 3,
      files: { length: 0 },
      directories: { length: 2 }
    })

    const set1 = data.directories[0]
    expect(set1).toMatchObject({
      directoryName: 'set1',
      selected: true,
      fileCount: 10,
      existingFileCount: 6,
      selectedChildCount: 1,
      files: { length: 3 },
      directories: { length: 2 }
    })
    expect(set1.files.filter(f => f.existing).length).toBe(2)

    const set2 = data.directories[1]
    expect(set2).toMatchObject({
      directoryName: 'set2',
      selected: false,
      fileCount: 3,
      existingFileCount: 0, // implicitly included parent
      selectedChildCount: 1,
      files: { length: 3 },
      directories: { length: 0 }
    })
    expect(set2.files.filter(f => f.selected).length).toBe(1)
    expect(set2.files.filter(f => f.existing).length).toBe(1)

    const subset = set1.directories[0]
    expect(subset).toMatchObject({
      directoryName: 'subset',
      selected: false,
      selectedChildCount: 1,
      existingFileCount: 4,
      files: { length: 5 },
      directories: { length: 0 }
    })
    expect(subset.files.filter(f => f.selected).length).toBe(1)
    expect(subset.files.filter(f => f.existing).length).toBe(4)

    const subset2 = set1.directories[1]
    expect(subset2).toMatchObject({
      directoryName: 'subset2',
      selected: false,
      selectedChildCount: 0,
      existingFileCount: 0,
      files: { length: 2 },
      directories: { length: 0 }
    })
    expect(subset2.files.filter(f => f.selected).length).toBe(0)
    expect(subset2.files.filter(f => f.existing).length).toBe(0)
    expect(Qvain.changed).toBe(false)
  })

  it('gets files and directories by path', async () => {
    expect(await Files.getItemByPath('/')).toBe(root)
    expect((await Files.getItemByPath('/data')).directoryName).toBe('data')
    expect((await Files.getItemByPath('/data/set1/subset/file1.csv')).fileName).toBe('file1.csv')
    expect((await Files.getItemByPath('/data/set1/subset2/file2.csv')).fileName).toBe('file2.csv')
    expect((await Files.getItemByPath('/moredata/info.csv')).fileName).toBe('info.csv')
    expect(Qvain.changed).toBe(false)
  })

  it('has correct file metadata', async () => {
    const file = await Files.getItemByPath('/data/set1/subset/file1.csv')
    expect(file).toMatchObject({
      fileName: 'file1.csv',
      title: 'changed_title',
      description: 'Explicitly added file',
      useCategory: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/documentation',
      fileType: 'http://uri.suomi.fi/codelist/fairdata/file_type/code/text'
    })

    const newMeta = {
      title: 'another_title',
      description: 'New description',
      useCategory: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/test',
      fileType: 'http://uri.suomi.fi/codelist/fairdata/file_type/code/test'
    }

    Files.setInEdit(file)
    Files.applyInEdit(newMeta)
    expect(file).toMatchObject(newMeta)
    expect(Qvain.changed).toBe(true)
  })

  it('removes and adds existing selected files correctly', async () => {
    const file = await Files.getItemByPath('/data/set2/file1.csv') // existing and selected
    expect(file).toMatchObject({
      added: false,
      selected: true,
      removed: false,
    })
    expect(root).toMatchObject({
      selectedChildCount: 5,
      addedChildCount: 0,
      removedChildCount: 0
    })

    Files.removeItem(file) // should remove file
    expect(file).toMatchObject({
      added: false,
      selected: false,
      removed: true,
    })
    expect(root).toMatchObject({
      selectedChildCount: 4,
      addedChildCount: 0,
      removedChildCount: 1
    })

    Files.addItem(file) // adding file back should undo the remove
    expect(file).toMatchObject({
      added: false,
      selected: true,
      removed: false,
    })
    expect(root).toMatchObject({
      selectedChildCount: 5,
      addedChildCount: 0,
      removedChildCount: 0
    })

    expect(Qvain.changed).toBe(true)
  })

  it('adds and removes new files correctly', async () => {
    const file = await Files.getItemByPath('/data/set1/file1.csv') // existing but not selected
    Files.removeItem(file) // file is not added or selected, should not do anything
    expect(file).toMatchObject({
      added: false,
      selected: false,
      removed: false,
    })
    expect(root).toMatchObject({
      selectedChildCount: 5,
      addedChildCount: 0,
      removedChildCount: 0
    })

    Files.addItem(file) // file should be added
    expect(file).toMatchObject({
      added: true,
      selected: false,
      removed: false,
    })
    expect(root).toMatchObject({
      selectedChildCount: 5,
      addedChildCount: 1,
      removedChildCount: 0
    })

    Files.removeItem(file) // file should no longer be added
    expect(file).toMatchObject({
      added: false,
      selected: false,
      removed: false,
    })
    expect(root).toMatchObject({
      selectedChildCount: 5,
      addedChildCount: 0,
      removedChildCount: 0
    })

    expect(Qvain.changed).toBe(true)
  })
})

describe('Qvain.Files.DirectoryView', () => {
  it('opens files for a view', async () => {
    const data = await Files.getItemByPath('/data')
    const set1 = await Files.getItemByPath('/data/set1')
    const subset = await Files.getItemByPath('/data/set1/subset')

    const view = Files.SelectedItemsView
    expect(view.isOpen(root)).toBe(true) // root is always open
    expect(view.isOpen(data)).toBe(false)
    expect(view.isOpen(set1)).toBe(false)
    expect(view.isOpen(subset)).toBe(false)

    await Files.SelectedItemsView.setAllOpen(true) // open all
    expect(view.isOpen(root)).toBe(true)
    expect(view.isOpen(data)).toBe(true)
    expect(view.isOpen(set1)).toBe(true)
    expect(view.isOpen(subset)).toBe(true)

    const otherView = Files.AddItemsView // other view should be unaffected
    expect(otherView.isOpen(root)).toBe(true)
    expect(otherView.isOpen(data)).toBe(false)
    expect(otherView.isOpen(set1)).toBe(false)
    expect(otherView.isOpen(subset)).toBe(false)

    await Files.SelectedItemsView.setAllOpen(false) // close all
    expect(view.isOpen(root)).toBe(true)
    expect(view.isOpen(data)).toBe(false)
    expect(view.isOpen(set1)).toBe(false)
    expect(view.isOpen(subset)).toBe(false)

    expect(Qvain.changed).toBe(false)
  })

  it('checks and unchecks items', async () => {
    const data = await Files.getItemByPath('/data')
    const set1 = await Files.getItemByPath('/data/set1')
    const subset = await Files.getItemByPath('/data/set1/subset')
    const set2File1 = await Files.getItemByPath('/data/set2/file1.csv')

    const view = Files.AddItemsView
    view.toggleChecked(subset)
    view.toggleChecked(set2File1)
    expect(view.getTopmostChecked()).toEqual([subset, set2File1])

    view.toggleChecked(set1)
    expect(view.getTopmostChecked()).toEqual([set1, set2File1])

    view.toggleChecked(data)
    expect(view.getTopmostChecked()).toEqual([data])

    view.toggleChecked(data)
    expect(view.getTopmostChecked()).toEqual([set1, set2File1])

    expect(Qvain.changed).toBe(false)
  })
})

describe('Qvain.Files tree', () => {
  it('propagates parent selection', async () => {
    await Files.SelectedItemsView.setAllOpen(true)

    const wrapper = shallow(<SelectedItemsTreeBase Stores={stores} />).dive()
    let items = wrapper.find(SelectedItemsTreeItem)

    const data = await Files.getItemByPath('/data') // existing but not selected
    const dataItem = items.findWhere(item => item.prop('item') === data)
    expect(dataItem.prop('parentArgs')).toMatchObject({
      parentChecked: false,
      parentAdded: false,
      parentSelected: false,
    })

    const set1 = await Files.getItemByPath('/data/set1') // selected
    const set1Item = items.findWhere(item => item.prop('item') === set1)
    expect(set1Item.prop('parentArgs')).toMatchObject({
      parentChecked: false,
      parentAdded: false,
      parentSelected: false,
    })

    const subset = await Files.getItemByPath('/data/set1/subset') // parent selected
    let subsetItem = items.findWhere(item => item.prop('item') === subset)
    expect(subsetItem.prop('parentArgs')).toMatchObject({
      parentChecked: false,
      parentAdded: false,
      parentSelected: true,
    })

    const subsetFile1 = await Files.getItemByPath('/data/set1/subset/file1.csv') // grandparent selected
    let subsetFile1Item = items.findWhere(item => item.prop('item') === subsetFile1)
    expect(subsetFile1Item.prop('parentArgs')).toMatchObject({
      parentChecked: false,
      parentAdded: false,
      parentSelected: true,
    })

    // remove set1, now subitems should no longer have parentSelected
    Files.removeItem(set1)
    items = wrapper.find(SelectedItemsTreeItem)
    subsetItem = items.findWhere(item => item.prop('item') === subset)
    expect(subsetItem.prop('parentArgs')).toMatchObject({
      parentChecked: false,
      parentAdded: false,
      parentSelected: false
    })

    subsetFile1Item = items.findWhere(item => item.prop('item') === subsetFile1)
    expect(subsetFile1Item.prop('parentArgs')).toMatchObject({
      parentChecked: false,
      parentAdded: false,
      parentSelected: false
    })

    // bring set1 back
    Files.addItem(set1)
    items = wrapper.find(SelectedItemsTreeItem)
    subsetItem = items.findWhere(item => item.prop('item') === subset)
    expect(subsetItem.prop('parentArgs')).toMatchObject({
      parentChecked: false,
      parentAdded: false,
      parentSelected: true
    })

    subsetFile1Item = items.findWhere(item => item.prop('item') === subsetFile1)
    expect(subsetFile1Item.prop('parentArgs')).toMatchObject({
      parentChecked: false,
      parentAdded: false,
      parentSelected: true
    })
  })

  it('propagates parent addition', async () => {
    await Files.SelectedItemsView.setAllOpen(true)

    const wrapper = shallow(<SelectedItemsTreeBase Stores={stores} />).dive()

    const data = await Files.getItemByPath('/data')
    const subset = await Files.getItemByPath('/data/set1/subset')
    const subsetFile1 = await Files.getItemByPath('/data/set1/subset/file1.csv')

    Files.addItem(data) // add data (already exists but is not selected)
    expect(data.added).toBe(true)
    let items = wrapper.find(SelectedItemsTreeItem)
    let subsetItem = items.findWhere(item => item.prop('item') === subset)
    expect(subsetItem.prop('parentArgs')).toMatchObject({
      parentChecked: false,
      parentAdded: true,
      parentSelected: true
    })

    let subsetFile1Item = items.findWhere(item => item.prop('item') === subsetFile1)
    expect(subsetFile1Item.prop('parentArgs')).toMatchObject({
      parentChecked: false,
      parentAdded: true,
      parentSelected: true
    })

    // remove subset
    Files.removeItem(data)
    items = wrapper.find(SelectedItemsTreeItem)
    subsetItem = items.findWhere(item => item.prop('item') === subset)
    expect(subsetItem.prop('parentArgs')).toMatchObject({
      parentChecked: false,
      parentAdded: false,
      parentSelected: true
    })

    subsetFile1Item = items.findWhere(item => item.prop('item') === subsetFile1)
    expect(subsetFile1Item.prop('parentArgs')).toMatchObject({
      parentChecked: false,
      parentAdded: false,
      parentSelected: true
    })
  })

  it('propagates parent check', async () => {
    await Files.SelectedItemsView.setAllOpen(true)

    const wrapper = shallow(<SelectedItemsTreeBase Stores={stores} />).dive()

    const data = await Files.getItemByPath('/data')
    const subset = await Files.getItemByPath('/data/set1/subset')
    const subsetFile1 = await Files.getItemByPath('/data/set1/subset/file1.csv')

    Files.SelectedItemsView.toggleChecked(data) // check data
    expect(Files.SelectedItemsView.isChecked(data)).toBe(true)
    let items = wrapper.find(SelectedItemsTreeItem)
    let subsetItem = items.findWhere(item => item.prop('item') === subset)
    expect(subsetItem.prop('parentArgs')).toMatchObject({
      parentChecked: true,
      parentAdded: false,
      parentSelected: true
    })

    let subsetFile1Item = items.findWhere(item => item.prop('item') === subsetFile1)
    expect(subsetFile1Item.prop('parentArgs')).toMatchObject({
      parentChecked: true,
      parentAdded: false,
      parentSelected: true
    })

    Files.SelectedItemsView.toggleChecked(data) // uncheck data
    expect(Files.SelectedItemsView.isChecked(data)).toBe(false)
    items = wrapper.find(SelectedItemsTreeItem)
    subsetItem = items.findWhere(item => item.prop('item') === subset)
    expect(subsetItem.prop('parentArgs')).toMatchObject({
      parentChecked: false,
      parentAdded: false,
      parentSelected: true
    })

    subsetFile1Item = items.findWhere(item => item.prop('item') === subsetFile1)
    expect(subsetFile1Item.prop('parentArgs')).toMatchObject({
      parentChecked: false,
      parentAdded: false,
      parentSelected: true
    })
  })

  it('shows subitems for open directories', async () => {
    await Files.loadAllDirectories()

    const wrapper = shallow(<SelectedItemsTreeBase Stores={stores} />).dive()
    const view = Files.SelectedItemsView

    let items = wrapper.find(SelectedItemsTreeItem)
    const data = await Files.getItemByPath('/data')
    const set1 = await Files.getItemByPath('/data/set1')

    expect(items.filter('[level=0]').length).toBe(2)

    await view.open(data)
    expect(view.isOpen(data)).toBe(true)
    items = wrapper.find(SelectedItemsTreeItem)

    expect(items.filter('[level=0]').length).toBe(2)
    expect(items.filter('[level=1]').length).toBe(2)

    await view.open(set1)
    items = wrapper.find(SelectedItemsTreeItem)
    expect(items.filter('[level=0]').length).toBe(2)
    expect(items.filter('[level=1]').length).toBe(2)
    expect(items.filter('[level=2]').length).toBe(3)

    view.close(data)
    items = wrapper.find(SelectedItemsTreeItem)
    expect(items.filter('[level=0]').length).toBe(2)
    expect(items.filter(':not([level=0])').length).toBe(0)
  })

  it('limits how many items are visible in a folder', async () => {
    const view = Files.SelectedItemsView
    await view.setAllOpen(true)
    view.setShowLimit(3, 0)

    const wrapper = shallow(<SelectedItemsTreeBase Stores={stores} />).dive()

    const subset = await Files.getItemByPath('/data/set1/subset')
    let items = wrapper.find(SelectedItemsTreeItem)
    expect(items.filter('[level=3]').length).toBe(3)
    expect(wrapper.find(ShowMore).prop('count')).toBe(1)

    view.toggleShowAll(subset)
    items = wrapper.find(SelectedItemsTreeItem)
    expect(items.filter('[level=3]').length).toBe(4)
  })

  it('does not limit how many items are shown unless limit+margin is exceeded', async () => {
    const view = Files.SelectedItemsView
    await view.setAllOpen(true)
    view.setShowLimit(2, 2)

    const wrapper = shallow(<SelectedItemsTreeBase Stores={stores} />).dive()
    let items = wrapper.find(SelectedItemsTreeItem)
    expect(items.filter('[level=3]').length).toBe(4)

    view.setShowLimit(2, 1)
    items = wrapper.find(SelectedItemsTreeItem)
    expect(items.filter('[level=3]').length).toBe(2)
  })
})


describe('Qvain.Files AddItemsTree ', () => {
  it('shows items that are unadded/unselected or have unadded children ', async () => {
    await Files.AddItemsView.setAllOpen(true)

    const wrapper = shallow(<AddItemsTreeBase Stores={stores} />).dive()
    const items = wrapper.find(AddItemsTreeItem)

    expect(itemPaths(items.filter('[level=0]'))).toEqual([
      '/data',
      '/moredata',
    ])

    expect(itemPaths(items.filter('[level=1]'))).toEqual([
      '/data/set1',
      '/data/set2',
    ])

    expect(itemPaths(items.filter('[level=2]'))).toEqual([
      '/data/set1/subset',
      '/data/set1/subset2',
      '/data/set1/file4.csv',
      '/data/set2/file2.csv',
      '/data/set2/file3.csv',
    ])

    expect(itemPaths(items.filter('[level=3]'))).toEqual([
      '/data/set1/subset/file13.csv',
      '/data/set1/subset2/file1.csv',
      '/data/set1/subset2/file2.csv',
    ])
  })
})

describe('Qvain.Files SelectedItemsTree ', () => {
  it('shows selected and existing items', async () => {
    await Files.SelectedItemsView.setAllOpen(true)

    const wrapper = shallow(<SelectedItemsTreeBase Stores={stores} />).dive()
    const items = wrapper.find(SelectedItemsTreeItem)

    expect(itemPaths(items.filter('[level=0]'))).toEqual([
      '/data',
      '/moredata',
    ])

    expect(itemPaths(items.filter('[level=1]'))).toEqual([
      '/data/set1',
      '/data/set2',
      '/moredata/info.csv',
      '/moredata/stuff.csv'
    ])

    expect(itemPaths(items.filter('[level=2]'))).toEqual([
      '/data/set1/subset',
      '/data/set1/file1.csv',
      '/data/set1/file2.csv',
      '/data/set2/file1.csv',
    ])

    expect(itemPaths(items.filter('[level=3]'))).toEqual([
      '/data/set1/subset/file1.csv',
      '/data/set1/subset/file10.csv',
      '/data/set1/subset/file11.csv',
      '/data/set1/subset/file12.csv',
    ])
  })

  it('also shows added items', async () => {
    await Files.SelectedItemsView.setAllOpen(true)

    const wrapper = shallow(<SelectedItemsTreeBase Stores={stores} />).dive()
    const items = wrapper.find(SelectedItemsTreeItem)

    expect(itemPaths(items.filter('[level=0]'))).toEqual([
      '/data',
      '/moredata',
    ])

    expect(itemPaths(items.filter('[level=1]'))).toEqual([
      '/data/set1',
      '/data/set2',
      '/moredata/info.csv',
      '/moredata/stuff.csv'
    ])

    expect(itemPaths(items.filter('[level=2]'))).toEqual([
      '/data/set1/subset',
      '/data/set1/file1.csv',
      '/data/set1/file2.csv',
      '/data/set2/file1.csv',
    ])

    expect(itemPaths(items.filter('[level=3]'))).toEqual([
      '/data/set1/subset/file1.csv',
      '/data/set1/subset/file10.csv',
      '/data/set1/subset/file11.csv',
      '/data/set1/subset/file12.csv',
    ])
  })
})


describe('Qvain.Files AddItemsTree ', () => {
  it('shows items that are unadded/unselected or have unadded children ', async () => {
    await Files.AddItemsView.setAllOpen(true)

    const wrapper = shallow(<AddItemsTreeBase Stores={stores} />).dive()
    const items = wrapper.find(AddItemsTreeItem)

    expect(itemPaths(items.filter('[level=0]'))).toEqual([
      '/data',
      '/moredata',
    ])

    expect(itemPaths(items.filter('[level=1]'))).toEqual([
      '/data/set1',
      '/data/set2',
    ])

    expect(itemPaths(items.filter('[level=2]'))).toEqual([
      '/data/set1/subset',
      '/data/set1/subset2',
      '/data/set1/file4.csv',
      '/data/set2/file2.csv',
      '/data/set2/file3.csv',
    ])

    expect(itemPaths(items.filter('[level=3]'))).toEqual([
      '/data/set1/subset/file13.csv',
      '/data/set1/subset2/file1.csv',
      '/data/set1/subset2/file2.csv',
    ])
  })
})

describe('Qvain.Files handleSubmit', () => {
  it('submits data correctly', async () => {
    const dataset = handleSubmitToBackend(Qvain)
    expect(dataset).toMatchSnapshot()
  })

  it('submits data correctly after adding directory', async () => {
    const set2 = await Files.getItemByPath('/data/set2')
    Files.addItem(set2)
    const dataset = handleSubmitToBackend(Qvain)
    expect(dataset).toMatchSnapshot()
  })


  it('submits data correctly after adding file', async () => {
    const file2 = await Files.getItemByPath('/data/set2/file2.csv')
    Files.addItem(file2)
    const dataset = handleSubmitToBackend(Qvain)
    expect(dataset).toMatchSnapshot()
  })

  it('submits data correctly after removing directory', async () => {
    const set1 = await Files.getItemByPath('/data/set1')
    Files.removeItem(set1)
    const dataset = handleSubmitToBackend(Qvain)
    expect(dataset).toMatchSnapshot()
  })

  it('submits data correctly after removing file', async () => {
    const info = await Files.getItemByPath('/moredata/info.csv')
    Files.removeItem(info)
    const dataset = handleSubmitToBackend(Qvain)
    expect(dataset).toMatchSnapshot()
  })

  const loadLegacyDirectory = async (dir, parent) => {
    const legacyDir = getDirectories(Qvain.hierarchy).find(d => d.identifier === dir.identifier)
    await new Promise(resolve => Qvain.loadDirectory(legacyDir.id, parent, resolve))
    return getDirectories(Qvain.hierarchy).find(d => d.identifier === dir.identifier)
  }

  it('returns the same data for both file picker versions', async () => {
    const data = handleSubmitToBackend(Qvain)
    Qvain.setLegacyFilePicker(true)
    const legacyData = handleSubmitToBackend(Qvain)
    expect(data).toEqual(legacyData)
  })

  it('adds directory the same way for both file picker versions', async () => {
    const data = await Files.getItemByPath('/data')
    const set2 = await Files.getItemByPath('/data/set2')
    Files.addItem(set2)
    const dataset = handleSubmitToBackend(Qvain)

    Qvain.setLegacyFilePicker(true)
    await loadLegacyDirectory(data, Qvain.hierarchy)

    const legacySet2 = getDirectories(Qvain.hierarchy).find(d => d.identifier === set2.identifier)
    Qvain.toggleSelectedDirectory(legacySet2, true)
    const legacyDataset = handleSubmitToBackend(Qvain)
    expect(dataset.directories).toEqual(expect.arrayContaining(legacyDataset.directories))
  })

  it('adds file the same way for both file picker versions', async () => {
    const data = await Files.getItemByPath('/data')
    const set2 = await Files.getItemByPath('/data/set2')
    const file2 = await Files.getItemByPath('/data/set2/file2.csv')
    Files.addItem(file2)
    const dataset = handleSubmitToBackend(Qvain)

    Qvain.setLegacyFilePicker(true)
    const legacyData = await loadLegacyDirectory(data, Qvain.hierarchy)
    await loadLegacyDirectory(set2, legacyData)
    const legacyFile2 = getFiles(Qvain.hierarchy).find(f => f.identifier === file2.identifier)
    Qvain.toggleSelectedFile(legacyFile2, true)
    const legacyDataset = handleSubmitToBackend(Qvain)
    expect(dataset.files).toEqual(expect.arrayContaining(legacyDataset.files))
  })

  it('removes directory the same way for both file picker versions', async () => {
    const set1 = await Files.getItemByPath('/data/set1')
    Files.removeItem(set1)
    const dataset = handleSubmitToBackend(Qvain)

    Qvain.setLegacyFilePicker(true)
    const legacySet1 = Qvain.existingDirectories.find(d => d.identifier === set1.identifier)
    Qvain.toggleSelectedDirectory(legacySet1, false)
    const legacyDataset = handleSubmitToBackend(Qvain)
    expect(dataset).toEqual(legacyDataset)
  })

  it('removes file the same way for both file picker versions', async () => {
    const info = await Files.getItemByPath('/moredata/info.csv')
    Files.removeItem(info)
    const dataset = handleSubmitToBackend(Qvain)

    Qvain.setLegacyFilePicker(true)
    const legacyInfo = Qvain.existingFiles.find(d => d.identifier === info.identifier)
    Qvain.toggleSelectedFile(legacyInfo, false)
    const legacyDataset = handleSubmitToBackend(Qvain)
    expect(dataset).toEqual(legacyDataset)
  })
})
