const filterFunc = (searchStr, dataset) => {
  // filter dataset by title, identifier or preferred_identifier
  const titles = Object.values(dataset.research_dataset.title || []).map(title =>
    title.toLowerCase()
  )

  const identifiers = [dataset.identifier || '']
  if (dataset.state === 'published') {
    identifiers.push(dataset.research_dataset.preferred_identifier || '')
  }

  const matches = [...titles, ...identifiers].some(str => str.includes(searchStr.toLowerCase()))
  return (
    matches || (dataset.next_draft?.research_dataset && filterFunc(searchStr, dataset.next_draft))
  )
}

export const filterGroups = (searchStr, groups) => {
  // return all groups where there is at least one match
  if (searchStr.trim().length > 0) {
    return groups.filter(group => group.some(dataset => filterFunc(searchStr, dataset)))
  }
  return groups
}

export const filter = (searchStr, datasets) =>
  searchStr.trim().length > 0
    ? datasets.filter(dataset => filterFunc(searchStr, dataset))
    : datasets

export const groupDatasetsByVersionSet = datasets => {
  const groups = []
  const groupByIdentifier = {}
  datasets.forEach(dataset => {
    const versionSet = dataset.dataset_version_set || [{ identifier: dataset.identifier || dataset.id }]
    let group = groupByIdentifier[dataset.identifier]
    if (!group) {
      group = []
      groups.push(group)
      for (const { identifier } of versionSet) {
        groupByIdentifier[identifier] = group
      }
    }
    group.push(dataset)
  })
  return groups
}
