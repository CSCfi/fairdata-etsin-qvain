const filterFunc = (searchStr, dataset) => {
  const titles = Object.values(dataset.research_dataset.title)
  const matches = titles.map((title) =>
    title.toLowerCase().includes(searchStr.toLowerCase())
  ) // ignore cases
  return matches.includes(true)
}

export const filterGroupsByTitle = (searchStr, groups) => {
  // return all groups where there is at least one match
  if (searchStr.trim().length > 0) {
    return groups.filter((group) => group.some(dataset => filterFunc(searchStr, dataset)))
  }
  return groups
}

export const filterByTitle = (searchStr, datasets) => (
  searchStr.trim().length > 0
    ? datasets.filter(dataset => filterFunc(searchStr, dataset))
    : datasets
)

export const groupDatasetsByVersionSet = (datasets) => {
  const groups = []
  const groupByIdentifier = {}
  datasets.forEach((dataset) => {
    const versionSet = dataset.dataset_version_set || [{ identifier: dataset.identifier }]
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
