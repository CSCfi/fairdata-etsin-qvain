import axios from 'axios'

import FilesBase from '../../../js/stores/view/files'
import urls from '../../../js/components/qvain/utils/urls'
import { get } from '../../__testdata__/qvain.files.data'

global.Promise = require('bluebird')

Promise.config({
  cancellation: true,
})

jest.mock('axios')

const paths = dir => [...dir.directories, ...dir.files].map(item => item.path)

// Mock responses for a dataset containing IDA files. See the data file for the project structure.
axios.get.mockImplementation(get)

const Files = new FilesBase()

const datasetIdentifier = '6d2cb5f5-4867-47f7-9874-09357f2901a3'

let root

const loadDataset = async () => {
  const response = await axios.get(urls.v2.dataset(datasetIdentifier))
  Files.View.setDefaultShowLimit(20, 20)
  const promise = Files.openDataset(response.data)
  expect(Files.isLoadingProject).toBe(true)
  await promise
  expect(Files.isLoadingProject).toBe(false)
  root = Files.root
  expect(root).toEqual(expect.anything())
}

beforeEach(async () => {
  Files.reset()
  await loadDataset()
})

describe('public dataset files', () => {
  it('loads items', async () => {
    const data = await Files.getItemByPath('/data')
    expect(paths(data)).toEqual(['/data/set1', '/data/set2'])
    const set1 = await Files.getItemByPath('/data/set1')
    expect(paths(set1)).toEqual([
      '/data/set1/subset',
      '/data/set1/file1.csv',
      '/data/set1/file2.csv',
    ])
    const set2 = await Files.getItemByPath('/data/set2')
    expect(paths(set2)).toEqual(['/data/set2/file1.csv'])
    const subset = await Files.getItemByPath('/data/set1/subset')
    expect(paths(subset)).toEqual([
      '/data/set1/subset/file1.csv',
      '/data/set1/subset/file10.csv',
      '/data/set1/subset/file11.csv',
      '/data/set1/subset/file12.csv',
    ])
  })

  it('opens directories', async () => {
    const data = await Files.getItemByPath('/data')
    const set1 = await Files.getItemByPath('/data/set1')
    const subset = await Files.getItemByPath('/data/set1/subset')

    const view = Files.View
    expect(view.isOpen(root)).toBe(true) // root is always open
    expect(view.isOpen(data)).toBe(false)
    expect(view.isOpen(set1)).toBe(false)
    expect(view.isOpen(subset)).toBe(false)

    await Files.View.setAllOpen(true) // open all
    expect(view.isOpen(root)).toBe(true)
    expect(view.isOpen(data)).toBe(true)
    expect(view.isOpen(set1)).toBe(true)
    expect(view.isOpen(subset)).toBe(true)

    await Files.View.setAllOpen(false) // close all
    expect(view.isOpen(root)).toBe(true)
    expect(view.isOpen(data)).toBe(false)
    expect(view.isOpen(set1)).toBe(false)
    expect(view.isOpen(subset)).toBe(false)
  })
})
