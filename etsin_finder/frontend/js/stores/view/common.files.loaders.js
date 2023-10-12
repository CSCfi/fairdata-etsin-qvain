import { observable, action, runInAction, when, makeObservable } from 'mobx'

import { isAbort } from '@/utils/AbortClient'
import urls from '../../utils/urls'

import {
  File,
  Directory,
  dirKey,
  fileKey,
  dirIdentifierKey,
  fileIdentifierKey,
  getItemsByKey,
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

const getChildDataUrl = (Files, dir, sort) => {
  // Return URL object for getting basic data on direct children for directory.
  let url = new URL(urls.common.directoryFiles(dir.identifier), document.location.origin)

  if (Files.useV3) {
    url = new URL(Files.Env.metaxV3Url('directories'))
    url.searchParams.set('storage_service', 'ida')
    url.searchParams.set('project', Files.selectedProject)
    url.searchParams.set('path', dir.identifier || dir.path)
    url.searchParams.set('directory_fields', ['pathname', 'file_count', 'size'].join(','))
    url.searchParams.set('directory_ordering', sort.directoryOrderingV3)
    url.searchParams.set('file_ordering', sort.fileOrderingV3)
  } else {
    url.searchParams.set(
      'directory_fields',
      ['id', 'file_count', 'byte_size', 'service_created'].join(',')
    )
    url.searchParams.set('directory_ordering', sort.directoryOrdering)
    url.searchParams.set('file_ordering', sort.fileOrdering)
  }
  url.searchParams.set('pagination', 'false')
  url.searchParams.set('file_fields', 'id')
  url.searchParams.set('include_parent', true)
  return url
}

const cacheDirectories = ({ Files, dir, data, defaults, fetchType, onlyPublic = false, sort }) => {
  runInAction(() => {
    const cache = Files.cache
    const itemsByKey = getItemsByKey(dir)

    data.directories.forEach((newDir, index) => {
      const key = dirKey(newDir)
      cache[key] = {
        ...defaults,
        ...cache[key],
      }

      const cacheMethods = {
        [FetchType.PUBLIC]: () => {
          cache[key].existingFileCount = newDir.file_count
          cache[key].existing = true
          cache[key].fileCount = newDir.file_count
          cache[key].index = { ...cache[key].index, [sort.paginationKey]: index }
          if (itemsByKey[key]) {
            itemsByKey[key].index = { ...itemsByKey[key].index, [sort.paginationKey]: index }
          }
        },
        [FetchType.ANY]: () => {
          cache[key].byteSize = newDir.byte_size
          cache[key].fileCount = newDir.file_count
          cache[key].index = { ...cache[key].index, [sort.paginationKey]: index }
          if (itemsByKey[key]) {
            itemsByKey[key].index = { ...itemsByKey[key].index, [sort.paginationKey]: index }
          }
        },
        default: () => {},
      }
      if (onlyPublic) {
        cacheMethods[FetchType.EXISTING] = cacheMethods[FetchType.PUBLIC]
      }

      const cacheMethod = cacheMethods[fetchType] || cacheMethods.default
      cacheMethod()
    })
  })
}

const fetchExistingChildDataForDirectory = async ({
  Files,
  dir,
  datasetIdentifier,
  fetchType,
  onlyPublic = false,
  defaults = {},
  sort,
}) => {
  // Fetch data for the existing direct children of a directory.
  // - number of direct children for dataset
  // - dataset file count and byte count for each subdirectory
  // Also, when onlyPublic is enabled
  // - index (sorting position) and id for each file and directory
  // - use dataset file/byte count as the total count

  if (!datasetIdentifier) {
    return {}
  }

  const url = getChildDataUrl(Files, dir, sort)

  if (Files.useV3) {
    url.searchParams.set('dataset', datasetIdentifier) // v3
  } else {
    url.searchParams.set('cr_identifier', datasetIdentifier) // v2
  }
  const resp = ignoreNotFound(
    Files.client.get(url.href, { tag: 'fetch-existing-child-data' }),
    emptyDirectoryResponse
  )
  const { data } = await resp

  const cache = Files.cache
  const itemsByKey = getItemsByKey(dir)

  cacheDirectories({ Files, dir, data, defaults, fetchType, onlyPublic, sort })

  runInAction(() => {
    data.directories.forEach((newDir, index) => {
      const key = dirKey(newDir)
      cache[key] = {
        ...defaults,
        ...cache[key],
      }

      cache[key].existingFileCount = newDir.file_count
      cache[key].existing = true

      if (onlyPublic) {
        cache[key].fileCount = newDir.file_count
        cache[key].index = { ...cache[key].index, [sort.paginationKey]: index }

        if (itemsByKey[key]) {
          itemsByKey[key].index = { ...itemsByKey[key].index, [sort.paginationKey]: index }
        }
      }
    })
  })

  runInAction(() => {
    data.files.forEach((newFile, index) => {
      const key = fileKey(newFile)
      cache[key] = {
        ...defaults,
        ...cache[key],
      }
      cache[key].existing = true
      if (onlyPublic) {
        cache[key].index = {
          ...cache[key].index,
          [sort.paginationKey]: index + data.directories.length,
        }

        if (itemsByKey[key]) {
          itemsByKey[key].index = {
            ...itemsByKey[key].index,
            [sort.paginationKey]: index + data.directories.length,
          }
        }
      }
    })
  })

  // determine file counts for parent directory
  const counts = {
    existingDirectChildCount: data.directories.length + data.files.length,
    existingByteSize: data.byte_size || data.parent_directory?.byte_size, // v2 || v3
    existingFileCount: data.file_count || data.parent_directory?.file_count, // v2 || v3
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

const fetchAnyChildDataForDirectory = async ({ Files, dir, defaults = {}, sort }) => {
  // Fetch data for the direct children of a directory.
  // - number of direct children
  // - total file count and byte count for each subdirectory

  const url = getChildDataUrl(Files, dir, sort)
  const resp = Files.client.get(url.href, { tag: 'fetch-any-child-data' })
  const { data } = await resp

  const cache = Files.cache
  const itemsByKey = getItemsByKey(dir)

  cacheDirectories({ Files, dir, data, defaults, sort, fetchType: FetchType.ANY })
  runInAction(() => {
    data.directories.forEach((newDir, index) => {
      const key = dirKey(newDir)
      cache[key] = {
        ...defaults,
        ...cache[key],
      }

      cache[key].fileCount = newDir.file_count
      cache[key].byteSize = newDir.byte_size
      cache[key].index = { ...cache[key].index, [sort.paginationKey]: index }

      if (itemsByKey[key]) {
        itemsByKey[key].index = { ...itemsByKey[key].index, [sort.paginationKey]: index }
      }
    })
  })

  runInAction(() => {
    data.files.forEach((newFile, index) => {
      const key = fileKey(newFile)
      cache[key] = {
        ...defaults,
        ...cache[key],
      }

      cache[key].index = {
        ...cache[key].index,
        [sort.paginationKey]: index + data.directories.length,
      }

      if (itemsByKey[key]) {
        itemsByKey[key].index = {
          ...itemsByKey[key].index,
          [sort.paginationKey]: index + data.directories.length,
        }
      }
    })
  })

  return {
    directChildCount: data.directories.length + data.files.length,
    byteSize: data.byte_size,
    fileCount: data.file_count,
  }
}

const fetchChildData = action(({ Files, dir, type, sort }) => {
  // Fetch data on all direct children of dir, including
  // * file counts of directories
  // * id of items
  // * sorting order of items (each id is assigned an index)

  const { datasetIdentifier, userHasRightsToEditProject } = Files

  if (
    sort.hasChanged ||
    (!dir.pagination.fileCountsPromise && type !== FetchType.PUBLIC && userHasRightsToEditProject)
  ) {
    dir.pagination.fileCountsPromise = fetchAnyChildDataForDirectory({ Files, dir, sort }).catch(
      action(err => {
        dir.pagination.fileCountsPromise = null
        if (isAbort(err)) {
          throw err
        } else {
          console.error(err)
        }
      })
    )
  }

  if (type === FetchType.PUBLIC || !userHasRightsToEditProject) {
    if (sort.hasChanged || !dir.pagination.fileCountsPromise) {
      // Fetch only items belonging to a dataset.
      if (!dir.pagination.fileCountsPromise) {
        dir.pagination.fileCountsPromise = fetchExistingChildDataForDirectory({
          Files,
          dir,
          datasetIdentifier,
          onlyPublic: true,
          sort,
        }).catch(
          action(err => {
            dir.pagination.fileCountsPromise = null
            if (isAbort(err)) {
              throw err
            } else {
              console.error(err)
            }
          })
        )
      }
    }
  }

  if (type === FetchType.ANY) {
    // With other fetch types, the file counts are loaded when individual items are load due to use of (not_)cr_identifier,
    // but here we need to fetch them in a separate request.
    if (!dir.pagination.existingFileCountsPromise) {
      dir.pagination.existingFileCountsPromise = fetchExistingChildDataForDirectory({
        Files,
        dir,
        datasetIdentifier,
        onlyPublic: false,
        sort,
      }).catch(
        action(err => {
          dir.pagination.existingFileCountsPromise = null
          if (isAbort(err)) {
            throw err
          } else {
            console.error(err)
          }
        })
      )
    }
  }
})

const fetchItems = async ({ Files, dir, offset, limit, type, sort, filter = '' }) => {
  const { datasetIdentifier } = Files

  let url = new URL(urls.common.directoryFiles(dir.identifier), document.location.origin)
  if (Files.useV3) {
    url = new URL(Files.Env.metaxV3Url('directories'))
    url.searchParams.set('path', dir.identifier || dir.path)
    url.searchParams.set('storage_service', 'ida')
    url.searchParams.set('project', Files.selectedProject)
  }

  url.searchParams.set('pagination', true)
  url.searchParams.set('offset', offset)
  url.searchParams.set('limit', limit)
  url.searchParams.set('include_parent', true)
  if (Files.useV3) {
    url.searchParams.set('directory_ordering', sort.directoryOrderingV3)
    url.searchParams.set('file_ordering', sort.fileOrderingV3)
  } else {
    url.searchParams.set('directory_ordering', sort.directoryOrdering)
    url.searchParams.set('file_ordering', sort.fileOrdering)
  }
  const filterText = filter
  if (filter) {
    url.searchParams.set('name', filterText)
  }

  if (Files.useV3) {
    if (datasetIdentifier) {
      url.searchParams.set('dataset', datasetIdentifier)
      if (type === FetchType.ANY) {
        url.searchParams.set('include_all', true)
      }
      if (type === FetchType.NOT_EXISTING) {
        url.searchParams.set('exclude_dataset', true)
      }
    }
  } else if (datasetIdentifier) {
    if (type === FetchType.EXISTING || type === FetchType.PUBLIC) {
      url.searchParams.set('cr_identifier', datasetIdentifier) // v2
    }
    if (type === FetchType.NOT_EXISTING) {
      url.searchParams.set('not_cr_identifier', datasetIdentifier) // v2
    }
  }

  const cache = Files.cache
  let promise
  if (!datasetIdentifier && type === FetchType.EXISTING) {
    promise = Promise.resolve(emptyDirectoryResponse)
  } else {
    promise = ignoreNotFound(
      Files.client.get(url.href, { tag: 'fetch-items' }),
      emptyDirectoryResponse
    )
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
  // ItemLoader is responsible for loading files and directories from Metax.
  // It also keeps track of pagination so we know what pagination parameters are
  // required and if there are more items available.

  fetchType = FetchType.ANY

  constructor() {
    makeObservable(this)
    if (typeof this.filterItem !== 'function') {
      throw new TypeError('Must override filterItem')
    }
  }

  getPaginationKey(filter = '', sort) {
    return `${this.fetchType}${filter && '-'}${filter.toLowerCase()}-${sort.paginationKey}`
  }

  @action.bound
  hasMore({ dir, sort, filter = '' }) {
    if (dir.pagination.fullyLoaded) {
      return false
    }

    const items = [...dir.directories, ...dir.files]
    const paginationKey = this.getPaginationKey(filter, sort)
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
      // TODO: use signal from AbortClient in when (needs mobx 6.7.0)
      // eslint-disable-next-line no-await-in-loop
      await when(() => !dir.loading)
    }
    runInAction(() => {
      dir.loading = true
    })
    // call optional callback
    if (callback) {
      callback()
    }
  }

  async loadDirectory({ Files, dir, totalLimit, sort, getCurrentCount = null, filter = '' }) {
    // Load directory files from Metax.
    //
    // Loaded directories are added to dir.directories and dir.files arrays while avoiding duplicates.
    // Arrays are sorted to keep them in the same order as Metax does.
    //
    // Arguments:
    //   Files: Files store
    //   dir: Directory object
    //   totalLimit: how many items we want to be shown in total
    //   getCurrentCount: function that returns number of items currently being shown in view
    //   filter: filter by file name or directory name

    if (!Object.values(FetchType).includes(this.fetchType)) {
      throw new TypeError(`Invalid fetchType, fetchType = ${this.fetchType}`)
    }

    try {
      // Keep only one active loading at a time.
      await this.getLoadingLock(Files, dir)

      const offset = this.getOffset({ dir, filter, sort })
      let currentCount = offset
      const limit = totalLimit - currentCount
      const paginationKey = this.getPaginationKey(filter, sort)
      const count = dir.pagination.counts[paginationKey]

      if (!sort.hasChanged) {
        if (!this.hasMore({ dir, sort, filter })) {
          return true // everything is already loaded
        }

        if (getCurrentCount) {
          currentCount = getCurrentCount()
        }
      }

      if (limit <= 0) {
        return true
      }

      if (count !== undefined && offset >= count) {
        runInAction(() => {
          dir.pagination.offsets[paginationKey] = offset
        })
        return true
      }

      fetchChildData({ Files, dir, type: this.fetchType, sort })
      const newItems = await fetchItems({
        Files,
        dir,
        offset,
        limit,
        type: this.fetchType,
        sort,
        filter,
      })

      await this.updateDirectoriesAndFiles({ dir, newItems, paginationKey, offset, sort })
    } finally {
      // Always set loading to false before returning
      runInAction(() => {
        dir.loading = false
        sort.hasChanged = false
      })
    }
    return true
  }

  @action.bound
  async updateDirectoriesAndFiles({ dir, newItems, paginationKey, offset }) {
    await this.updateFileDetails(dir)
    this.updateFiles(dir, newItems)
    this.updatePagination(dir, newItems, paginationKey, offset)
  }

  @action.bound
  async updateFileDetails(dir) {
    const counts = await dir.pagination.fileCountsPromise
    const existingCounts = await dir.pagination.existingFileCountsPromise
    // Assign file counts and byte sizes
    runInAction(() => {
      assignDefined(dir, counts)
      if (existingCounts) {
        assignDefined(dir, existingCounts)
      }
    })
  }

  @action.bound
  updateFiles(dir, newItems) {
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
  }

  @action.bound
  updatePagination(dir, newItems, paginationKey, offset) {
    const newItemsLength = newItems.directories.length + newItems.files.length
    dir.pagination.offsets[paginationKey] = offset + newItemsLength
    dir.pagination.counts[paginationKey] = newItems.count
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

  @action.bound
  getOffset({ dir, sort, filter = '' }) {
    // Determine pagination offset required to get more data from metax.
    const items = sort.getSortedItems(dir)
    const filterStr = filter.toLowerCase()
    const paginationKey = this.getPaginationKey(filterStr, sort)
    const oldOffset = dir.pagination.offsets[paginationKey] || 0

    let offset = 0
    let lastIndex = -1
    for (const item of items) {
      const currentIndex = item.index[sort.paginationKey]
      if (currentIndex === undefined || currentIndex - lastIndex > 1) {
        break
      }
      lastIndex = currentIndex

      if (this.filterItem(item)) {
        if (!filterStr || item.name.toLowerCase().includes(filterStr)) {
          offset += 1
        }
      }
    }
    return Math.max(offset, oldOffset)
  }
}

class ItemLoaderAny extends ItemLoader {
  fetchType = FetchType.ANY

  filterItem() {
    return true
  }
}

class ItemLoaderNew extends ItemLoader {
  fetchType = FetchType.NOT_EXISTING

  filterItem(item) {
    return !item.existing || (item.type !== 'file' && item.existingFileCount < item.fileCount)
  }
}

class ItemLoaderExisting extends ItemLoader {
  fetchType = FetchType.EXISTING

  filterItem(item) {
    return item.existing
  }
}

class ItemLoaderPublic extends ItemLoaderExisting {
  fetchType = FetchType.PUBLIC
}

export const itemLoaderAny = new ItemLoaderAny()
export const itemLoaderNew = new ItemLoaderNew()
export const itemLoaderExisting = new ItemLoaderExisting()
export const itemLoaderPublic = new ItemLoaderPublic()
