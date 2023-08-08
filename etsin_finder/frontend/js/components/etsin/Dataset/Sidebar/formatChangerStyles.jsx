import etsinTheme from '@/styles/theme'

const versionChangerStyles = () => ({
  // the dropdown button area (includes valueContainer + dropdownIndicator)
  control: baseStyles => ({
    ...baseStyles,
    border: 'none',
  }),
  // the container of currently selected label (includes singleValue)
  valueContainer: baseStyles => ({
    ...baseStyles,
    justifyContent: 'center',
  }),
  // the selected value label text
  singleValue: baseStyles => ({
    ...baseStyles,
    paddingLeft: '1em',
    color: etsinTheme.color.primaryLight,
  }),
  // separator between valuecontainer and dropdownIndicator
  indicatorSeparator: () => ({ display: 'none' }),
  // the chevron
  dropdownIndicator: baseStyles => ({
    ...baseStyles,
    color: etsinTheme.color.primaryLight,
    ':hover': {},
  }),
  // the container for options
  menuList: baseStyles => ({
    ...baseStyles,
    padding: '0',
    marginTop: '-8px',
  }),
  option: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: state.isFocused ? etsinTheme.color.primaryLight : 'white',
    color: etsinTheme.color.primary,
    padding: '0.5em 1em',
    border: state.isFocused ? `2px solid ${etsinTheme.color.primary}` : '2px solid transparent',
    borderRadius: '4px',
    ':hover': {
      background: etsinTheme.color.primaryLight,
    },
  }),
})

export default versionChangerStyles
