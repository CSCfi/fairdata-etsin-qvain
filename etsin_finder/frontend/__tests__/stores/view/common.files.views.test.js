import {
  AddItemsView as AddItemsViewClass,
  SelectedItemsView as SelectedItemsViewClass,
  PublicItemsView as PublicItemsViewClass,
} from '../../../js/stores/view/common.files.views'
import { Directory, File } from '../../../js/stores/view/common.files.items'
import {
  itemLoaderNew,
  itemLoaderAny,
  itemLoaderExisting,
} from '../../../js/stores/view/common.files.loaders'
import Sort from '@/stores/view/common.files.sort'

const AddItemsView = new AddItemsViewClass()
const SelectedItemsView = new SelectedItemsViewClass()
const PublicItemsView = new PublicItemsViewClass()

beforeEach(() => {
  SelectedItemsView.reset()
  AddItemsView.reset()
  PublicItemsView.reset()
  AddItemsView.setDefaultShowLimit(20, 20)
  SelectedItemsView.setDefaultShowLimit(20, 20)
  SelectedItemsView.setHideRemoved(true)
})

const testFilterItemsByName = (view, fileProps = {}) => {
  // filtering should be case insensitive
  const dir = Directory(
    {},
    {
      identifier: 'x',
      directories: [],
      files: [
        File({ file_name: 'AB' }, { index: { name: 0 }, ...fileProps }),
        File({ file_name: 'bc' }, { index: { name: 1 }, ...fileProps }),
        File({ file_name: 'CD' }, { index: { name: 2 }, ...fileProps }),
      ],
    }
  )
  view.setDirectoryFilter(dir, 'C')
  expect(view.getItems(dir).map(i => i.name)).toEqual(['bc', 'CD'])
}

describe('common.files.AddItemsView', () => {
  it('shows new items', async () => {
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
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
              added: false,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 1,
            }
          ),
        ],
      }
    )
    const items = AddItemsView.getItems(dir)
    expect(items).toMatchObject([{ index: { name: 0 } }, { index: { name: 1 } }])
  })

  it('does not show added items', async () => {
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
              added: true,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 3,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
              added: false,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 3,
            }
          ),
        ],
      }
    )
    const items = AddItemsView.getItems(dir)
    expect(items).toMatchObject([{ index: { name: 1 } }])
  })

  it('does not show existing items unless they have new child items', async () => {
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
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
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
              index: { name: 2 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 2,
              fileCount: 2,
            }
          ),
        ],
      }
    )
    const items = AddItemsView.getItems(dir)
    expect(items).toMatchObject([{ index: { name: 0 } }, { index: { name: 1 } }])
  })

  it('shows removed items', async () => {
    SelectedItemsView.setHideRemoved(false)
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
              removed: true,
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
        ],
      }
    )
    const items = AddItemsView.getItems(dir)
    expect(items).toMatchObject([{ index: { name: 0 } }, { index: { name: 1 } }])
  })

  it('does not show children of added parent', async () => {
    SelectedItemsView.setDefaultShowLimit(3, 3)
    const dir = Directory(
      {},
      {
        added: true,
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
              fileCount: 3,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 2,
              fileCount: 5,
            }
          ),
        ],
      }
    )
    const items = AddItemsView.getItems(dir)
    expect(items).toEqual([])
  })

  it('shows existing children of removed parent', async () => {
    const dir = Directory(
      {},
      {
        added: false,
        removed: true,
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 2,
            }
          ),
        ],
      }
    )
    const items = AddItemsView.getItems(dir)
    expect(items).toMatchObject([{ index: { name: 0 } }, { index: { name: 1 } }])
  })

  it('shows removed children of added parent', async () => {
    SelectedItemsView.setHideRemoved(true)
    const dir = Directory(
      {},
      {
        added: true,
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
        ],
      }
    )
    const items = AddItemsView.getItems(dir)
    expect(items).toMatchObject([{ index: { name: 1 } }])
  })

  it('does not show item if there may be previous items that should be loaded first ', async () => {
    const dir = Directory(
      {
        added: false,
        removed: false,
      },
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
              fileCount: 10,
            }
          ),
          Directory(
            {},
            {
              index: { name: 2 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 0,
              fileCount: 10,
            }
          ),
        ],
      }
    )
    const items = AddItemsView.getItems(dir)
    expect(items).toMatchObject([{ index: { name: 0 } }])
  })

  it('allows skipping non-loaded item if its known not to be relevant for the view', async () => {
    const dir = Directory(
      {
        added: false,
        removed: false,
      },
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
              fileCount: 10,
            }
          ),
          Directory(
            {},
            {
              index: { name: 2 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 2,
              fileCount: 10,
            }
          ),
        ],
      }
    )
    const paginationKey = itemLoaderNew.getPaginationKey('', new Sort())
    dir.pagination.offsets[paginationKey] = 2
    const items = AddItemsView.getItems(dir)
    expect(items).toMatchObject([{ index: { name: 0 } }, { index: { name: 2 } }])
  })

  it('shows new or removed or existing directories with new children', async () => {
    const dir = Directory(
      {
        added: false,
        removed: false,
      },
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
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
              index: { name: 2 },
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
              index: { name: 3 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 2,
            }
          ),
        ],
      }
    )
    const items = AddItemsView.getItems(dir)
    expect(items).toMatchObject([
      { index: { name: 1 } },
      { index: { name: 2 } },
      { index: { name: 3 } },
    ])
  })

  it('shows directories with removed children', async () => {
    const dir = Directory(
      {
        added: false,
        removed: false,
      },
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 3,
              fileCount: 3,
              removedChildCount: 1,
            }
          ),
        ],
      }
    )
    const items = AddItemsView.getItems(dir)
    expect(items).toMatchObject([{ index: { name: 0 } }])
  })

  it('respects showLimit', async () => {
    AddItemsView.setDefaultShowLimit(3, 3)
    const dir = Directory(
      {
        added: false,
        removed: false,
      },
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
              fileCount: 3,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
              added: true,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 3,
            }
          ),
          Directory(
            {},
            {
              index: { name: 2 },
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
              index: { name: 3 },
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
              index: { name: 4 },
              added: false,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 1,
            }
          ),
        ],
      }
    )
    let items = AddItemsView.getItems(dir)
    expect(items).toMatchObject([
      { index: { name: 0 } },
      { index: { name: 2 } },
      { index: { name: 3 } },
    ])

    AddItemsView.setDefaultShowLimit(5, 5)
    items = AddItemsView.getItems(dir)
    expect(items).toMatchObject([
      { index: { name: 0 } },
      { index: { name: 2 } },
      { index: { name: 3 } },
      { index: { name: 4 } },
    ])
  })

  it('shows files', async () => {
    const dir = Directory(
      {
        added: false,
        removed: false,
      },
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 3,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
        ],
        files: [
          File({}, { index: { name: 2 }, added: false, removed: false, existing: false }),
          File({}, { index: { name: 3 }, added: false, removed: true, existing: true }),
          File({}, { index: { name: 4 }, added: false, removed: false, existing: false }),
        ],
      }
    )
    let items = AddItemsView.getItems(dir)
    expect(items).toMatchObject([
      { index: { name: 0 } },
      { index: { name: 2 } },
      { index: { name: 3 } },
      { index: { name: 4 } },
    ])
  })

  it('uses correct loaders', async () => {
    // If it was visible, added directory should fetch items that aren't in the saved dataset
    const addedDir = Directory(
      {},
      {
        added: true,
        removed: false,
        existing: false,
        parent: {
          added: false,
          removed: false,
        },
      }
    )
    expect(AddItemsView.getItemLoader(addedDir)).toBe(itemLoaderNew)

    const parentAddedDir = Directory(
      {},
      {
        added: false,
        removed: false,
        existing: false,
        parent: {
          added: true,
          removed: false,
        },
      }
    )
    expect(AddItemsView.getItemLoader(parentAddedDir)).toBe(itemLoaderNew)

    const parentRemovedAddedDir = Directory(
      {},
      {
        added: false,
        removed: true,
        existing: false,
        parent: {
          added: true,
          removed: false,
        },
      }
    )
    expect(AddItemsView.getItemLoader(parentRemovedAddedDir)).toBe(itemLoaderNew)

    // Removed existing directory should fetch any items
    const removedExistingDir = Directory(
      {},
      {
        added: false,
        removed: true,
        existing: true,
        parent: {
          added: false,
          removed: false,
        },
      }
    )
    expect(AddItemsView.getItemLoader(removedExistingDir)).toBe(itemLoaderAny)

    const parentAddedRemovedExistingDir = Directory(
      {},
      {
        added: false,
        removed: true,
        existing: true,
        parent: {
          added: true,
          removed: false,
        },
      }
    )
    expect(AddItemsView.getItemLoader(parentAddedRemovedExistingDir)).toBe(itemLoaderAny)

    const parentRemovedExistingDir = Directory(
      {},
      {
        added: false,
        removed: false,
        existing: true,
        parent: {
          added: false,
          removed: true,
        },
      }
    )
    expect(AddItemsView.getItemLoader(parentRemovedExistingDir)).toBe(itemLoaderAny)
  })

  it('filters items by name', () => {
    testFilterItemsByName(AddItemsView)
  })
})

describe('common.files.SelectedItemsView', () => {
  it('shows existing items', async () => {
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
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
        ],
      }
    )
    const items = SelectedItemsView.getItems(dir)
    expect(items).toMatchObject([{ index: { name: 0 } }, { index: { name: 1 } }])
  })

  it('does not show removed items', async () => {
    SelectedItemsView.setHideRemoved(true)
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
        ],
      }
    )
    const items = SelectedItemsView.getItems(dir)
    expect(items).toMatchObject([{ index: { name: 0 } }])
  })

  it('shows removed items', async () => {
    SelectedItemsView.setHideRemoved(false)
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
        ],
      }
    )
    const items = SelectedItemsView.getItems(dir)
    expect(items).toMatchObject([{ index: { name: 0 } }, { index: { name: 1 } }])
  })

  it('does not show existing children of removed parent', async () => {
    SelectedItemsView.setDefaultShowLimit(3, 3)
    const dir = Directory(
      {},
      {
        added: false,
        removed: true,
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
        ],
      }
    )
    const items = SelectedItemsView.getItems(dir)
    expect(items).toEqual([])
  })

  it('shows added items', async () => {
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
              index: { name: 1 },
              added: true,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
        ],
      }
    )
    const items = SelectedItemsView.getItems(dir)
    expect(items).toMatchObject([{ index: { name: 0 } }, { index: { name: 1 } }])
  })

  it('shows added children of removed parent', async () => {
    SelectedItemsView.setHideRemoved(true)
    const dir = Directory(
      {},
      {
        added: false,
        removed: true,
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
              added: true,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
        ],
      }
    )
    const items = SelectedItemsView.getItems(dir)
    expect(items).toMatchObject([{ index: { name: 1 } }])
  })

  it('does not show item if there may be previous items that should be loaded first ', async () => {
    const dir = Directory(
      {
        added: false,
        removed: false,
      },
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
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
              fileCount: 1,
            }
          ),
        ],
      }
    )
    const items = SelectedItemsView.getItems(dir)
    expect(items).toMatchObject([{ index: { name: 0 } }])
  })

  it('allows skipping non-loaded item if its known not to be relevant for the view', async () => {
    const dir = Directory(
      {
        added: false,
        removed: false,
      },
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
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
              fileCount: 1,
            }
          ),
        ],
      }
    )
    const paginationKey = itemLoaderExisting.getPaginationKey('', new Sort())
    dir.pagination.offsets[paginationKey] = 2
    const items = SelectedItemsView.getItems(dir)
    expect(items).toMatchObject([{ index: { name: 0 } }, { index: { name: 2 } }])
  })

  it('shows added or existing directories', async () => {
    const dir = Directory(
      {
        added: false,
        removed: false,
      },
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
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
              index: { name: 1 },
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
              index: { name: 2 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
        ],
      }
    )
    const items = SelectedItemsView.getItems(dir)
    expect(items).toMatchObject([{ index: { name: 0 } }, { index: { name: 2 } }])
  })

  it('shows directories with added children', async () => {
    const dir = Directory(
      {
        added: false,
        removed: false,
      },
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
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
              index: { name: 1 },
              added: false,
              removed: false,
              existing: false,
              existingFileCount: 1,
              fileCount: 1,
              addedChildCount: 1,
            }
          ),
        ],
      }
    )
    const items = SelectedItemsView.getItems(dir)
    expect(items).toMatchObject([{ index: { name: 0 } }, { index: { name: 1 } }])
  })

  it('respects showLimit', async () => {
    SelectedItemsView.setDefaultShowLimit(3, 3)
    const dir = Directory(
      {
        added: false,
        removed: false,
      },
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
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
              index: { name: 1 },
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
              index: { name: 2 },
              added: true,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 3 },
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
              index: { name: 4 },
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
    let items = SelectedItemsView.getItems(dir)
    expect(items).toMatchObject([
      { index: { name: 0 } },
      { index: { name: 2 } },
      { index: { name: 3 } },
    ])

    SelectedItemsView.setDefaultShowLimit(5, 5)
    items = SelectedItemsView.getItems(dir)
    expect(items).toMatchObject([
      { index: { name: 0 } },
      { index: { name: 2 } },
      { index: { name: 3 } },
      { index: { name: 4 } },
    ])
  })

  it('shows files', async () => {
    const dir = Directory(
      {
        added: false,
        removed: false,
      },
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
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
              index: { name: 1 },
              added: false,
              removed: false,
              existing: false,
              existingFileCount: 0,
              fileCount: 1,
            }
          ),
        ],
        files: [
          File({}, { index: { name: 2 }, added: true, removed: false, existing: true }),
          File({}, { index: { name: 3 }, added: false, removed: false, existing: true }),
          File({}, { index: { name: 4 }, added: true, removed: false, existing: false }),
        ],
      }
    )
    let items = SelectedItemsView.getItems(dir)
    expect(items).toMatchObject([
      { index: { name: 0 } },
      { index: { name: 2 } },
      { index: { name: 3 } },
      { index: { name: 4 } },
    ])
  })

  it('uses correct loaders', async () => {
    // Newly added directory should fetch items that aren't in the saved dataset
    const addedDir = Directory(
      {},
      {
        added: false,
        removed: false,
        existing: false,
        parent: {
          added: true,
          removed: false,
        },
      }
    )
    expect(SelectedItemsView.getItemLoader(addedDir)).toBe(itemLoaderNew)

    const parentRemovedAddedDir = Directory(
      {},
      {
        added: true,
        removed: false,
        existing: false,
        parent: {
          added: false,
          removed: true,
        },
      }
    )
    expect(SelectedItemsView.getItemLoader(parentRemovedAddedDir)).toBe(itemLoaderNew)

    const parentAddedDir = Directory(
      {},
      {
        added: false,
        removed: false,
        existing: false,
        parent: {
          added: true,
          removed: false,
        },
      }
    )
    expect(SelectedItemsView.getItemLoader(parentAddedDir)).toBe(itemLoaderNew)

    // Existing directory that has been added again should fetch both existing and new items
    const existingAddedDir = Directory(
      {},
      {
        added: true,
        removed: false,
        existing: true,
        parent: {
          added: false,
          removed: false,
        },
      }
    )
    expect(SelectedItemsView.getItemLoader(existingAddedDir)).toBe(itemLoaderAny)

    const existingParentAddedDir = Directory(
      {},
      {
        added: false,
        removed: false,
        existing: true,
        parent: {
          added: true,
          removed: false,
        },
      }
    )
    expect(SelectedItemsView.getItemLoader(existingParentAddedDir)).toBe(itemLoaderAny)

    // Existing directory should fetch existing items
    const existingDir = Directory(
      {},
      {
        added: false,
        removed: false,
        existing: true,
        parent: {
          added: false,
          removed: false,
        },
      }
    )
    expect(SelectedItemsView.getItemLoader(existingDir)).toBe(itemLoaderExisting)

    // If shown, removed directory should fetch only existing items
    const removedDir = Directory(
      {},
      {
        added: false,
        removed: true,
        existing: true,
        parent: {
          added: false,
          removed: false,
        },
      }
    )
    expect(SelectedItemsView.getItemLoader(removedDir)).toBe(itemLoaderExisting)

    const parentAddedRemovedDir = Directory(
      {},
      {
        added: false,
        removed: true,
        existing: true,
        parent: {
          added: true,
          removed: false,
        },
      }
    )
    expect(SelectedItemsView.getItemLoader(parentAddedRemovedDir)).toBe(itemLoaderExisting)
  })

  it('filters items by name', () => {
    testFilterItemsByName(SelectedItemsView, { existing: true })
  })
})

describe('common.files.PublicItemsView', () => {
  it('shows existing items', async () => {
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
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
        ],
      }
    )
    const items = PublicItemsView.getItems(dir)
    expect(items).toMatchObject([{ index: { name: 0 } }, { index: { name: 1 } }])
  })

  it('does not show item if there may be previous items that should be loaded first ', async () => {
    const dir = Directory(
      {
        added: false,
        removed: false,
      },
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: false,
              removed: false,
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
              fileCount: 1,
            }
          ),
        ],
      }
    )
    const items = PublicItemsView.getItems(dir)
    expect(items).toMatchObject([{ index: { name: 0 } }])
  })

  it('respects showLimit', async () => {
    PublicItemsView.setDefaultShowLimit(3, 3)
    const dir = Directory(
      {
        added: false,
        removed: false,
      },
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: true,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 2 },
              added: true,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 3 },
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
              index: { name: 4 },
              added: true,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 3,
            }
          ),
        ],
      }
    )
    let items = PublicItemsView.getItems(dir)
    expect(items).toMatchObject([
      { index: { name: 0 } },
      { index: { name: 1 } },
      { index: { name: 2 } },
    ])

    PublicItemsView.setDefaultShowLimit(5, 5)
    items = PublicItemsView.getItems(dir)

    expect(items).toMatchObject([
      { index: { name: 0 } },
      { index: { name: 1 } },
      { index: { name: 2 } },
      { index: { name: 3 } },
      { index: { name: 4 } },
    ])
  })

  it('shows files', async () => {
    const dir = Directory(
      {
        added: false,
        removed: false,
      },
      {
        directories: [
          Directory(
            {},
            {
              index: { name: 0 },
              added: true,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 1,
            }
          ),
          Directory(
            {},
            {
              index: { name: 1 },
              added: false,
              removed: false,
              existing: true,
              existingFileCount: 1,
              fileCount: 3,
            }
          ),
        ],
        files: [
          File({}, { index: { name: 2 }, added: true, removed: false, existing: true }),
          File({}, { index: { name: 3 }, added: false, removed: false, existing: true }),
          File({}, { index: { name: 4 }, added: true, removed: false, existing: true }),
        ],
      }
    )
    let items = PublicItemsView.getItems(dir)
    expect(items).toMatchObject([
      { index: { name: 0 } },
      { index: { name: 1 } },
      { index: { name: 2 } },
      { index: { name: 3 } },
      { index: { name: 4 } },
    ])
  })

  it('filters items by name', () => {
    testFilterItemsByName(PublicItemsView, { existing: true })
  })
})
