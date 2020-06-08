export const filterGroupsByTitle = (searchStr, groups) => {
  if (searchStr.trim().length > 0) {
    return groups
      .map((group) => filterByTitle(searchStr, group))
      .filter((group) => group.length > 0)
  }
  return groups
}

export const filterByTitle = (searchStr, datasets) => (
  searchStr.trim().length > 0
    ? datasets.filter((ds) => {
      const titles = Object.values(ds.research_dataset.title)
      const matches = titles.map((title) =>
        title.toLowerCase().includes(searchStr.toLowerCase())
      ) // ignore cases
      return matches.includes(true)
    })
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
