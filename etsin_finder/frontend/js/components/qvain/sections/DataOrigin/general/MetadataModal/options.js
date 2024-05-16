import translate from 'counterpart'

export const getOptions = () => ({
  separator: [
    { value: 'LF', label: 'LF' },
    { value: 'CRLF', label: 'CRLF' },
    { value: 'CR', label: 'CR' },
  ],
  delimiter: [
    { value: '\t', label: translate('qvain.files.metadataModal.options.delimiter.tab') },
    { value: ' ', label: translate('qvain.files.metadataModal.options.delimiter.space') },
    { value: ';', label: translate('qvain.files.metadataModal.options.delimiter.semicolon') },
    { value: ',', label: translate('qvain.files.metadataModal.options.delimiter.comma') },
    { value: ':', label: translate('qvain.files.metadataModal.options.delimiter.colon') },
    { value: '.', label: translate('qvain.files.metadataModal.options.delimiter.dot') },
    { value: '|', label: translate('qvain.files.metadataModal.options.delimiter.pipe') },
  ],
  encoding: [
    { value: 'UTF-8', label: 'UTF-8' },
    { value: 'UTF-16', label: 'UTF-16' },
    { value: 'UTF-32', label: 'UTF-32' },
    { value: 'ISO-8859-15', label: 'ISO-8859-15' },
  ],
  hasHeader: [
    { value: false, label: translate('qvain.files.metadataModal.options.header.false') },
    { value: true, label: translate('qvain.files.metadataModal.options.header.true') },
  ],
})

// Turn a plain value into an option object for react-select
export const makeOption = value => (value ? { value, label: value } : null)

// Find option object by value
export const findOption = (value, options) => options.find(v => v.value === value)
