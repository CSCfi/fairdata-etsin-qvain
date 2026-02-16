const tableToObjects = tableElement => {
  // convert table rows into objects, use table headers as keys
  const labels = Array.from(tableElement.querySelectorAll('th')).map(th => th.textContent.trim())
  const rowElements = Array.from(tableElement.querySelectorAll('tbody tr'))
  const rows = []
  rowElements.forEach(rowElement => {
    const row = {}
    Array.from(rowElement.cells).forEach((td, index) => {
      // when cell has multiple child nodes, join their contents with |
      const content = Array.from(td.childNodes)
        .map(v => v.textContent.trim())
        .filter(v => v)
        .join('|')
      row[labels[index]] = content
    })
    rows.push(row)
  })
  return rows
}

export default tableToObjects
