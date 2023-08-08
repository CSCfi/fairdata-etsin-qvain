import { darken } from 'polished'
import etsinTheme from '@/styles/theme'

function selectColor(selection) {
  let color
  if (selection.old && !selection.removed) {
    color = etsinTheme.color.yellow
  } else if (selection.removed) {
    color = etsinTheme.color.error
  } else {
    color = etsinTheme.color.success
  }
  return color
}

const versionChangerStyles = selected => ({
  // the dropdown button area (includes valueContainer + dropdownIndicator)
  control: (baseStyles, state) => {
    const selectedBgColor = selectColor(selected)
    return {
      ...baseStyles,
      borderRadius: '0',
      backgroundColor: state.isFocused ? darken(0.1, selectedBgColor) : selectedBgColor,
      border: state.isFocused
        ? `2px solid ${darken(0.1, selectedBgColor)}`
        : '2px solid transparent',
      boxShadow: 'none',
      ':hover': {
        background: darken(0.1, selectedBgColor),
        border: `2px solid ${darken(0.15, selectedBgColor)}`,
      },
    }
  },
  // the container of currently selected label (includes singleValue)
  valueContainer: baseStyles => ({
    ...baseStyles,
    padding: '1em',
  }),
  // the selected value label text
  singleValue: baseStyles => ({
    ...baseStyles,
    color: selected.old ? etsinTheme.color.dark : 'white',
    fontSize: '1.1em',
    fontWeight: 'bold',
  }),
  // separator between valuecontainer and dropdownIndicator
  indicatorSeparator: () => ({ display: 'none' }),
  // the chevron
  dropdownIndicator: baseStyles => ({
    ...baseStyles,
    color: selected.old ? etsinTheme.color.dark : 'white',
    ':hover': {},
  }),
  // the container for options
  menuList: baseStyles => ({
    ...baseStyles,
    borderTop: '1px solid black',
    padding: '0',
    marginTop: '-8px',
  }),
  option: (baseStyles, state) => {
    const optionBgColor = selectColor(state.data)
    return {
      ...baseStyles,
      fontSize: '1.1em',
      fontWeight: 'bold',
      backgroundColor: state.isFocused ? darken(0.1, optionBgColor) : optionBgColor,
      color: state.data.old ? etsinTheme.color.dark : 'white',
      padding: '0.8em 1em',
      border: state.isFocused
        ? `2px solid ${darken(0.15, optionBgColor)}`
        : '2px solid transparent',
      ':hover': {
        background: darken(0.1, optionBgColor),
      },
    }
  },
})

export default versionChangerStyles
