import React from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select/async'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import {
  onChange,
  onChangeMulti,
  getOptions,
  getOptionLabel,
  getOptionValue,
  sortOptions,
} from '../../utils/select'
import etsinTheme from '../../../../styles/theme'
import { useStores } from '../../utils/stores'

const Select = props => {
  const { metaxIdentifier, getter, setter, model, name, inModal, placeholder, isMulti } = props

  const {
    Qvain: { readonly },
    Locale: { lang },
  } = useStores()

  const _props = {
    ...props,
    className: 'basic-single',
    classNamePrefix: 'select',
    inputId: `${name}-select`,
    component: ReactSelect,
    attributes: { placeholder },
    isDisabled: readonly,
    value: getter,
    onChange: isMulti ? onChangeMulti(setter) : onChange(setter),
    cacheOptions: true,
    defaultOptions: [],
    styles: { placeholder: () => ({ color: etsinTheme.color.gray }) },
    getOptionLabel: getOptionLabel(model, lang),
    getOptionValue: getOptionValue(model),
    loadOptions: async inputValue => {
      const opts = await getOptions(model, metaxIdentifier, inputValue)
      sortOptions(model, lang, opts)
      return opts
    },
  }

  return inModal ? (
    <Translate
      {..._props}
      menuPlacement="auto"
      menuPosition="fixed"
      menuShouldScrollIntoView={false}
    />
  ) : (
    <Translate {..._props} />
  )
}

Select.propTypes = {
  Stores: PropTypes.object.isRequired,
  metaxIdentifier: PropTypes.string.isRequired,
  getter: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  setter: PropTypes.func.isRequired,
  model: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  inModal: PropTypes.bool,
  placeholder: PropTypes.string,
  isMulti: PropTypes.bool,
}

Select.defaultProps = {
  getter: undefined,
  inModal: false,
  placeholder: 'qvain.select.searchPlaceholder',
  isMulti: false,
}

export default observer(Select)
