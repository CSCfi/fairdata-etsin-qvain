export const separatorOptions = [
  { value: 'LF', label: 'LF' },
  { value: 'CRLF', label: 'CRLF' },
  { value: 'CR', label: 'CR' },
]

export const delimiterOptions = [
  { value: '\t', label: 'Tab' },
  { value: ' ', label: 'Space' },
  { value: ';', label: 'Semicolon ;' },
  { value: ',', label: 'Comma ,' },
  { value: ':', label: 'Colon :' },
  { value: '.', label: 'Dot .' },
  { value: '|', label: 'Pipe |' },
]

export const encodingOptions = [
  { value: 'UTF-8', label: 'UTF-8' },
  { value: 'UTF-16', label: 'UTF-16' },
  { value: 'UTF-32', label: 'UTF-32' },
  { value: 'ISO-8859-15', label: 'ISO-8859-15' },
]

export const hasheaderOptions = [
  { value: false, label: 'No' },
  { value: true, label: 'Yes' },
]

export const getDefaultOptions = () => ({
  fileFormat: 'text/csv',
  formatVersion: '',
  encoding: 'UTF-8',
  csvDelimiter: ',',
  csvRecordSeparator: 'LF',
  csvQuotingChar: ',',
  csvHasHeader: true,
})

// Turn a plain value into an option object for react-select
export const makeOption = (value) => (
  value ? { value, label: value } : null
)

// Find option object by value
export const findOption = (value, options) => (
  options.find(v => v.value === value)
)
