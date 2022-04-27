import {
  filter,
  filterGroups,
  groupDatasetsByVersionSet,
} from '../../../js/stores/view/qvain/qvain.datasets.filters'

describe('Qvain dataset list filtering', () => {
  const datasets = [
    {
      identifier: '1',
      research_dataset: {
        title: { en: 'Dataset', fi: 'Aineisto' },
        preferred_identifier: 'doi:1234/4567.89',
      },
      state: 'published',
    },
    {
      identifier: '2',
      research_dataset: {
        title: { en: 'Version 1 of Dataset Versions' },
        preferred_identifier: 'doi:1234/4500.000',
      },
      dataset_version_set: [{ identifier: '2' }, { identifier: '3' }, { identifier: '4' }],
      state: 'published',
    },
    {
      identifier: '3',
      research_dataset: {
        title: { en: 'Version 2, Dataset' },
      },
      dataset_version_set: [{ identifier: '2' }, { identifier: '3' }, { identifier: '4' }],
      state: 'published',
    },
    {
      identifier: '5',
      research_dataset: {
        title: { en: 'Another Dataset' },
      },
      state: 'published',
    },
    {
      identifier: '4',
      research_dataset: {
        title: { en: 'Version 3', fi: 'Aineiston versio 3' },
      },
      dataset_version_set: [{ identifier: '2' }, { identifier: '3' }, { identifier: '4' }],
      state: 'published',
    },
    {
      identifier: '6aaf-ffaa',
      research_dataset: {
        title: { en: 'This is published' },
      },
      next_draft: {
        research_dataset: {
          title: { en: 'These are unpublished changes' },
        },
      },
      state: 'draft',
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
    expect(filterGroups('Dataset', groups)).toEqual([[dataset], versions, [dataset2]])
  })

  it('filters datasets by title in any language', () => {
    expect(filter('Aineisto', datasets)).toEqual([dataset, datasets[4]])
    expect(filter('Version', datasets)).toEqual(versions)
  })

  it('filters datasets by both original title and changed title', () => {
    expect(filter('unpublished changes', datasets)).toEqual([dataset3])
    expect(filter('is published', datasets)).toEqual([dataset3])
  })

  it('filters dataset groups by title in any language', () => {
    const groups = groupDatasetsByVersionSet(datasets)
    expect(filterGroups('Aineisto', groups)).toEqual([[dataset], versions])
  })

  it('filters datasets by identifier', () => {
    expect(filter('6aaf-ffaa', datasets)).toEqual([dataset3])
  })

  it('filters datasets by preferred_identifier', () => {
    expect(filter('1234/45', datasets)).toEqual([dataset, versions[0]])
    expect(filter('1234/4567', datasets)).toEqual([dataset])
  })

  it('ignores case when filtering by title', () => {
    expect(filter('dataset', datasets)).toEqual([dataset, datasets[1], datasets[2], dataset2])
  })
})
