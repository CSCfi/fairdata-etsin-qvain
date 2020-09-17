import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import Card from '../general/card'
import { dataCatalogSchema } from '../utils/formValidation'
import ValidationError from '../general/errors/validationError'
import { DATA_CATALOG_IDENTIFIER } from '../../../utils/constants'
import { LabelLarge } from '../general/modal/form'
import etsinTheme from '../../../styles/theme'
import DoiSelection from './doiSelection'
import Tooltip from '../../general/tooltipHover'

let options = [
  { value: DATA_CATALOG_IDENTIFIER.IDA, label: translate('qvain.files.dataCatalog.ida') },
  { value: DATA_CATALOG_IDENTIFIER.ATT, label: translate('qvain.files.dataCatalog.att') },
]
let pasOptions = [
  { value: DATA_CATALOG_IDENTIFIER.PAS, label: translate('qvain.files.dataCatalog.pas') },
]

class DataCatalog extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    errorMessage: undefined,
  }

  updateOptions = () => {
    options = [
      { value: DATA_CATALOG_IDENTIFIER.IDA, label: translate('qvain.files.dataCatalog.ida') },
      { value: DATA_CATALOG_IDENTIFIER.ATT, label: translate('qvain.files.dataCatalog.att') },
    ]
    pasOptions = [
      { value: DATA_CATALOG_IDENTIFIER.PAS, label: translate('qvain.files.dataCatalog.pas') },
    ]
  }

  handleOnBlur = () => {
    const dataCatalog = this.props.Stores.Qvain.dataCatalog
    dataCatalogSchema
      .validate(dataCatalog)
      .then(() => {
        this.setState({
          errorMessage: undefined,
        })
      })
      .catch(err => {
        this.setState({
          errorMessage: err.errors,
        })
      })
  }

  handleDoiCheckboxChange = event => {
    const { setUseDoi } = this.props.Stores.Qvain
    setUseDoi(event.target.checked)
  }

  render() {
    const { errorMessage } = this.state
    const {
      dataCatalog,
      setDataCatalog,
      selectedFiles,
      selectedDirectories,
      externalResources,
      original,
      isPas,
      setUseDoi,
    } = this.props.Stores.Qvain
    const selected = [...selectedFiles, ...selectedDirectories, ...externalResources]
    const { lang } = this.props.Stores.Locale

    if (lang) this.updateOptions()
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
          inputId="dataCatalogSelect"
          name="dataCatalog"
          value={catalogSelectValue}
          options={availableOptions}
          onChange={selection => {
            setDataCatalog(selection.value)
            this.setState({
              errorMessage: undefined,
            })

            // Uncheck useDoi checkbox if data catalog is ATT
            if (selection.value === DATA_CATALOG_IDENTIFIER.ATT) {
              setUseDoi(false)
            }
          }}
          styles={{ placeholder: () => ({ color: etsinTheme.color.gray }) }}
          onBlur={this.handleOnBlur}
          attributes={{ placeholder: 'qvain.files.dataCatalog.placeholder' }}
          isDisabled={selected.length > 0 || original !== undefined || isPas}
        />
        <DoiSelection />

        {errorMessage && <ValidationError>{errorMessage}</ValidationError>}
      </Card>
    )
  }
}

export default inject('Stores')(observer(DataCatalog))
