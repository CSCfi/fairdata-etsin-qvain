import React from 'react'
import axios from 'axios'
import { shallow } from 'enzyme'

import Env from '../../../js/stores/domain/env'
import QvainStoreClass from '../../../js/stores/view/qvain'
import LocaleStore from '../../../js/stores/view/locale'
import { sortFunc } from '../../../js/stores/view/common.files.utils'
import {
  itemLoaderNew,
  itemLoaderAny,
  itemLoaderExisting,
} from '../../../js/stores/view/common.files.loaders'
import urls from '../../../js/components/qvain/utils/urls'

import { ShowMore } from '../../../js/components/general/files/tree'
import SelectedItemsTree from '../../../js/components/qvain/fields/files/ida/selectedItemsTree'
import SelectedItemsTreeItem from '../../../js/components/qvain/fields/files/ida/selectedItemsTreeItem'
import AddItemsTree from '../../../js/components/qvain/fields/files/ida/addItemsTree'
import AddItemsTreeItem from '../../../js/components/qvain/fields/files/ida/addItemsTreeItem'

import handleSubmitToBackend from '../../../js/components/qvain/utils/handleSubmit'

import { get } from '../../__testdata__/qvain.files.data'
import { StoresProvider, useStores } from '../../../js/stores/stores'

global.Promise = require('bluebird')

Promise.config({
  cancellation: true,
})

jest.mock('axios')

jest.mock('../../../js/stores/stores', () => {
  const useStores = jest.fn()

  return {
    ...jest.requireActual('../../../js/stores/stores'),
    useStores,
  }
})

const flatten = dir => {
  const flatItems = []
  const recurse = dir => {
    dir.directories.forEach(dir => {
      flatItems.push(dir)
      recurse(dir)
    })
    dir.files.forEach(file => {
      flatItems.push(file)
    })
  }
  recurse(dir)
  return flatItems
}

const sorted = items => {
  const copy = [...items]
  copy.sort((a, b) => {
    // show files last
    if (a.type === 'file' && b.type !== 'file') {
      return 1
    }
    if (a.type !== 'file' && b.type === 'file') {
      return -1
    }
    return sortFunc(a.name, b.name)
  })
  return copy
}

// Mock responses for a dataset containing IDA files. See the data file for the project structure.
axios.get.mockImplementation(get)

const QvainStore = new QvainStoreClass(Env)
const stores = {
  Env,
  Qvain: QvainStore,
  Locale: LocaleStore,
}

const datasetIdentifier = '6d2cb5f5-4867-47f7-9874-09357f2901a3'
const emptyDatasetIdentifier = '6d2cb5f5-4867-47f7-9874-123456789'

let root
const { Qvain } = stores
const { Files } = Qvain

const itemPaths = items => items.map(item => item.prop('item').path).sort(sortFunc)
expect.extend({
  toBeFullyLoaded(dir) {
    if (!dir) {
      return {
        message: () => 'missing directory',
        pass: this.isNot,
      }
    }
    if (dir.directChildCount === null) {
      return {
        message: () => 'expected directory to have been loaded',
        pass: false,
      }
    }
    const items = [...dir.directories, ...dir.files]
    const loadedCount = items.filter(v => v).length
    if (loadedCount === dir.directChildCount) {
      return {
        message: () => 'expected directory not to have been fully loaded',
        pass: true,
      }
    } else {
      return {
        message: () =>
          `expected all items in directory to have been loaded, ${loadedCount} < ${dir.directChildCount}`,
        pass: false,
      }
    }
  },
})

const delayGet = () => {
  // delay mock response once until respond() is called
  let respond
  const promise = new Promise(resolve => {
    respond = resolve
  })

  axios.get.mockImplementationOnce(async (...args) => {
    await promise
    return get(...args)
  })
  return respond
}

const loadDataset = async () => {
  let response
  if (Env.metaxApiV2) {
    response = await axios.get(urls.v2.dataset(datasetIdentifier))
  } else {
    response = await axios.get(urls.v1.dataset(datasetIdentifier))
  }
  Qvain.Files.AddItemsView.setDefaultShowLimit(20, 20)
  Qvain.Files.SelectedItemsView.setDefaultShowLimit(20, 20)
  const promise = stores.Qvain.editDataset(response.data)
  Files.SelectedItemsView.setHideRemoved(true)
  await promise
  expect(Files.loadingProjectInfo).not.toBe(null)
  expect(Files.loadingMetadata).not.toBe(null)
  expect(Files.loadingProjectRoot).not.toBe(null)
  expect(Files.loadingProjectInfo.error).toBe(null)
  expect(Files.loadingMetadata.error).toBe(null)
  expect(Files.loadingProjectRoot.error).toBe(null)

  root = Files.root
  expect(root).toEqual(expect.anything())
}

beforeEach(async () => {
  Qvain.resetQvainStore()
  Env.Flags.setFlag('METAX_API_V2', true)
  await loadDataset()
})

describe('Qvain.Files store', () => {
  it('loads directories only when requested', async () => {
    const data = root.directories.find(d => d.name === 'data')
    expect(data).not.toBeFullyLoaded()
    await Files.loadDirectory(data)
    expect(data).toBeFullyLoaded()

    const set1 = data.directories.find(d => d.name === 'set1')
    expect(set1).not.toBeFullyLoaded()
    await Files.loadDirectory(set1)
    expect(set1).toBeFullyLoaded()
  })

  it('loads all directories', async () => {
    const data = root.directories.find(d => d.name === 'data')
    expect(data).not.toBeFullyLoaded()
    await Files.loadAllDirectories()
    expect(data).toBeFullyLoaded()

    const set1 = data.directories.find(d => d.name === 'set1')
    const set2 = data.directories.find(d => d.name === 'set2')
    expect(set1).toBeFullyLoaded()
    expect(set2).toBeFullyLoaded()

    const subset1 = set1.directories.find(d => d.name === 'subset')
    const subset2 = set1.directories.find(d => d.name === 'subset2')
    expect(subset1).toBeFullyLoaded()
    expect(subset2).toBeFullyLoaded()
  })

  it('shows directory as loading while it is being fetched', async () => {
    const dir = root.directories.find(d => d.name === 'data')
    const respond = delayGet() // delay directory load
    axios.get.mockClear() // clear call counts

    expect(dir).not.toBeFullyLoaded()
    expect(dir.loading).toBe(false)
    const promise = Files.loadDirectory(dir)
    expect(dir).not.toBeFullyLoaded(false)
    expect(dir.loading).toBe(true)
    respond() // load directory

    await promise
    expect(dir).toBeFullyLoaded(true)
    expect(dir.loading).toBe(false)

    // three axios calls are needed per directory load
    // - file counts, sorting order for items in directory
    // - file counts for existing subdirectories
    // - paginated items
    expect(axios.get.mock.calls.length).toBe(3)
  })

  it('loads directory only once even with multiple loadDirectory calls', async () => {
    const dir = root.directories.find(d => d.name === 'data')
    const respond = delayGet() // delay directory load
    axios.get.mockClear() // clear call counts

    let resolveCount = 0
    const promise = Files.loadDirectory(dir).then(() => {
      resolveCount += 1
    })
    const promise2 = Files.loadDirectory(dir).then(() => {
      resolveCount += 1
    })
    const promise3 = Files.loadDirectory(dir).then(() => {
      resolveCount += 1
    })
    expect(resolveCount).toBe(0)
    respond() // load directory
    await Promise.all([promise, promise2, promise3])

    expect(resolveCount).toBe(3)
    expect(axios.get.mock.calls.length).toBe(3)
  })

  it('cancels promises when dataset is reset', async () => {
    const dir = root.directories.find(d => d.name === 'data')

    Files.loadDirectory(dir)
    Files.loadDirectory(dir)
    Files.loadDirectory(dir)
    Files.loadDirectory(dir)
    expect(Qvain.Files.promiseManager.promises.length > 0).toBe(true)
    Qvain.Files.reset()
    expect(Qvain.Files.promiseManager.promises.length).toBe(0)
  })

  it('has correct file properties', async () => {
    await Files.loadAllDirectories()
    expect(root.directories[0].parent).toBe(root)

    expect(root).toMatchObject({
      addedChildCount: 0,
      removedChildCount: 0,
      directories: { length: 2 },
      files: { length: 0 },
    })

    const moredata = root.directories.find(d => d.name === 'moredata')
    expect(moredata).toMatchObject({
      name: 'moredata',
      files: { length: 2 },
      directories: { length: 0 },
    })

    const data = root.directories.find(d => d.name === 'data')
    expect(data).toMatchObject({
      name: 'data',
      fileCount: 13,
      existingFileCount: 7,
      files: { length: 0 },
      directories: { length: 2 },
    })

    const set1 = data.directories.find(d => d.name === 'set1')
    expect(set1).toMatchObject({
      name: 'set1',
      fileCount: 10,
      existingFileCount: 6,
      files: { length: 3 },
      directories: { length: 2 },
    })
    expect(set1.files.filter(f => f.existing).length).toBe(2)

    const set2 = data.directories.find(d => d.name === 'set2')
    expect(set2).toMatchObject({
      name: 'set2',
      fileCount: 3,
      existingFileCount: 1,
      files: { length: 3 },
      directories: { length: 0 },
    })
    expect(set2.files.filter(f => f.existing).length).toBe(1)

    const subset = set1.directories.find(d => d.name === 'subset')
    expect(subset).toMatchObject({
      name: 'subset',
      existingFileCount: 4,
      files: { length: 5 },
      directories: { length: 0 },
    })
    expect(subset.files.filter(f => f.existing).length).toBe(4)

    const subset2 = set1.directories.find(d => d.name === 'subset2')
    expect(subset2).toMatchObject({
      name: 'subset2',
      existingFileCount: 0,
      files: { length: 2 },
      directories: { length: 0 },
    })
    expect(subset2.files.filter(f => f.existing).length).toBe(0)
    expect(Qvain.changed).toBe(false)
  })

  it('gets files and directories by path', async () => {
    expect(await Files.getItemByPath('/')).toBe(root)
    expect((await Files.getItemByPath('/data')).name).toBe('data')
    expect((await Files.getItemByPath('/data/set1/subset/file1.csv')).name).toBe('file1.csv')
    expect((await Files.getItemByPath('/data/set1/subset2/file2.csv')).name).toBe('file2.csv')
    expect((await Files.getItemByPath('/moredata/info.csv')).name).toBe('info.csv')
    expect(Qvain.changed).toBe(false)
  })

  it('has correct file metadata', async () => {
    const file = await Files.getItemByPath('/data/set1/subset/file1.csv')
    expect(file).toMatchObject({
      name: 'file1.csv',
      title: 'changed_title',
      description: 'Explicitly added file',
      useCategory: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/documentation',
      fileType: 'http://uri.suomi.fi/codelist/fairdata/file_type/code/text',
    })

    const newMeta = {
      title: 'another_title',
      description: 'New description',
      useCategory: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/test',
      fileType: 'http://uri.suomi.fi/codelist/fairdata/file_type/code/test',
    }

    Files.setInEdit(file)
    Files.applyInEdit(newMeta)
    expect(file).toMatchObject(newMeta)
    expect(Qvain.changed).toBe(true)
  })

  it('removes and adds existing selected files correctly', async () => {
    const file = await Files.getItemByPath('/data/set1/file1.csv') // existing, has metadata
    expect(file).toMatchObject({
      added: false,
      removed: false,
    })
    expect(root).toMatchObject({
      addedChildCount: 0,
      removedChildCount: 0,
    })

    Files.removeItem(file) // should remove file
    expect(file).toMatchObject({
      added: false,
      removed: true,
    })
    expect(root).toMatchObject({
      addedChildCount: 0,
      removedChildCount: 1,
    })

    Files.addItem(file) // adding file back should undo the remove
    expect(file).toMatchObject({
      added: true,
      removed: false,
    })
    expect(root).toMatchObject({
      addedChildCount: 1,
      removedChildCount: 0,
    })

    expect(Qvain.changed).toBe(true)
  })

  it('adds and removes new files correctly', async () => {
    const file = await Files.getItemByPath('/data/set1/file1.csv') // existing
    Files.removeItem(file) // file should be removed
    expect(file).toMatchObject({
      added: false,
      removed: true,
    })
    expect(root).toMatchObject({
      addedChildCount: 0,
      removedChildCount: 1,
    })

    Files.addItem(file) // file should be added
    expect(file).toMatchObject({
      added: true,
      removed: false,
    })
    expect(root).toMatchObject({
      addedChildCount: 1,
      removedChildCount: 0,
    })

    Files.removeItem(file) // file should no longer be added
    expect(file).toMatchObject({
      added: false,
      removed: true,
    })
    expect(root).toMatchObject({
      addedChildCount: 0,
      removedChildCount: 1,
    })

    expect(Qvain.changed).toBe(true)
  })

  it('loads existing files', async () => {
    await Files.loadAllDirectories()
    const items = flatten(Files.root)
    expect(items.filter(item => item.existing).length).toBe(14)
    expect(items.filter(item => !item.existing).length).toBe(7)
  })

  it('loads files for an empty dataset', async () => {
    const response = await axios.get(urls.v2.dataset(emptyDatasetIdentifier))
    stores.Qvain.editDataset(response.data)
    Files.changeProject('project')
    await Files.loadingProjectRoot.promise
    await Files.loadAllDirectories()

    const items = flatten(Files.root)
    expect(items.filter(item => item.existing).length).toBe(0)
    expect(items.filter(item => !item.existing).length).toBe(21)
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
    expect(sorted(view.getTopmostChecked())).toEqual([subset, set2File1])

    view.toggleChecked(set1)
    expect(sorted(view.getTopmostChecked())).toEqual([set1, set2File1])

    view.toggleChecked(data)
    expect(view.getTopmostChecked()).toEqual([data])

    view.toggleChecked(data)
    expect(sorted(view.getTopmostChecked())).toEqual([set1, set2File1])

    expect(Qvain.changed).toBe(false)
  })
})

describe('Qvain.Files tree', () => {
  it('propagates parent addition', async () => {
    await Files.SelectedItemsView.setAllOpen(true)

    const data = await Files.getItemByPath('/data')
    const subset = await Files.getItemByPath('/data/set1/subset')
    const subsetFile1 = await Files.getItemByPath('/data/set1/subset/file1.csv')

    Files.addItem(data) // add data (already exists but is not selected)
    // wrapper = shallow(<SelectedItemsTreeBase Stores={stores} />).dive()

    useStores.mockReturnValue(stores)
    let wrapper = shallow(<SelectedItemsTree />)

    expect(data.added).toBe(true)
    let items = wrapper.find(SelectedItemsTreeItem)
    let subsetItem = items.findWhere(item => item.prop('item') === subset)
    expect(subsetItem.prop('parentArgs')).toMatchObject({
      parentChecked: false,
      parentAdded: true,
    })

    let subsetFile1Item = items.findWhere(item => item.prop('item') === subsetFile1)
    expect(subsetFile1Item.prop('parentArgs')).toMatchObject({
      parentChecked: false,
      parentAdded: true,
    })
  })

  it('propagates parent check', async () => {
    await Files.SelectedItemsView.setAllOpen(true)

    useStores.mockReturnValue(stores)
    let wrapper = shallow(<SelectedItemsTree Stores={stores} />)

    const data = await Files.getItemByPath('/data')
    const subset = await Files.getItemByPath('/data/set1/subset')
    const subsetFile1 = await Files.getItemByPath('/data/set1/subset/file1.csv')

    Files.SelectedItemsView.toggleChecked(data) // check data
    wrapper = shallow(<SelectedItemsTree Stores={stores} />)

    expect(Files.SelectedItemsView.isChecked(data)).toBe(true)
    let items = wrapper.find(SelectedItemsTreeItem)
    let subsetItem = items.findWhere(item => item.prop('item') === subset)
    expect(subsetItem.prop('parentArgs')).toMatchObject({
      parentChecked: true,
      parentAdded: false,
    })

    let subsetFile1Item = items.findWhere(item => item.prop('item') === subsetFile1)
    expect(subsetFile1Item.prop('parentArgs')).toMatchObject({
      parentChecked: true,
      parentAdded: false,
    })

    Files.SelectedItemsView.toggleChecked(data) // uncheck data
    wrapper = shallow(<SelectedItemsTree Stores={stores} />)

    expect(Files.SelectedItemsView.isChecked(data)).toBe(false)
    items = wrapper.find(SelectedItemsTreeItem)
    subsetItem = items.findWhere(item => item.prop('item') === subset)
    expect(subsetItem.prop('parentArgs')).toMatchObject({
      parentChecked: false,
      parentAdded: false,
    })

    subsetFile1Item = items.findWhere(item => item.prop('item') === subsetFile1)
    expect(subsetFile1Item.prop('parentArgs')).toMatchObject({
      parentChecked: false,
      parentAdded: false,
    })
  })

  it('shows subitems for open directories', async () => {
    await Files.loadAllDirectories()

    useStores.mockReturnValue(stores)
    let wrapper = shallow(<SelectedItemsTree Stores={stores} />)
    const view = Files.SelectedItemsView

    let items = wrapper.find(SelectedItemsTreeItem)
    const data = await Files.getItemByPath('/data')
    const set1 = await Files.getItemByPath('/data/set1')

    expect(items.filter('[level=0]').length).toBe(2)

    await view.open(data)
    wrapper = shallow(<SelectedItemsTree Stores={stores} />)
    expect(view.isOpen(data)).toBe(true)
    items = wrapper.find(SelectedItemsTreeItem)

    expect(items.filter('[level=0]').length).toBe(2)
    expect(items.filter('[level=1]').length).toBe(2)

    await view.open(set1)
    wrapper = shallow(<SelectedItemsTree Stores={stores} />)
    items = wrapper.find(SelectedItemsTreeItem)
    expect(items.filter('[level=0]').length).toBe(2)
    expect(items.filter('[level=1]').length).toBe(2)
    expect(items.filter('[level=2]').length).toBe(3)

    view.close(data)
    wrapper = shallow(<SelectedItemsTree Stores={stores} />)
    items = wrapper.find(SelectedItemsTreeItem)
    expect(items.filter('[level=0]').length).toBe(2)
    expect(items.filter(':not([level=0])').length).toBe(0)
  })

  it('limits how many items are visible in a folder', async () => {
    const view = Files.SelectedItemsView
    await view.setAllOpen(true)
    view.setDefaultShowLimit(3, 1)

    useStores.mockReturnValue(stores)
    let wrapper = shallow(<SelectedItemsTree Stores={stores} />)

    const subset = await Files.getItemByPath('/data/set1/subset')
    let items = wrapper.find(SelectedItemsTreeItem)
    expect(items.filter('[level=3]').length).toBe(3)
    expect(wrapper.find(ShowMore).length).toBe(1)

    await view.showMore(subset)
    wrapper = shallow(<SelectedItemsTree Stores={stores} />)
    items = wrapper.find(SelectedItemsTreeItem)
    expect(items.filter('[level=3]').length).toBe(4)
  })

  it('shows items according to assigned showlimit', async () => {
    const view = Files.SelectedItemsView
    view.setDefaultShowLimit(4, 10)
    await view.setAllOpen(true)

    useStores.mockReturnValue(stores)
    let wrapper = shallow(<SelectedItemsTree Stores={stores} />)

    let items = wrapper.find(SelectedItemsTreeItem)
    expect(items.filter('[level=3]').length).toBe(4)

    view.setDefaultShowLimit(2, 1)
    wrapper = shallow(<SelectedItemsTree Stores={stores} />)
    items = wrapper.find(SelectedItemsTreeItem)
    expect(items.filter('[level=3]').length).toBe(2)
  })

  it('shows more items', async () => {
    const view = Files.SelectedItemsView
    view.setDefaultShowLimit(2, 1)
    await view.setAllOpen(true)
    const subset = await Files.getItemByPath('/data/set1/subset', true)

    useStores.mockReturnValue(stores)
    let wrapper = shallow(<SelectedItemsTree Stores={stores} />)

    let items = wrapper.find(SelectedItemsTreeItem)
    expect(items.filter('[level=3]').length).toBe(2)

    await view.showMore(subset)
    wrapper = shallow(<SelectedItemsTree Stores={stores} />)
    items = wrapper.find(SelectedItemsTreeItem)
    expect(items.filter('[level=3]').length).toBe(3)

    await view.showMore(subset)
    wrapper = shallow(<SelectedItemsTree Stores={stores} />)
    items = wrapper.find(SelectedItemsTreeItem)
    expect(items.filter('[level=3]').length).toBe(4)
  })

  it('removes all files and directories', async () => {
    await Files.loadAllDirectories()

    const items = flatten(Files.root)
    items.forEach(item => {
      Files.removeItem(item)
    })

    await Files.AddItemsView.setAllOpen(true)
    await Files.SelectedItemsView.setAllOpen(true)

    const addWrapper = shallow(<AddItemsTree Stores={stores} />)
    const addItems = addWrapper.find(AddItemsTreeItem)
    expect(addItems.length).toBe(21)

    const selectedWrapper = shallow(<SelectedItemsTree Stores={stores} />)
    const selectedItems = selectedWrapper.find(SelectedItemsTreeItem)
    expect(selectedItems.length).toBe(0)
  })

  it('shows removed files and directories', async () => {
    await Files.loadAllDirectories()

    const items = flatten(Files.root)
    items.forEach(item => {
      Files.removeItem(item)
    })

    await Files.AddItemsView.setAllOpen(true)
    await Files.SelectedItemsView.setAllOpen(true)

    const addWrapper = shallow(<AddItemsTree Stores={stores} />)
    const addItems = addWrapper.find(AddItemsTreeItem)
    expect(addItems.length).toBe(21)

    Files.SelectedItemsView.setHideRemoved(false)

    let selectedWrapper = shallow(<SelectedItemsTree Stores={stores} />)
    let selectedItems = selectedWrapper.find(SelectedItemsTreeItem)
    expect(selectedItems.length).toBe(14)
  })

  it('adds all files and directories', async () => {
    await Files.loadAllDirectories()

    flatten(Files.root).forEach(item => {
      Files.addItem(item)
    })

    await Files.AddItemsView.setAllOpen(true)
    await Files.SelectedItemsView.setAllOpen(true)

    const selectedWrapper = shallow(<SelectedItemsTree Stores={stores} />)
    const selectedItems = selectedWrapper.find(SelectedItemsTreeItem)
    expect(selectedWrapper.find(ShowMore).length).toBe(0)
    expect(selectedItems.length).toBe(21)
  })
})

describe('Qvain.Files AddItemsTree ', () => {
  it('shows items that have new children ', async () => {
    await Files.AddItemsView.setAllOpen(true)

    const wrapper = shallow(<AddItemsTree Stores={stores} />)
    const items = wrapper.find(AddItemsTreeItem)

    expect(itemPaths(items.filter('[level=0]'))).toEqual(['/data'])

    expect(itemPaths(items.filter('[level=1]'))).toEqual(['/data/set1', '/data/set2'])

    expect(itemPaths(items.filter('[level=2]'))).toEqual([
      '/data/set1/file4.csv',
      '/data/set1/subset',
      '/data/set1/subset2',
      '/data/set2/file2.csv',
      '/data/set2/file3.csv',
    ])

    expect(itemPaths(items.filter('[level=3]'))).toEqual([
      '/data/set1/subset/file13.csv',
      '/data/set1/subset2/file1.csv',
      '/data/set1/subset2/file2.csv',
    ])

    expect(wrapper.find(ShowMore).length).toBe(0)
  })

  it('shows removed directory', async () => {
    await Files.loadAllDirectories()
    const dir = await Files.getItemByPath('/moredata')
    Files.removeItem(dir)

    await Files.AddItemsView.setAllOpen(true)

    const addWrapper = shallow(<AddItemsTree Stores={stores} />)
    const addItems = addWrapper.find(AddItemsTreeItem).filterWhere(i => i.prop('item') === dir)
    expect(addItems.length).toBe(1)
  })

  it('shows removed files', async () => {
    await Files.loadAllDirectories()
    const file1 = await Files.getItemByPath('/moredata/info.csv')
    Files.removeItem(file1)
    const file2 = await Files.getItemByPath('/moredata/stuff.csv')
    Files.removeItem(file2)
    await Files.AddItemsView.setAllOpen(true)

    const wrapper = shallow(<AddItemsTree Stores={stores} />)
    const items = wrapper.find(AddItemsTreeItem)

    expect(itemPaths(items.filter('[level=0]'))).toEqual(['/data', '/moredata'])

    expect(itemPaths(items.filter('[level=1]'))).toEqual([
      '/data/set1',
      '/data/set2',
      '/moredata/info.csv',
      '/moredata/stuff.csv',
    ])
    expect(wrapper.find(ShowMore).length).toBe(0)
  })
})

describe('Qvain.Files SelectedItemsTree ', () => {
  it('shows selected and existing items', async () => {
    await Files.SelectedItemsView.setAllOpen(true)

    const wrapper = shallow(<SelectedItemsTree Stores={stores} />)
    const items = wrapper.find(SelectedItemsTreeItem)

    expect(itemPaths(items.filter('[level=0]'))).toEqual(['/data', '/moredata'])

    expect(itemPaths(items.filter('[level=1]'))).toEqual([
      '/data/set1',
      '/data/set2',
      '/moredata/info.csv',
      '/moredata/stuff.csv',
    ])

    expect(itemPaths(items.filter('[level=2]'))).toEqual([
      '/data/set1/file1.csv',
      '/data/set1/file2.csv',
      '/data/set1/subset',
      '/data/set2/file1.csv',
    ])

    expect(itemPaths(items.filter('[level=3]'))).toEqual([
      '/data/set1/subset/file1.csv',
      '/data/set1/subset/file10.csv',
      '/data/set1/subset/file11.csv',
      '/data/set1/subset/file12.csv',
    ])

    expect(items.map(item => item.prop('item')).filter(item => item.existing).length).toBe(14)
    expect(items.map(item => item.prop('item')).filter(item => !item.existing).length).toBe(0)
    expect(wrapper.find(ShowMore).length).toBe(0)
  })

  it('also shows added items', async () => {
    await Files.loadAllDirectories()
    const file = await Files.getItemByPath('/data/set1/subset2/file1.csv')
    Files.addItem(file)
    await Files.SelectedItemsView.setAllOpen(true)

    const wrapper = shallow(<SelectedItemsTree Stores={stores} />)
    const items = wrapper.find(SelectedItemsTreeItem)

    expect(itemPaths(items.filter('[level=2]'))).toEqual([
      '/data/set1/file1.csv',
      '/data/set1/file2.csv',
      '/data/set1/subset',
      '/data/set1/subset2',
      '/data/set2/file1.csv',
    ])

    expect(itemPaths(items.filter('[level=3]'))).toEqual([
      '/data/set1/subset/file1.csv',
      '/data/set1/subset/file10.csv',
      '/data/set1/subset/file11.csv',
      '/data/set1/subset/file12.csv',
      '/data/set1/subset2/file1.csv',
    ])

    expect(items.map(item => item.prop('item')).filter(item => item.existing).length).toBe(14)
    expect(items.map(item => item.prop('item')).filter(item => !item.existing).length).toBe(2)
    expect(wrapper.find(ShowMore).length).toBe(0)
  })

  it('adds files to a new dataset', async () => {
    const response = await axios.get(urls.v2.dataset(emptyDatasetIdentifier))
    stores.Qvain.editDataset(response.data)
    Files.changeProject('project')
    await Files.loadingProjectRoot.promise
    await Files.loadAllDirectories()
    await Files.SelectedItemsView.setAllOpen(true)
    Files.SelectedItemsView.setDefaultShowLimit(1, 1)

    const file = await Files.getItemByPath('/data/set1/subset2/file1.csv')
    const file2 = await Files.getItemByPath('/data/set1/subset2/file2.csv')
    Files.addItem(file)
    Files.addItem(file2)

    let wrapper = shallow(<SelectedItemsTree Stores={stores} />)
    let items = wrapper.find(SelectedItemsTreeItem)

    expect(itemPaths(items)).toEqual([
      '/data',
      '/data/set1',
      '/data/set1/subset2',
      '/data/set1/subset2/file1.csv',
    ])

    expect(wrapper.find(ShowMore).length).toBe(1)

    const subset2 = await Files.getItemByPath('/data/set1/subset2')
    await Files.SelectedItemsView.showMore(subset2)
    // testing mobx-store
    expect(Files.SelectedItemsView.showLimitState).toEqual({ 'dir:37': 2 })

    // testing components with updated showMore
    wrapper = shallow(<SelectedItemsTree Stores={stores} />)
    items = wrapper.find(SelectedItemsTreeItem)
    expect(itemPaths(items)).toEqual([
      '/data',
      '/data/set1',
      '/data/set1/subset2',
      '/data/set1/subset2/file1.csv',
      '/data/set1/subset2/file2.csv',
    ])
    expect(wrapper.find(ShowMore).length).toBe(0)
  })

  it('adds directory to a new dataset', async () => {
    const response = await axios.get(urls.v2.dataset(emptyDatasetIdentifier))
    stores.Qvain.editDataset(response.data)
    Files.changeProject('project')
    await Files.loadingProjectRoot.promise
    await Files.loadAllDirectories()
    await Files.SelectedItemsView.setAllOpen(true)
    Files.SelectedItemsView.setDefaultShowLimit(10, 1)

    const dir = await Files.getItemByPath('/data/set1/subset2')
    Files.addItem(dir)

    const wrapper = shallow(<SelectedItemsTree Stores={stores} />)
    let items = wrapper.find(SelectedItemsTreeItem)

    expect(itemPaths(items)).toEqual([
      '/data',
      '/data/set1',
      '/data/set1/subset2',
      '/data/set1/subset2/file1.csv',
      '/data/set1/subset2/file2.csv',
    ])

    expect(wrapper.find(ShowMore).length).toBe(0)
  })
})

describe('Qvain.Files handleSubmit', () => {
  it('submits data correctly', async () => {
    const dataset = handleSubmitToBackend(Env, Qvain)
    expect(dataset).toMatchSnapshot()
  })

  it('submits data correctly after adding directory', async () => {
    const set2 = await Files.getItemByPath('/data/set2')
    Files.addItem(set2)
    const dataset = handleSubmitToBackend(Env, Qvain)
    expect(dataset).toMatchSnapshot()
  })

  it('submits data correctly after adding file', async () => {
    const file2 = await Files.getItemByPath('/data/set2/file2.csv')
    Files.addItem(file2)
    const dataset = handleSubmitToBackend(Env, Qvain)
    expect(dataset).toMatchSnapshot()
  })

  it('submits data correctly after removing directory', async () => {
    const set1 = await Files.getItemByPath('/data/set1')
    Files.removeItem(set1)
    const dataset = handleSubmitToBackend(Env, Qvain)
    expect(dataset).toMatchSnapshot()
  })

  it('submits data correctly after removing file', async () => {
    const info = await Files.getItemByPath('/moredata/info.csv')
    Files.removeItem(info)
    const dataset = handleSubmitToBackend(Env, Qvain)
    expect(dataset).toMatchSnapshot()
  })

  it('removes directory when all child files are removed', async () => {
    const moredata = await Files.getItemByPath('/moredata')
    const info = await Files.getItemByPath('/moredata/info.csv')
    const stuff = await Files.getItemByPath('/moredata/stuff.csv')

    Files.removeItem(info)
    Files.removeItem(stuff)
    const actions = Files.actionsToMetax()
    expect(actions.directories).toEqual([{ identifier: moredata.identifier, exclude: true }])
  })

  it('removes directory when all child directories are removed', async () => {
    const data = await Files.getItemByPath('/data')
    const set1 = await Files.getItemByPath('/data/set1')
    const set2 = await Files.getItemByPath('/data/set2')

    Files.removeItem(set1)
    Files.removeItem(set2)
    const actions = Files.actionsToMetax()
    expect(actions.directories).toEqual([{ identifier: data.identifier, exclude: true }])
  })

  it('removes directory', async () => {
    const set1 = await Files.getItemByPath('/data/set1')

    Files.removeItem(set1)
    const actions = Files.actionsToMetax()
    expect(actions.directories).toEqual([{ identifier: set1.identifier, exclude: true }])
  })

  it('removes directories and files', async () => {
    const file1 = await Files.getItemByPath('/data/set1/file1.csv')
    const file2 = await Files.getItemByPath('/data/set1/file2.csv')
    const moredata = await Files.getItemByPath('/moredata')

    Files.removeItem(file1)
    Files.removeItem(file2)
    Files.removeItem(moredata)
    const actions = Files.actionsToMetax()
    expect(actions.files).toEqual([
      { identifier: file1.identifier, exclude: true },
      { identifier: file2.identifier, exclude: true },
    ])
    expect(actions.directories).toEqual([{ identifier: moredata.identifier, exclude: true }])
  })

  it('does not remove directory when parent directory is already removed', async () => {
    const set1 = await Files.getItemByPath('/data/set1')
    const subset = await Files.getItemByPath('/data/set1/subset')

    Files.removeItem(set1)
    Files.removeItem(subset)
    const actions = Files.actionsToMetax()
    expect(actions.directories).toEqual([{ identifier: set1.identifier, exclude: true }])
  })

  it('clears child actions when parent is removed', async () => {
    const set1 = await Files.getItemByPath('/data/set1')
    const subset = await Files.getItemByPath('/data/set1/subset')
    const file4 = await Files.getItemByPath('/data/set1/file4.csv')

    Files.removeItem(subset)
    Files.addItem(file4)
    let actions = Files.actionsToMetax()
    expect(actions.directories).toEqual([{ identifier: subset.identifier, exclude: true }])
    expect(actions.files).toEqual([{ identifier: file4.identifier }])

    Files.removeItem(set1)
    actions = Files.actionsToMetax()
    expect(actions.directories).toEqual([{ identifier: set1.identifier, exclude: true }])
    expect(actions.files).toEqual([])
  })

  it('adds directory when all child directories are added', async () => {
    const data = await Files.getItemByPath('/data')
    const set1 = await Files.getItemByPath('/data/set1')
    const set2 = await Files.getItemByPath('/data/set2')

    Files.addItem(set1)
    Files.addItem(set2)
    const actions = Files.actionsToMetax()
    expect(actions.directories).toEqual([{ identifier: data.identifier }])
  })

  it('adds directory when all nested files are added', async () => {
    const set1 = await Files.getItemByPath('/data/set1')

    Files.addItem(await Files.getItemByPath('/data/set1/file4.csv'))
    Files.addItem(await Files.getItemByPath('/data/set1/subset2/file1.csv'))
    Files.addItem(await Files.getItemByPath('/data/set1/subset2/file2.csv'))
    Files.addItem(await Files.getItemByPath('/data/set1/subset/file13.csv'))

    const actions = Files.actionsToMetax()
    expect(actions.directories).toEqual([{ identifier: set1.identifier }])
  })

  it('adds directories and files', async () => {
    const set1 = await Files.getItemByPath('/data/set1')
    const set2file2 = await Files.getItemByPath('/data/set2/file2.csv')

    Files.addItem(set1)
    Files.addItem(set2file2)

    const actions = Files.actionsToMetax()
    expect(actions.directories).toEqual([{ identifier: set1.identifier }])
    expect(actions.files).toEqual([{ identifier: set2file2.identifier }])
  })

  it('does not add file when its parent directory is already added', async () => {
    const data = await Files.getItemByPath('/data')
    const file13 = await Files.getItemByPath('/data/set1/subset/file13.csv')

    Files.addItem(data)
    Files.addItem(file13)

    const actions = Files.actionsToMetax()
    expect(actions.directories).toEqual([{ identifier: data.identifier }])
    expect(actions.files).toEqual([])
  })

  it('clears child actions when parent is added', async () => {
    const set1 = await Files.getItemByPath('/data/set1')
    const subset = await Files.getItemByPath('/data/set1/subset')
    const file4 = await Files.getItemByPath('/data/set1/file4.csv')

    Files.removeItem(subset)
    Files.addItem(file4)
    let actions = Files.actionsToMetax()
    expect(actions.directories).toEqual([{ identifier: subset.identifier, exclude: true }])
    expect(actions.files).toEqual([{ identifier: file4.identifier }])

    Files.addItem(set1)
    actions = Files.actionsToMetax()
    expect(actions.directories).toEqual([{ identifier: set1.identifier }])
    expect(actions.files).toEqual([])
  })

  it('adds and removes directories based on actions done to nested items', async () => {
    const set1 = await Files.getItemByPath('/data/set1')
    const set2 = await Files.getItemByPath('/data/set2')

    Files.addItem(await Files.getItemByPath('/data/set1/file4.csv'))
    Files.addItem(await Files.getItemByPath('/data/set1/subset'))
    Files.addItem(await Files.getItemByPath('/data/set1/subset2'))
    Files.removeItem(await Files.getItemByPath('/data/set2/file1.csv'))
    const actions = Files.actionsToMetax()
    expect(actions.directories).toEqual([
      { identifier: set1.identifier },
      { identifier: set2.identifier, exclude: true },
    ])
  })

  it('removes and adds nested items', async () => {
    const data = await Files.getItemByPath('/data')
    const set1 = await Files.getItemByPath('/data/set1')
    const set1File2 = await Files.getItemByPath('/data/set1/file2.csv')
    const subset = await Files.getItemByPath('/data/set1/subset')
    const subsetFile1 = await Files.getItemByPath('/data/set1/subset/file1.csv')

    Files.removeItem(data)
    Files.addItem(set1)
    Files.removeItem(set1File2)
    Files.removeItem(subset)
    Files.addItem(subsetFile1)
    const actions = Files.actionsToMetax()
    expect(actions.directories).toEqual([
      { identifier: data.identifier, exclude: true },
      { identifier: set1.identifier },
      { identifier: subset.identifier, exclude: true },
    ])
    expect(actions.files).toEqual([
      { identifier: set1File2.identifier, exclude: true },
      { identifier: subsetFile1.identifier },
    ])
  })
})

describe('Qvain.Files pagination', () => {
  it('respects limit for any items', async () => {
    const subset = await Files.getItemByPath('/data/set1/subset', true)
    expect(subset.files.length + subset.directories.length).toBe(0)
    await itemLoaderAny.loadDirectory(Files, subset, 1)
    expect(subset.files.length + subset.directories.length).toBe(1)
    await itemLoaderAny.loadDirectory(Files, subset, 2)
    expect(subset.files.length + subset.directories.length).toBe(2)
    await itemLoaderAny.loadDirectory(Files, subset, 4)
    expect(subset.files.length + subset.directories.length).toBe(4)
    await itemLoaderAny.loadDirectory(Files, subset, 5)
    expect(subset.files.length + subset.directories.length).toBe(5)
    await itemLoaderAny.loadDirectory(Files, subset, 100)
    expect(subset.files.length + subset.directories.length).toBe(5)
  })

  it('respects limit for selected items', async () => {
    const subset = await Files.getItemByPath('/data/set1/subset', true)
    expect(subset.files.length + subset.directories.length).toBe(0)
    await itemLoaderExisting.loadDirectory(Files, subset, 1)
    expect(subset.files.length + subset.directories.length).toBe(1)
    await itemLoaderExisting.loadDirectory(Files, subset, 2)
    expect(subset.files.length + subset.directories.length).toBe(2)
    await itemLoaderExisting.loadDirectory(Files, subset, 3)
    expect(subset.files.length + subset.directories.length).toBe(3)
    await itemLoaderExisting.loadDirectory(Files, subset, 4)
    expect(subset.files.length + subset.directories.length).toBe(4)
    await itemLoaderExisting.loadDirectory(Files, subset, 100)
    expect(subset.files.length + subset.directories.length).toBe(4)
  })

  it('respects limit for new items', async () => {
    const subset = await Files.getItemByPath('/data/set1/subset', true)
    expect(subset.files.length + subset.directories.length).toBe(0)
    await itemLoaderNew.loadDirectory(Files, subset, 1)
    expect(subset.files.length + subset.directories.length).toBe(1)
    await itemLoaderNew.loadDirectory(Files, subset, 2)
    expect(subset.files.length + subset.directories.length).toBe(1)
  })

  it('respects limit for mixed items', async () => {
    const subset = await Files.getItemByPath('/data/set1/subset', true)
    expect(subset.files.length + subset.directories.length).toBe(0)
    await itemLoaderNew.loadDirectory(Files, subset, 1)
    expect(subset.files.length + subset.directories.length).toBe(1)
    await itemLoaderExisting.loadDirectory(Files, subset, 1)
    expect(subset.files.length + subset.directories.length).toBe(2)
  })

  it('preserves Metax item order when loading any files', async () => {
    const subset = await Files.getItemByPath('/data/set1/subset', true)
    await itemLoaderAny.loadDirectory(Files, subset, 10)
    expect(subset.files.map(item => item.path)).toEqual([
      '/data/set1/subset/file1.csv',
      '/data/set1/subset/file10.csv',
      '/data/set1/subset/file11.csv',
      '/data/set1/subset/file12.csv',
      '/data/set1/subset/file13.csv',
    ])

    // file1  +
    // file10 +
    // file11 +
    // file12 +
    // file13 -
  })

  it('preserves Metax item order with mixed file loads', async () => {
    const subset = await Files.getItemByPath('/data/set1/subset', true)
    await itemLoaderExisting.loadDirectory(Files, subset, 2)
    await itemLoaderNew.loadDirectory(Files, subset, 1)

    expect(subset.files.map(item => item.path)).toEqual([
      '/data/set1/subset/file1.csv',
      '/data/set1/subset/file10.csv',
      '/data/set1/subset/file13.csv',
    ])
  })

  it('does not load same file again', async () => {
    const subset = await Files.getItemByPath('/data/set1/subset', true)
    axios.get.mockClear()
    await itemLoaderAny.loadDirectory(Files, subset, 3)
    expect(axios.get.mock.calls.length).toBe(3)
    await itemLoaderNew.loadDirectory(Files, subset, 10000)
    expect(axios.get.mock.calls.length).toBe(4)
    await itemLoaderNew.loadDirectory(Files, subset, 10000)
    expect(axios.get.mock.calls.length).toBe(4)
    expect(subset.files.map(item => item.path)).toEqual([
      '/data/set1/subset/file1.csv',
      '/data/set1/subset/file10.csv',
      '/data/set1/subset/file11.csv',
      '/data/set1/subset/file13.csv',
    ])
  })
})
