import createTree from '../../js/utils/createTree'

describe('Create file tree', () => {
  it('should return a object with the folder structure', () => {
    const files = [
      {
        path: 'project_x_FROZEN/Experiment_X/folder4/file_name_5',
        details: { id: 1 },
        title: 'title',
        use_category: 'cat',
        type: 'file',
      },
      {
        path: 'project_x_FROZEN/Experiment_X/file_name_2',
        details: { id: 2 },
        title: 'title',
        use_category: 'cat',
        type: 'file',
      },
      {
        path: 'project_x_FROZEN/Folder2/file_name_1',
        details: { id: 3 },
        title: 'title',
        use_category: 'cat',
        type: 'file',
      },
    ]
    const result = createTree(files)
    expect(result).toEqual([
      {
        name: 'file_name_5',
        path: 'project_x_FROZEN/Experiment_X/folder4/file_name_5',
        details: { id: 1 },
        title: 'title',
        use_category: 'cat',
        type: 'file',
      },
      {
        name: 'file_name_2',
        path: 'project_x_FROZEN/Experiment_X/file_name_2',
        details: { id: 2 },
        title: 'title',
        use_category: 'cat',
        type: 'file',
      },
      {
        name: 'file_name_1',
        path: 'project_x_FROZEN/Folder2/file_name_1',
        details: { id: 3 },
        title: 'title',
        use_category: 'cat',
        type: 'file',
      },
    ])
  })
  it('should return three root files', () => {
    const files = [
      {
        path: 'project_x_FROZEN/Experiment_X/file_name_1',
        details: { id: 1 },
      },
      {
        path: 'amazing/Experiment_X/file_name_2',
        details: { id: 2 },
      },
      {
        path: 'myRootFile/Folder2/file_name_1',
        details: { id: 3 },
      },
      {
        path: 'myRootFile/Folder2',
        details: { id: 4 },
      },
      {
        path: 'myRootFile',
        details: { id: 5 },
      },
      {
        path: 'amazing/Experiment_X',
        details: { id: 6 },
      },
    ]
    const result = createTree(files)
    expect(result.length).toEqual(3)
  })

  it('should contain files names', () => {
    const files = [
      {
        path: 'project_x_FROZEN/Experiment_X/file_name_1',
        details: { id: 1 },
      },
      {
        path: 'amazing/Experiment_X/file_name_2',
        details: { id: 2 },
      },
      {
        path: 'myRootFile/Folder2/file_name_1',
        details: { id: 3 },
      },
      {
        path: 'amazing/Experiment_X',
        details: { id: 4 },
      },
    ]
    const result = createTree(files)
    expect(result[0].name).toEqual('file_name_1')
    expect(result[1].name).toEqual('Experiment_X')
    expect(result[2].name).toEqual('file_name_1')
  })
  it('should have file details', () => {
    const files = [
      {
        path: 'project_x_FROZEN/Experiment_X/file_name_1',
        details: { id: 1 },
      },
    ]
    const result = createTree(files)
    expect(result[0].details).toEqual({ id: 1 })
  })
  it('should work with only folders selected', () => {
    const files = [
      {
        path: 'project_x_FROZEN/Experiment_X/Experiment_Y',
        details: { id: 2 },
      },
      {
        path: 'project_x_FROZEN/Experiment_X',
        details: { id: 1 },
      },
    ]
    const result = createTree(files)
    expect(result[0].details).toEqual({ id: 1 })
  })
})
