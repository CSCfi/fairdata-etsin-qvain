 
import { observable, runInAction, when } from 'mobx'

import { Directory, File } from '../../../js/stores/view/common.files.items'
import Sort from '@/stores/view/common.files.sort'
import {
  itemLoaderNew,
  itemLoaderAny,
  itemLoaderExisting,
  itemLoaderPublic,
} from '../../../js/stores/view/common.files.loaders'

const testFilterItemsByName = (loader, fileProps = {}) => {
  // filtering should be case insensitive
  const dir = Directory(
    {},
    {
      identifier: 'x',
      directories: [],
      files: [
        File({ file_name: 'ABC' }, { index: { name: 0 }, ...fileProps }),
        File({ file_name: 'bcd' }, { index: { name: 1 }, ...fileProps }),
        File({ file_name: 'CDE' }, { index: { name: 2 }, ...fileProps }),
        File({ file_name: 'def' }, { index: { name: 3 }, ...fileProps }),
        File({ file_name: 'EFG' }, { index: { name: 4 }, ...fileProps }),
      ],
    }
  )
  expect(loader.getOffset({ dir, filter: 'D', sort: new Sort() })).toBe(3)
}

describe('common.files.ItemLoaderPublic', () => {
  it('counts existing directories until a nonloaded one is encountered', async () => {
    const dir = Directory(
      {},
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
              added: false,
              removed: true,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 2 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 2,
            }
          ),
          Directory(
            {},
            {
              index: { name: 3 },
              added: true,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 5 },
              added: true,
              removed: false,
              existing: true,
              existingFileCount: 3,
              fileCount: 3,
            }
          ),
        ],
      }
    )
    expect(itemLoaderPublic.getOffset({ dir, sort: new Sort() })).toBe(2)

    // 'load' missing directory
    dir.directories.splice(
      4,
      0,
      Directory(
        {},
        {
          index: { name: 4 },
          added: false,
          removed: false,
          existing: false,
          existingFileCount: 0,
          fileCount: 1,
        }
      )
    )
    expect(itemLoaderPublic.getOffset({ dir, sort: new Sort() })).toBe(3)
  })

  it('counts files', async () => {
    const dir = Directory(
      {},
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 2,
              fileCount: 2,
            }
          ),
        ],
        files: [
          File({}, { index: { name: 1 }, added: false, removed: false, existing: false }),
          File({}, { index: { name: 2 }, added: false, removed: false, existing: true }),
        ],
      }
    )
    expect(itemLoaderPublic.getOffset({ dir, sort: new Sort() })).toBe(2)
  })

  it('uses cached offset', async () => {
    const dir = Directory(
      {},
      {
        added: false,
        removed: false,
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 2,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
              added: false,
              removed: true,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 5 },
              added: true,
              removed: false,
              existing: true,
              existingFileCount: 0,
              fileCount: 1,
            }
          ),
        ],
      }
    )
    const sort = new Sort()
    expect(itemLoaderPublic.getOffset({ dir, sort })).toBe(2)
    const paginationKey = itemLoaderPublic.getPaginationKey('', sort)
    dir.pagination.offsets[paginationKey] = 4
    expect(itemLoaderPublic.getOffset({ dir, sort })).toBe(4)
  })

  it('filters items by name when determining offset', () => {
    testFilterItemsByName(itemLoaderPublic, { existing: true })
  })
})

describe('common.files.ItemLoaderAny', () => {
  it('counts all directories until a nonloaded one is encountered', async () => {
    const dir = Directory(
      {},
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
              added: false,
              removed: true,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 2 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 2,
            }
          ),
          Directory(
            {},
            {
              index: { name: 3 },
              added: true,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 5 },
              added: true,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 1,
            }
          ),
        ],
      }
    )
    expect(itemLoaderAny.getOffset({ dir, sort: new Sort() })).toBe(4)

    // 'load' missing directory
    dir.directories.splice(
      4,
      0,
      Directory(
        {},
        {
          index: { name: 4 },
          added: true,
          removed: false,
          existing: false,
          existingFileCount: 0,
          fileCount: 1,
        }
      )
    )
    expect(itemLoaderAny.getOffset({ dir, sort: new Sort() })).toBe(6)
  })

  it('counts files', async () => {
    const dir = Directory(
      {},
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 1,
            }
          ),
        ],
        files: [
          File({}, { index: { name: 1 }, added: false, removed: false, existing: true }),
          File({}, { index: { name: 2 }, added: false, removed: false, existing: false }),
        ],
      }
    )
    expect(itemLoaderAny.getOffset({ dir, sort: new Sort() })).toBe(3)
  })

  it('uses cached offset', async () => {
    const dir = Directory(
      {},
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
              added: false,
              removed: true,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 5 },
              added: true,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 1,
            }
          ),
        ],
      }
    )
    const sort = new Sort()
    expect(itemLoaderAny.getOffset({ dir, sort })).toBe(2)
    const paginationKey = itemLoaderAny.getPaginationKey('', sort)
    dir.pagination.offsets[paginationKey] = 3
    expect(itemLoaderAny.getOffset({ dir, sort })).toBe(3)
  })

  it('filters items by name when determining offset', () => {
    testFilterItemsByName(itemLoaderAny)
  })
})

describe('common.files.ItemLoaderExisting', () => {
  it('counts existing directories until a nonloaded one is encountered', async () => {
    const dir = Directory(
      {},
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
              added: false,
              removed: true,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 2 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 2,
            }
          ),
          Directory(
            {},
            {
              index: { name: 3 },
              added: true,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 5 },
              added: true,
              removed: false,
              existing: true,
              existingFileCount: 3,
              fileCount: 3,
            }
          ),
        ],
      }
    )
    expect(itemLoaderExisting.getOffset({ dir, sort: new Sort() })).toBe(2)

    // 'load' missing directory
    dir.directories.splice(
      4,
      0,
      Directory(
        {},
        {
          index: { name: 4 },
          added: false,
          removed: false,
          existing: false,
          existingFileCount: 0,
          fileCount: 1,
        }
      )
    )
    expect(itemLoaderExisting.getOffset({ dir, sort: new Sort() })).toBe(3)
  })

  it('counts files', async () => {
    const dir = Directory(
      {},
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 2,
              fileCount: 2,
            }
          ),
        ],
        files: [
          File({}, { index: { name: 1 }, added: false, removed: false, existing: false }),
          File({}, { index: { name: 2 }, added: false, removed: false, existing: true }),
        ],
      }
    )
    expect(itemLoaderExisting.getOffset({ dir, sort: new Sort() })).toBe(2)
  })

  it('uses cached offset', async () => {
    const dir = Directory(
      {},
      {
        added: false,
        removed: false,
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 2,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
              added: false,
              removed: true,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 5 },
              added: true,
              removed: false,
              existing: true,
              existingFileCount: 0,
              fileCount: 1,
            }
          ),
        ],
      }
    )
    const sort = new Sort()
    expect(itemLoaderExisting.getOffset({ dir, sort })).toBe(2)
    const paginationKey = itemLoaderExisting.getPaginationKey('', sort)
    dir.pagination.offsets[paginationKey] = 4
    expect(itemLoaderExisting.getOffset({ dir, sort })).toBe(4)
  })

  it('filters items by name when determining offset', () => {
    testFilterItemsByName(itemLoaderExisting, { existing: true })
  })
})

describe('common.files.ItemLoaderNew', () => {
  it('counts new directories until a nonloaded one is encountered', async () => {
    const dir = Directory(
      {},
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
              added: false,
              removed: true,
              existing: false,
              existingFileCount: 0,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 2 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 2,
            } // has new children
          ),
          Directory(
            {},
            {
              index: { name: 3 },
              added: true,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            } // no new children
          ),
          Directory(
            {},
            {
              index: { name: 6 },
              added: true,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 3,
            }
          ),
        ],
      }
    )
    expect(itemLoaderNew.getOffset({ dir, sort: new Sort() })).toBe(3)

    // 'load' missing directory
    dir.directories.splice(
      4,
      0,
      Directory(
        {},
        {
          index: { name: 4 },
          added: false,
          removed: false,
          existing: false,
          existingFileCount: 0,
          fileCount: 1,
        }
      ),
      Directory(
        {},
        {
          index: { name: 5 },
          added: false,
          removed: false,
          existing: true,
          existingFileCount: 1,
          fileCount: 1,
        }
      )
    )
    expect(itemLoaderNew.getOffset({ dir, sort: new Sort() })).toBe(5)
  })

  it('counts files', async () => {
    const dir = Directory(
      {},
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 2,
            }
          ),
        ],
        files: [
          File({}, { index: { name: 1 }, added: false, removed: false, existing: false }),
          File({}, { index: { name: 2 }, added: false, removed: true, existing: true }),
        ],
      }
    )
    expect(itemLoaderNew.getOffset({ dir, sort: new Sort() })).toBe(2)
  })

  it('uses cached offset', async () => {
    const dir = Directory(
      {},
      {
        added: false,
        removed: false,
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 2,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
              added: false,
              removed: true,
              existing: true,
              existingFileCount: 1,
              fileCount: 2,
            }
          ),
          Directory(
            {},
            {
              index: { name: 2 },
              added: false,
              removed: true,
              existing: true,
              existingFileCount: 2,
              fileCount: 2,
            }
          ),
          Directory(
            {},
            {
              index: { name: 5 },
              added: true,
              removed: false,
              existing: true,
              existingFileCount: 0,
              fileCount: 1,
            }
          ),
        ],
      }
    )
    const sort = new Sort()
    expect(itemLoaderNew.getOffset({ dir, sort })).toBe(2)
    const paginationKey = itemLoaderNew.getPaginationKey('', sort)
    dir.pagination.offsets[paginationKey] = 4
    expect(itemLoaderNew.getOffset({ dir, sort })).toBe(4)
  })

  it('filters items by name when determining offset', () => {
    testFilterItemsByName(itemLoaderNew)
  })
})

describe('common.files.ItemLoader', () => {
  it('waits until directory is no longer loading', async () => {
    const dir = observable({
      loading: true,
    })
    const Files = {
      cancelOnReset: async promise => {
        await promise
      },
    }

    let resolves = 0
    const wait = async () => {
      await itemLoaderNew.getLoadingLock(Files, dir, () => {
        resolves += 1
      })
    }

    wait()
    wait()
    wait()
    expect(resolves).toBe(0)

    runInAction(() => (dir.loading = false))
    await when(() => dir.loading)
    expect(resolves).toBe(1)

    runInAction(() => (dir.loading = false))
    await when(() => dir.loading)
    expect(resolves).toBe(2)

    runInAction(() => (dir.loading = false))
    await when(() => dir.loading)
    expect(resolves).toBe(3)
  })
})
