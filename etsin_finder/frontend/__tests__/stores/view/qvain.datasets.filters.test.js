import {
  filterByTitle,
  filterGroupsByTitle,
  groupDatasetsByVersionSet,
} from '../../../js/stores/view/qvain/qvain.datasets.filters'

describe('Qvain dataset list filtering', () => {
  const datasets = [
    {
      identifier: '1',
      research_dataset: {
        title: { en: 'Dataset', fi: 'Aineisto' },
      },
    },
    {
      identifier: '2',
      research_dataset: {
        title: { en: 'Version 1 of Dataset Versions' },
      },
      dataset_version_set: [{ identifier: '2' }, { identifier: '3' }, { identifier: '4' }],
    },
    {
      identifier: '3',
      research_dataset: {
        title: { en: 'Version 2, Dataset' },
      },
      dataset_version_set: [{ identifier: '2' }, { identifier: '3' }, { identifier: '4' }],
    },
    {
      identifier: '5',
      research_dataset: {
        title: { en: 'Another Dataset' },
      },
    },
    {
      identifier: '4',
      research_dataset: {
        title: { en: 'Version 3', fi: 'Aineiston versio 3' },
      },
      dataset_version_set: [{ identifier: '2' }, { identifier: '3' }, { identifier: '4' }],
    },
    {
      identifier: '6',
      research_dataset: {
        title: { en: 'This is published' },
      },
      next_draft: {
        research_dataset: {
          title: { en: 'These are unpublished changes' },
        },
      },
    },
  ]

  const dataset = datasets[0]
  const versions = [datasets[1], datasets[2], datasets[4]]
  const dataset2 = datasets[3]
  const dataset3 = datasets[5]

  it('groups datasets by version set', () => {
    const groups = groupDatasetsByVersionSet(datasets)
    expect(groups).toEqual([[dataset], versions, [dataset2], [dataset3]])
  })

  it('filters dataset groups by title', () => {
    const groups = groupDatasetsByVersionSet(datasets)
    expect(filterGroupsByTitle('Dataset', groups)).toEqual([[dataset], versions, [dataset2]])
  })

  it('filters datasets by title in any language', () => {
    expect(filterByTitle('Aineisto', datasets)).toEqual([dataset, datasets[4]])
    expect(filterByTitle('Version', datasets)).toEqual(versions)
  })

  it('filters datasets by both original title and changed title', () => {
    expect(filterByTitle('unpublished changes', datasets)).toEqual([dataset3])
    expect(filterByTitle('is published', datasets)).toEqual([dataset3])
  })

  it('filters dataset groups by title in any language', () => {
    const groups = groupDatasetsByVersionSet(datasets)
    expect(filterGroupsByTitle('Aineisto', groups)).toEqual([[dataset], versions])
  })

  it('ignores case when filtering by title', () => {
    expect(filterByTitle('dataset', datasets)).toEqual([
      dataset,
      datasets[1],
      datasets[2],
      dataset2,
    ])
  })
})
