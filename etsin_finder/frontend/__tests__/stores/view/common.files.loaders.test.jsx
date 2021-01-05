import { observable, runInAction, when } from 'mobx'

import { Directory, File } from '../../../js/stores/view/common.files.items'
import {
  itemLoaderNew,
  itemLoaderAny,
  itemLoaderExisting,
  itemLoaderPublic,
} from '../../../js/stores/view/common.files.loaders'

describe('common.files.ItemLoaderPublic', () => {
  it('counts existing directories until a nonloaded one is encountered', async () => {
    const dir = Directory(
      {},
      {
        directories: [
          Directory(
            {},
            {
              index: 0,
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
              index: 1,
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
              index: 2,
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
              index: 3,
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
              index: 5,
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
    expect(itemLoaderPublic.getOffset(dir)).toBe(2)

    // 'load' missing directory
    dir.directories.splice(
      4,
      0,
      Directory(
        {},
        {
          index: 4,
          added: false,
          removed: false,
          existing: false,
          existingFileCount: 0,
          fileCount: 1,
        }
      )
    )
    expect(itemLoaderPublic.getOffset(dir)).toBe(3)
  })

  it('counts files', async () => {
    const dir = Directory(
      {},
      {
        directories: [
          Directory(
            {},
            {
              index: 0,
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 2,
              fileCount: 2,
            }
          ),
        ],
        files: [
          File({}, { index: 1, added: false, removed: false, existing: false }),
          File({}, { index: 2, added: false, removed: false, existing: true }),
        ],
      }
    )
    expect(itemLoaderPublic.getOffset(dir)).toBe(2)
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
              index: 0,
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
              index: 1,
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
              index: 5,
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
    expect(itemLoaderPublic.getOffset(dir)).toBe(2)
    const paginationKey = itemLoaderPublic.getPaginationKey('')
    dir.pagination.offsets[paginationKey] = 4
    expect(itemLoaderPublic.getOffset(dir)).toBe(4)
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
              index: 0,
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
              index: 1,
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
              index: 2,
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
              index: 3,
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
              index: 5,
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
    expect(itemLoaderAny.getOffset(dir)).toBe(4)

    // 'load' missing directory
    dir.directories.splice(
      4,
      0,
      Directory(
        {},
        {
          index: 4,
          added: true,
          removed: false,
          existing: false,
          existingFileCount: 0,
          fileCount: 1,
        }
      )
    )
    expect(itemLoaderAny.getOffset(dir)).toBe(6)
  })

  it('counts files', async () => {
    const dir = Directory(
      {},
      {
        directories: [
          Directory(
            {},
            {
              index: 0,
              added: false,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 1,
            }
          ),
        ],
        files: [
          File({}, { index: 1, added: false, removed: false, existing: true }),
          File({}, { index: 2, added: false, removed: false, existing: false }),
        ],
      }
    )
    expect(itemLoaderAny.getOffset(dir)).toBe(3)
  })

  it('uses cached offset', async () => {
    const dir = Directory(
      {},
      {
        directories: [
          Directory(
            {},
            {
              index: 0,
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
              index: 1,
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
              index: 5,
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
    expect(itemLoaderAny.getOffset(dir)).toBe(2)
    const paginationKey = itemLoaderAny.getPaginationKey('')
    dir.pagination.offsets[paginationKey] = 3
    expect(itemLoaderAny.getOffset(dir)).toBe(3)
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
              index: 0,
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
              index: 1,
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
              index: 2,
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
              index: 3,
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
              index: 5,
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
    expect(itemLoaderExisting.getOffset(dir)).toBe(2)

    // 'load' missing directory
    dir.directories.splice(
      4,
      0,
      Directory(
        {},
        {
          index: 4,
          added: false,
          removed: false,
          existing: false,
          existingFileCount: 0,
          fileCount: 1,
        }
      )
    )
    expect(itemLoaderExisting.getOffset(dir)).toBe(3)
  })

  it('counts files', async () => {
    const dir = Directory(
      {},
      {
        directories: [
          Directory(
            {},
            {
              index: 0,
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 2,
              fileCount: 2,
            }
          ),
        ],
        files: [
          File({}, { index: 1, added: false, removed: false, existing: false }),
          File({}, { index: 2, added: false, removed: false, existing: true }),
        ],
      }
    )
    expect(itemLoaderExisting.getOffset(dir)).toBe(2)
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
              index: 0,
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
              index: 1,
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
              index: 5,
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
    expect(itemLoaderExisting.getOffset(dir)).toBe(2)
    const paginationKey = itemLoaderExisting.getPaginationKey('')
    dir.pagination.offsets[paginationKey] = 4
    expect(itemLoaderExisting.getOffset(dir)).toBe(4)
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
              index: 0,
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
              index: 1,
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
              index: 2,
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
              index: 3,
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
              index: 6,
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
    expect(itemLoaderNew.getOffset(dir)).toBe(3)

    // 'load' missing directory
    dir.directories.splice(
      4,
      0,
      Directory(
        {},
        {
          index: 4,
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
          index: 5,
          added: false,
          removed: false,
          existing: true,
          existingFileCount: 1,
          fileCount: 1,
        }
      )
    )
    expect(itemLoaderNew.getOffset(dir)).toBe(5)
  })

  it('counts files', async () => {
    const dir = Directory(
      {},
      {
        directories: [
          Directory(
            {},
            {
              index: 0,
              added: false,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 2,
            }
          ),
        ],
        files: [
          File({}, { index: 1, added: false, removed: false, existing: false }),
          File({}, { index: 2, added: false, removed: true, existing: true }),
        ],
      }
    )
    expect(itemLoaderNew.getOffset(dir)).toBe(2)
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
              index: 0,
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
              index: 1,
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
              index: 2,
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
              index: 5,
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
    expect(itemLoaderNew.getOffset(dir)).toBe(2)
    const paginationKey = itemLoaderNew.getPaginationKey('')
    dir.pagination.offsets[paginationKey] = 4
    expect(itemLoaderNew.getOffset(dir)).toBe(4)
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
