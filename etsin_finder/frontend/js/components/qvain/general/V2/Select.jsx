import PropTypes from 'prop-types'
import ReactSelect from 'react-select'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import {
  onChange,
  onChangeMulti,
  getGroupLabel,
  getOptionLabel,
  getOptionValue,
  sortGroups,
  getCurrentOption,
  sortOptions,
} from '@/components/qvain/utils/select'
import { useStores } from '@/stores/stores'
import useReferenceData from '@/utils/useReferenceData'

function Select({
  metaxIdentifier,
  getter,
  modifyOptionLabel = translation => translation,
  modifyGroupLabel = translation => translation,
  setter,
  model,
  name,
  getRefGroups,
  sortFunc,
  inModal = false,
  isClearable = true,
  isMulti = false,
  placeholder = '',
  ...props
}) {
  const Stores = useStores()

  const handleOptions = options => {
    const { lang } = Stores.Locale

    if (getRefGroups) {
      const groups = getRefGroups(options)
      sortGroups(lang, groups, {
        optionKey: 'url',
        translateOptionKey: false,
        groupKey: 'url',
        translateGroupKey: false,
      })
      return groups
    } else {
      sortOptions(lang, options, { sortFunc })
      const mappedOptions = options.map(ref => model(ref.label, ref.value))
      return mappedOptions
    }
  }

  const { options, isLoading } = useReferenceData(metaxIdentifier, { handler: handleOptions })

  const { readonly } = Stores.Qvain
  const { lang } = Stores.Locale

  const groupLabelFunc = getGroupLabel(model, lang)
  const optionLabelFunc = getOptionLabel(model, lang)

  const properties = {
    ...props,
    placeholder,
    inputId: `${name}-select`,
    attributes: { placeholder },
    isDisabled: readonly,
    value: getCurrentOption(model, options, getter),
    classNamePrefix: 'select',
    options,
    onChange: isMulti ? onChangeMulti(setter) : onChange(setter),
    isClearable,
    isMulti,
    isLoading,
    formatGroupLabel: group => modifyGroupLabel(groupLabelFunc(group), group),
    getOptionLabel: option => modifyOptionLabel(optionLabelFunc(option), option),
    getOptionValue: getOptionValue(model),
    ariaAutocomplete: 'list',
    classNames: {
      control: () => 'control',
      multiValueLabel: () => 'selected-value',
    },
    ...(inModal && {
      menuPlacement: 'auto',
      menuPosition: 'fixed',
      menuShouldScrollIntoView: false,
    }),
  }

  if (!properties.attributes?.placeholder) {
    properties.attributes = { ...properties.attributes, placeholder }
  }

  return <Translate component={ReactSelect} {...properties} />
}

Select.propTypes = {
  metaxIdentifier: PropTypes.string.isRequired,
  getter: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  modifyOptionLabel: PropTypes.func,
  modifyGroupLabel: PropTypes.func,
  setter: PropTypes.func.isRequired,
  model: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  getRefGroups: PropTypes.func,
  sortFunc: PropTypes.func,
  inModal: PropTypes.bool,
  isClearable: PropTypes.bool,
  isMulti: PropTypes.bool,
  placeholder: PropTypes.string,
}


export default observer(Select)
