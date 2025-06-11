import PropTypes from 'prop-types'
import ReactSelect from 'react-select/async'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import Translate from '@/utils/Translate'
import {
  onChange,
  onChangeMulti,
  getOptionLabel,
  getOptionValue,
  optionsToModels,
  sortOptions,
} from '@/components/qvain/utils/select'
import { useStores } from '@/stores/stores'

const SearchSelect = props => {
  const { metaxIdentifier, getter, setter, model, name, inModal, isMulti } = props

  const {
    Qvain: {
      readonly,
      ReferenceData: { getOptions },
    },
    Locale: { lang },
  } = useStores()

  const _props = {
    ...props,
    className: 'basic-single',
    classNamePrefix: 'select',
    inputId: `${name}-select`,
    isDisabled: readonly,
    value: toJS(getter),
    onChange: isMulti ? onChangeMulti(setter) : onChange(setter),
    cacheOptions: true,
    defaultOptions: [],
    getOptionLabel: getOptionLabel(model, lang),
    getOptionValue: getOptionValue(model),
    loadOptions: async inputValue => {
      let opts = await getOptions(metaxIdentifier, { searchText: inputValue })
      sortOptions(lang, opts)
      opts = optionsToModels(model, opts)
      return opts
    },
    ariaAutocomplete: 'list',
    placeholder: '',
    classNames: {
      control: () => 'control',
      multiValueLabel: () => 'selected-value',
    },
  }

  return inModal ? (
    <Translate
      component={ReactSelect}
      id="select-in-modal"
      {..._props}
      menuPlacement="auto"
      menuPosition="fixed"
      menuShouldScrollIntoView={false}
    />
  ) : (
    <Translate component={ReactSelect} id={`select-${props.name}`} {..._props} />
  )
}

SearchSelect.propTypes = {
  metaxIdentifier: PropTypes.string.isRequired,
  getter: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  setter: PropTypes.func.isRequired,
  model: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  inModal: PropTypes.bool,
  isMulti: PropTypes.bool,
}

SearchSelect.defaultProps = {
  getter: undefined,
  inModal: false,
  isMulti: false,
}

export default observer(SearchSelect)
