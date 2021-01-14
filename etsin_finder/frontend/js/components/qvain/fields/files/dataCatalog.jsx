import React, { useState } from 'react'
import { observer } from 'mobx-react'
import Select, { components } from 'react-select'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import Card from '../../general/card'
import { dataCatalogSchema } from '../../utils/formValidation'
import ValidationError from '../../general/errors/validationError'
import { DATA_CATALOG_IDENTIFIER } from '../../../../utils/constants'
import { LabelLarge } from '../../general/modal/form'
import etsinTheme from '../../../../styles/theme'
import DoiSelection from './doiSelection'
import Tooltip from '../../../general/tooltipHover'
import { useStores } from '../../utils/stores'

const RequiredInput = props => <components.Input required {...props} />

const customComponents = {
  Input: RequiredInput,
}

const DataCatalog = () => {
  const {
    Qvain: {
      dataCatalog,
      setDataCatalog,
      selectedFiles,
      selectedDirectories,
      externalResources,
      original,
      isPas,
      setUseDoi,
    },
    Locale: { lang },
  } = useStores()
  const [error, SetError] = useState()

  let options = [
    { value: DATA_CATALOG_IDENTIFIER.IDA, label: translate('qvain.files.dataCatalog.ida') },
    { value: DATA_CATALOG_IDENTIFIER.ATT, label: translate('qvain.files.dataCatalog.att') },
  ]
  let pasOptions = [
    { value: DATA_CATALOG_IDENTIFIER.PAS, label: translate('qvain.files.dataCatalog.pas') },
  ]

  const updateOptions = () => {
    options = [
      { value: DATA_CATALOG_IDENTIFIER.IDA, label: translate('qvain.files.dataCatalog.ida') },
      { value: DATA_CATALOG_IDENTIFIER.ATT, label: translate('qvain.files.dataCatalog.att') },
    ]
    pasOptions = [
      { value: DATA_CATALOG_IDENTIFIER.PAS, label: translate('qvain.files.dataCatalog.pas') },
    ]
  }

  const handleOnBlur = () => {
    dataCatalogSchema
      .validate(dataCatalog)
      .then(() => {
        SetError(null)
      })
      .catch(err => {
        SetError(err.errors)
      })
  }

  const selected = [...selectedFiles, ...selectedDirectories, ...externalResources]

  if (lang) updateOptions()
  // PAS catalog cannot be selected by the user
  const availableOptions = isPas ? pasOptions : options
  const catalogSelectValue = availableOptions.find(opt => opt.value === dataCatalog)

  return (
    <Card>
      <LabelLarge htmlFor="dataCatalogSelect">
        <Tooltip
          title={translate('qvain.description.fieldHelpTexts.requiredToPublish', {
            locale: lang,
          })}
          position="right"
        >
          <Translate content="qvain.files.dataCatalog.label" /> *
        </Tooltip>
      </LabelLarge>
      <Translate component="p" content="qvain.files.dataCatalog.explanation" />
      <Translate
        component={Select}
        components={customComponents}
        inputId="dataCatalogSelect"
        name="dataCatalog"
        value={catalogSelectValue}
        options={availableOptions}
        onChange={selection => {
          setDataCatalog(selection.value)
          SetError(null)

          // Uncheck useDoi checkbox if data catalog is ATT
          if (selection.value === DATA_CATALOG_IDENTIFIER.ATT) {
            setUseDoi(false)
          }
        }}
        styles={{ placeholder: () => ({ color: etsinTheme.color.gray }) }}
        onBlur={handleOnBlur}
        attributes={{ placeholder: 'qvain.files.dataCatalog.placeholder' }}
        isDisabled={selected.length > 0 || original !== undefined || isPas}
      />
      <DoiSelection />

      {error && <ValidationError>{error}</ValidationError>}
    </Card>
  )
}

export default observer(DataCatalog)
