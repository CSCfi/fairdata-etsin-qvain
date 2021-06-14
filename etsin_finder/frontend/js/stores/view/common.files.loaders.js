import axios from 'axios'
import { observable, action, runInAction, when } from 'mobx'

import urls from '../../utils/urls'

import {
  File,
  Directory,
  dirKey,
  fileKey,
  dirIdentifierKey,
  fileIdentifierKey,
} from './common.files.items'
import { ignoreNotFound, emptyDirectoryResponse, assignDefined } from './common.files.utils'

// Fetch types:
// ANY           all files
// EXISTING      files in dataset, directories with files in dataset
// NOT_EXISTING  files not in dataset, directories with files not in dataset
// PUBLIC        files in dataset (only public data), not compatible with other types

export const FetchType = {
  ANY: 'any',
  EXISTING: 'existing',
  NOT_EXISTING: 'not_existing',
  PUBLIC: 'public',
}

const fetchExistingChildDataForDirectory = async (
  Files,
  dir,
  datasetIdentifier,
  onlyPublic = false,
  defaults = {}
) => {
  // Fetch data for the existing direct children of a directory.
  // - number of direct children for dataset
  // - dataset file count and byte count for each subdirectory
  // Also, when onlyPublic is enabled
  // - index (sorting position) and id for each file and directory
  // - use dataset file/byte count as the total count
  if (!datasetIdentifier) {
    return {}
  }

  const url = new URL(urls.common.directoryFiles(dir.identifier), document.location.origin)
  url.searchParams.set('file_fields', 'id')
  url.searchParams.set('directory_fields', ['id', 'file_count', 'byte_size'].join(','))
  url.searchParams.set('cr_identifier', datasetIdentifier)
  url.searchParams.set('include_parent', true)
  const resp = ignoreNotFound(axios.get(url.href), emptyDirectoryResponse)
  const { data } = await Files.cancelOnReset(resp)

  const cache = Files.cache
  data.directories.forEach((newDir, index) => {
    const key = dirKey(newDir)
    if (!cache[key]) {
      cache[key] = {}
    }
    cache[key] = {
      ...defaults,
      ...cache[key],
    }
    cache[key].existingFileCount = newDir.file_count
    cache[key].existing = true
    if (onlyPublic) {
      cache[key].fileCount = newDir.file_count
      cache[key].index = index
    }
  })
  data.files.forEach((newFile, index) => {
    const key = fileKey(newFile)
    if (!cache[key]) {
      cache[key] = {}
    }
    cache[key] = {
      ...defaults,
      ...cache[key],
    }
    cache[key].existing = true
    if (onlyPublic) {
      cache[key].index = index + data.directories.length
    }
  })

  const counts = {
    existingDirectChildCount: data.directories.length + data.files.length,
    existingByteSize: data.byte_size,
    existingFileCount: data.file_count,
  }

  // when onlyPublic is enabled, use existing counts as the total counts as
  // the actual totals are only available to project members
  if (onlyPublic) {
    counts.directChildCount = counts.existingDirectChildCount
    counts.byteSize = counts.existingByteSize
    counts.fileCount = counts.existingFileCount
  }

  return counts
}

const fetchAnyChildDataForDirectory = async (Files, dir, defaults = {}) => {
  // Fetch data for the direct children of a directory.
  // - number of direct children
  // - index (sorting position) and id for each file and directory
  // - total file count and byte count for each subdirectory

  const url = new URL(urls.common.directoryFiles(dir.identifier), document.location.origin)
  url.searchParams.set('file_fields', 'id')
  url.searchParams.set('directory_fields', ['id', 'file_count', 'byte_size'].join(','))
  url.searchParams.set('include_parent', true)
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
      ...cache[key],
    }
    cache[key].fileCount = newDir.file_count
    cache[key].byteSize = newDir.byte_size
    cache[key].index = index
  })
  data.files.forEach((newFile, index) => {
    const key = fileKey(newFile)
    if (!cache[key]) {
      cache[key] = {}
    }
    cache[key] = {
      ...defaults,
      ...cache[key],
    }
    cache[key].index = index + data.directories.length
  })

  return {
    directChildCount: data.directories.length + data.files.length,
    byteSize: data.byte_size,
    fileCount: data.file_count,
  }
}

const fetchChildData = action((Files, dir, type) => {
  const { datasetIdentifier, userHasRightsToEditProject } = Files

  if (
    !dir.pagination.fileCountsPromise &&
    type !== FetchType.PUBLIC &&
    userHasRightsToEditProject
  ) {
    dir.pagination.fileCountsPromise = fetchAnyChildDataForDirectory(Files, dir).catch(
      action(err => {
        dir.pagination.fileCountsPromise = null
        console.error(err)
      })
    )
  }

  if (type === FetchType.PUBLIC) {
    // Fetch only items belonging to a dataset.
    if (!dir.pagination.fileCountsPromise) {
      dir.pagination.fileCountsPromise = fetchExistingChildDataForDirectory(
        Files,
        dir,
        datasetIdentifier,
        true
      ).catch(
        action(() => {
          dir.pagination.fileCountsPromise = null
        })
      )
    }
  }

  if (type === FetchType.ANY) {
    // With other fetch types, the file counts are loaded when individual items are load due to use of (not_)cr_identifier,
    // but here we need to fetch them in a separate request.
    if (!dir.pagination.existingFileCountsPromise) {
      dir.pagination.existingFileCountsPromise = fetchExistingChildDataForDirectory(
        Files,
        dir,
        datasetIdentifier,
        false
      ).catch(
        action(() => {
          dir.pagination.existingFileCountsPromise = null
        })
      )
    }
  }
})

const fetchItems = async (Files, dir, offset, limit, type) => {
  const { datasetIdentifier } = Files

  const url = new URL(urls.common.directoryFiles(dir.identifier), document.location.origin)
  url.searchParams.set('pagination', true)
  url.searchParams.set('offset', offset)
  url.searchParams.set('limit', limit)
  url.searchParams.set('include_parent', true)

  if (datasetIdentifier) {
    if (type === FetchType.EXISTING || type === FetchType.PUBLIC) {
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

  await Promise.all([
    promise,
    dir.pagination.fileCountsPromise,
    dir.pagination.existingFileCountsPromise,
  ])
  const resp = await promise
  const data = resp.data

  const directories = data.results.directories.map(newDir => {
    const key = dirKey(newDir)
    const identifierKey = dirIdentifierKey(newDir)
    let existingFileCount, existingByteSize
    if (type === FetchType.EXISTING || type === FetchType.PUBLIC) {
      existingFileCount = newDir.file_count
      existingByteSize = newDir.byte_size
    } else if (type === FetchType.NOT_EXISTING) {
      existingFileCount = cache[key].fileCount - newDir.file_count
      existingByteSize = cache[key].byteSize - newDir.byte_size
    } else {
      existingFileCount = 0
      existingByteSize = 0
    }

    // Use data existing in cache, check with both id and identifier
    return observable(
      Directory(newDir, {
        parent: dir,
        existing: type === FetchType.EXISTING,
        existingFileCount,
        existingByteSize,
        ...cache[identifierKey],
        ...cache[key],
      })
    )
  })

  const files = data.results.files.map(newFile => {
    const key = fileKey(newFile)
    const identifierKey = fileIdentifierKey(newFile)

    // Use data existing in cache, check with both id and identifier
    return observable(
      File(newFile, {
        parent: dir,
        existing: type === FetchType.EXISTING,
        byteSize: newFile.byte_size,
        ...cache[identifierKey],
        ...cache[key],
      })
    )
  })

  const parent = {}
  if (datasetIdentifier && dir.files.length === 0 && dir.directories.length === 0) {
    if (type === FetchType.EXISTING || type === FetchType.PUBLIC) {
      parent.existingFileCount = data.results.file_count
    }
    if (type === FetchType.NOT_EXISTING) {
      parent.existingFileCount =
        (dir.fileCount || (await dir.pagination.fileCountsPromise.fileCount)) -
        data.results.file_count
    }
  }

  return {
    count: data.count,
    directories,
    files,
    parent,
  }
}

class ItemLoader {
  fetchType = FetchType.ANY

  constructor() {
    if (typeof this.getOffset !== 'function') {
      throw new TypeError('Must override getOffset')
    }
  }

  getPaginationKey(search = '') {
    return `${this.fetchType}${search && '-'}${search}`
  }

  hasMore(dir, search = '') {
    if (dir.fullyLoaded) {
      return false
    }
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

  async getLoadingLock(Files, dir, callback = null) {
    // Wait for any existing loading for the current directory to finish, set loading to true.
    while (dir.loading) {
      // loop needed to make sure only one is released at a time
      // eslint-disable-next-line no-await-in-loop
      await Files.cancelOnReset(when(() => !dir.loading).catch(() => {}))
    }
    runInAction(() => {
      dir.loading = true
    })
    // call optional callback
    if (callback) {
      callback()
    }
  }

  async loadDirectory(Files, dir, totalLimit, getCurrentCount = null, search = '') {
    // totalLimit: how many items we want to be shown in total
    // getCurrentCount: function that returns number of items currently being shown
    // search: filter by file name or directory name (TODO)

    if (!Object.values(FetchType).includes(this.fetchType)) {
      throw new TypeError(`Invalid fetchType, fetchType = ${this.fetchType}`)
    }

    try {
      // Keep only one active loading at a time.
      await this.getLoadingLock(Files, dir)

      if (!this.hasMore(dir, search)) {
        return true // everything is already loaded
      }

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

      fetchChildData(Files, dir, this.fetchType)
      const newItems = await Files.cancelOnReset(
        fetchItems(Files, dir, offset, limit, this.fetchType)
      )

      const counts = await dir.pagination.fileCountsPromise
      const existingCounts = await dir.pagination.existingFileCountsPromise
      runInAction(() => {
        // Assign file counts and byte sizes
        assignDefined(dir, counts)
        if (existingCounts) {
          assignDefined(dir, existingCounts)
        }

        // Ignore items that have already been loaded
        const oldDirs = new Set(dir.directories.map(d => d.identifier))
        const oldFiles = new Set(dir.files.map(f => f.identifier))

        dir.directories.splice(
          dir.directories.length,
          0,
          ...newItems.directories.filter(d => !oldDirs.has(d.identifier))
        )
        dir.files.splice(
          dir.files.length,
          0,
          ...newItems.files.filter(f => !oldFiles.has(f.identifier))
        )

        dir.directories.replace(dir.directories.slice().sort((a, b) => a.index - b.index))
        dir.files.replace(dir.files.slice().sort((a, b) => a.index - b.index))

        const newItemsLength = newItems.directories.length + newItems.files.length
        dir.pagination.offsets[paginationKey] = offset + newItemsLength
        dir.pagination.counts[paginationKey] = newItems.count

        this.updatePagination(dir)
      })
    } finally {
      // Always set loading to false before returning
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

      const notExistingItems = items.filter(
        item => !item.existing || (item.type !== 'file' && item.existingFileCount < item.fileCount)
      )
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
      if (items[offset].index - index > 1) {
        break
      }
      index = items[offset].index
    }
    return Math.max(offset, oldOffset)
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
      if (items[i].index - index > 1) {
        break
      }
      index = items[i].index

      if (
        !items[i].existing ||
        (items[i].type !== 'file' && items[i].existingFileCount < items[i].fileCount)
      ) {
        offset += 1
      }
    }
    return Math.max(offset, oldOffset)
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
      if (items[i].index - index > 1) {
        break
      }
      index = items[i].index

      if (items[i].existing) {
        offset += 1
      }
    }
    return Math.max(offset, oldOffset)
  }
}

class ItemLoaderPublic extends ItemLoaderExisting {
  fetchType = FetchType.PUBLIC
}

export const itemLoaderAny = new ItemLoaderAny()
export const itemLoaderNew = new ItemLoaderNew()
export const itemLoaderExisting = new ItemLoaderExisting()
export const itemLoaderPublic = new ItemLoaderPublic()
