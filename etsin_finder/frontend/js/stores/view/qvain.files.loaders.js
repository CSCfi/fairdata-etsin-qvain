import axios from 'axios'
import { observable, action, runInAction, when } from 'mobx'

import { FileAPIURLs } from '../../components/qvain/utils/constants'

import { File, Directory, dirKey, fileKey, dirIdentifierKey, fileIdentifierKey } from './qvain.files.items'
import { ignoreNotFound, emptyDirectoryResponse } from './qvain.files.utils'

export const FetchType = {
  ANY: 'any',
  EXISTING: 'existing',
  NOT_EXISTING: 'not_existing'
}

const fetchExistingFileCountsForDirectory = async (Files, dir, datasetIdentifier, defaults = {}) => {
  if (!datasetIdentifier) {
    return 0
  }

  const url = new URL(FileAPIURLs.V2_DIR_URL + dir.identifier, document.location.origin)
  url.searchParams.set('file_fields', 'id,file_path')
  url.searchParams.set('directory_fields', ['id', 'file_count', 'directory_path'].join(','))
  url.searchParams.set('cr_identifier', datasetIdentifier)
  const resp = ignoreNotFound(axios.get(url.href), emptyDirectoryResponse)
  const { data } = await Files.cancelOnReset(resp)

  const cache = Files.cache
  data.directories.forEach((newDir) => {
    const key = dirKey(newDir)
    if (!cache[key]) {
      cache[key] = {}
    }
    cache[key] = {
      ...defaults,
      ...cache[key]
    }
    cache[key].existingFileCount = newDir.file_count
    cache[key].existing = true
  })
  data.files.forEach((newFile) => {
    const key = fileKey(newFile)
    if (!cache[key]) {
      cache[key] = {}
    }
    cache[key] = {
      ...defaults,
      ...cache[key]
    }
    cache[key].existing = true
  })
  return data.count
}

const fetchFileCountsForDirectory = async (Files, dir, defaults = {}) => {
  const url = new URL(FileAPIURLs.V2_DIR_URL + dir.identifier, document.location.origin)
  url.searchParams.set('file_fields', 'id,file_path')
  url.searchParams.set('directory_fields', ['id', 'file_count', 'directory_path'].join(','))
  const resp = axios.get(url.href)
  const { data } = await Files.cancelOnReset(resp)

  const cache = Files.cache
  data.directories.forEach((newDir, index) => {
    const key = dirKey(newDir)
    if (!cache[key]) {
      cache[key] = {}
    }
    cache[key] = {
      ...defaults,
      ...cache[key]
    }
    cache[key].fileCount = newDir.file_count
    cache[key].index = index
  })
  data.files.forEach((newFile, index) => {
    const key = fileKey(newFile)
    if (!cache[key]) {
      cache[key] = {}
    }
    cache[key] = {
      ...defaults,
      ...cache[key]
    }
    cache[key].index = index
  })
  return data.directories.length + data.files.length
}

const fetchFileCounts = action((Files, dir, type) => {
  const datasetIdentifier = Files.Qvain.original && Files.Qvain.original.identifier

  if (!datasetIdentifier && type === FetchType.EXISTING) {
    dir.pagination.fileCountsPromise = Promise.resolve(emptyDirectoryResponse)
  }

  if (!dir.pagination.fileCountsPromise) {
    dir.pagination.fileCountsPromise = fetchFileCountsForDirectory(Files, dir)
      .catch(action((err) => { dir.pagination.fileCountsPromise = null; console.error(err) }))
  }

  if (type === FetchType.ANY) {
    if (!dir.pagination.existingFileCountsPromise) {
      dir.pagination.existingFileCountsPromise = fetchExistingFileCountsForDirectory(Files, dir, datasetIdentifier)
        .catch(action(() => { dir.pagination.existingFileCountsPromise = null }))
    }
  }
})


const fetchItems = async (Files, dir, offset, limit, type) => {
  const datasetIdentifier = Files.Qvain.original && Files.Qvain.original.identifier

  const url = new URL(FileAPIURLs.V2_DIR_URL + dir.identifier, document.location.origin)
  url.searchParams.set('pagination', true)
  url.searchParams.set('offset', offset)
  url.searchParams.set('limit', limit)

  if (datasetIdentifier) {
    if (type === FetchType.EXISTING) {
      url.searchParams.set('cr_identifier', datasetIdentifier)
    }
    if (type === FetchType.NOT_EXISTING) {
      url.searchParams.set('not_cr_identifier', datasetIdentifier)
    }
  }

  const cache = Files.cache
  let promise
  if (!datasetIdentifier && type === FetchType.EXISTING) {
    promise = Promise.resolve(emptyDirectoryResponse)
  } else {
    promise = Files.cancelOnReset(ignoreNotFound(axios.get(url.href), emptyDirectoryResponse))
  }
  await Promise.all([promise, dir.pagination.fileCountsPromise, dir.pagination.existingFileCountsPromise])
  const resp = await promise
  const data = resp.data

  const directories = data.results.directories.map(newDir => {
    const key = dirKey(newDir)
    const identifierKey = dirIdentifierKey(newDir)
    let existingFileCount
    if (type === FetchType.EXISTING || type === FetchType.NOT_EXISTING) {
      existingFileCount = newDir.file_count // WIP: Check if this applies to NOT_EXISTING?
    } else {
      existingFileCount = 0
    }
    return observable(Directory(newDir, {
      parent: dir,
      existing: type === FetchType.EXISTING,
      existingFileCount,
      ...cache[identifierKey],
      ...cache[key],
      fetchType: `! ${type}`
    }))
  })

  const files = data.results.files.map(newFile => {
    const key = fileKey(newFile)
    const identifierKey = fileIdentifierKey(newFile)
    return observable(File(newFile, {
      parent: dir,
      existing: type === FetchType.EXISTING,
      ...cache[identifierKey],
      ...cache[key]
    }))
  })

  return {
    count: data.count,
    directories,
    files,
  }
}

class ItemLoader {
  fetchType = FetchType.ANY

  constructor() {
    if (typeof this.getOffset !== 'function') {
      throw new TypeError('Must override getOffset');
    }
  }

  getPaginationKey(search = '') {
    return `${this.fetchType}${search && '-'}${search}`
  }

  hasMore(dir, search = '') {
    const items = [...dir.directories, ...dir.files]
    const paginationKey = this.getPaginationKey(search)
    const count = dir.pagination.counts[paginationKey]
    const offset = dir.pagination.offsets[paginationKey] || 0

    if (count != null && offset >= count) {
      return false
    }
    if (dir.directChildCount != null && items.length >= dir.directChildCount) {
      return false
    }

    return true
  }

  async loadDirectory(Files, dir, totalLimit, getCurrentCount = null, search = '') {
    // totalLimit: how many items we want to show
    // currentCount: how many items are in the current view
    // search: filter by file name or directory name (TODO)

    if (!Object.values(FetchType).includes(this.fetchType)) {
      throw new TypeError(`Invalid fetchType, fetchType = ${this.fetchType}`);
    }

    // Wait for any existing loading for the current directory to finish.
    if (dir.loading) {
      await Files.cancelOnReset(when(() => !dir.loading).catch(() => { }))
    }

    if (dir.fullyLoaded) {
      return true // everything is already loaded
    }


    if (!this.hasMore(dir, search)) {
      return true
    }

    try {
      runInAction(() => {
        dir.loading = true
      })

      // Offset tells how many successive items starting from item 0 have been loaded.
      const offset = this.getOffset(dir)

      // The getCurrentCount function should return the total number of items
      // we are able to show without loading more from Metax. If the function is missing,
      // use the offset value that does not take into account items from another sources.
      let currentCount
      if (getCurrentCount) {
        currentCount = getCurrentCount()
      } else {
        currentCount = offset
      }

      const limit = totalLimit - currentCount
      if (limit <= 0) {
        return true
      }

      const paginationKey = this.getPaginationKey(search)
      const count = dir.pagination.counts[paginationKey]
      if (count !== undefined && offset >= count) {
        runInAction(() => {
          dir.pagination.offsets[paginationKey] = offset
        })
        return true
      }

      fetchFileCounts(Files, dir, this.fetchType)

      const newItems = await Files.cancelOnReset(fetchItems(Files, dir, offset, limit, this.fetchType))

      const directChildCount = await dir.pagination.fileCountsPromise
      runInAction(() => {
        dir.directChildCount = directChildCount

        const oldDirs = new Set(dir.directories.map(d => d.identifier))
        const oldFiles = new Set(dir.files.map(f => f.identifier))

        dir.directories.splice(dir.directories.length, 0,
          ...newItems.directories.filter(d => !oldDirs.has(d.identifier)))
        dir.files.splice(dir.files.length, 0,
          ...newItems.files.filter(f => !oldFiles.has(f.identifier)))

        dir.directories.replace(dir.directories.slice().sort((a, b) => a.index - b.index))
        dir.files.replace(dir.files.slice().sort((a, b) => a.index - b.index))

        const newItemsLength = newItems.directories.length + newItems.files.length
        dir.pagination.offsets[paginationKey] = offset + newItemsLength
        dir.pagination.counts[paginationKey] = newItems.count

        this.updatePagination(dir)
      })
    } finally {
      runInAction(() => {
        dir.loading = false
      })
    }
    return true
  }

  @action
  updatePagination(dir) {
    const directChildCount = dir.directChildCount
    dir.pagination.counts[FetchType.ANY] = directChildCount

    // All items loaded, no need to load any more
    const itemsLength = dir.directories.length + dir.files.length
    if (itemsLength >= directChildCount) {
      dir.pagination.fullyLoaded = true
      dir.pagination.offsets[FetchType.ANY] = itemsLength

      const items = [...dir.directories, ...dir.files]
      const existingItems = items.filter(item => item.existing)
      dir.pagination.counts[FetchType.EXISTING] = existingItems.length
      dir.pagination.offsets[FetchType.EXISTING] = existingItems.length

      const notExistingItems = items.filter(item => !item.existing || (item.type !== 'file' && item.existingFileCount < item.fileCount))
      dir.pagination.counts[FetchType.NOT_EXISTING] = notExistingItems.length
      dir.pagination.offsets[FetchType.NOT_EXISTING] = notExistingItems.length
    }
  }
}

class ItemLoaderAny extends ItemLoader {
  fetchType = FetchType.ANY

  getOffset(dir, search = '') {
    const items = [...dir.directories, ...dir.files]
    const paginationKey = this.getPaginationKey(search)
    const oldOffset = dir.pagination.offsets[paginationKey] || 0

    let offset
    let index = -1
    for (offset = 0; offset < items.length; offset += 1) {
      if (items[offset] === undefined || items[offset].index - index > 1) {
        break
      }
      index = items[offset].index
    }
    return Math.max(offset, oldOffset)
  }

  countNewItems() {
    return 0
  }
}

class ItemLoaderNew extends ItemLoader {
  fetchType = FetchType.NOT_EXISTING

  getOffset(dir, search = '') {
    const items = [...dir.directories, ...dir.files]
    const paginationKey = this.getPaginationKey(search)
    const oldOffset = dir.pagination.offsets[paginationKey] || 0

    let offset = 0
    let index = -1
    for (let i = 0; i < items.length; i += 1) {
      if (items[i] === undefined || (items[i].index - index > 1)) {
        break
      }
      index = items[i].index

      if (!items[i].existing || (items[i].type !== 'file' && items[i].existingFileCount < items[i].fileCount)) {
        offset += 1
      }
    }
    return Math.max(offset, oldOffset)
  }

  countNewItems(items) {
    return items.filter(item => item.removed).length
  }
}

class ItemLoaderExisting extends ItemLoader {
  fetchType = FetchType.EXISTING

  getOffset(dir, search = '') {
    const items = [...dir.directories, ...dir.files]
    const paginationKey = this.getPaginationKey(search)
    const oldOffset = dir.pagination.offsets[paginationKey] || 0

    let offset = 0
    let index = -1
    for (let i = 0; i < items.length; i += 1) {
      if (items[i] === undefined || (items[i].index - index > 1)) {
        break
      }
      index = items[i].index

      if (items[i].existing) {
        offset += 1
      }
    }
    return Math.max(offset, oldOffset)
  }

  countNewItems(items) {
    return items.filter(item => item.added).length
  }
}

export const itemLoaderAny = new ItemLoaderAny()
export const itemLoaderNew = new ItemLoaderNew()
export const itemLoaderExisting = new ItemLoaderExisting()
