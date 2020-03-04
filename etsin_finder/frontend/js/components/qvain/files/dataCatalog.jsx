import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import Card from '../general/card'
import { dataCatalogSchema } from '../utils/formValidation'
import ValidationError from '../general/validationError'
import { DataCatalogIdentifiers } from '../utils/constants'
import { LabelLarge } from '../general/form'

const options = [
  { value: DataCatalogIdentifiers.IDA, label: translate('qvain.files.dataCatalog.ida') },
  { value: DataCatalogIdentifiers.ATT, label: translate('qvain.files.dataCatalog.att') }
]

const pasOptions = [
  { value: DataCatalogIdentifiers.PAS, label: translate('qvain.files.dataCatalog.pas') }
]

class DataCatalog extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    errorMessage: undefined,
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

  render() {
    const { errorMessage } = this.state
    const { dataCatalog, setDataCatalog, selectedFiles, selectedDirectories, externalResources, original, isPas } = this.props.Stores.Qvain
    const selected = [...selectedFiles, ...selectedDirectories, ...externalResources]

    // PAS catalog cannot be selected by the user
    const availableOptions = isPas ? pasOptions : options
    return (
      <Card>
        <LabelLarge htmlFor="dataCatalogSelect">
          <Translate content="qvain.files.dataCatalog.label" /> *
        </LabelLarge>
        <Translate component="p" content="qvain.files.dataCatalog.explanation" />
        <Translate
          component={Select}
          inputId="dataCatalogSelect"
          name="dataCatalog"
          value={availableOptions.find(opt => opt.value === dataCatalog)}
          options={availableOptions}
          onChange={(selection) => {
            setDataCatalog(selection.value)
            this.setState({ errorMessage: undefined })
          }}
          onBlur={this.handleOnBlur}
          attributes={{ placeholder: 'qvain.files.dataCatalog.placeholder' }}
          isDisabled={(selected.length > 0) || (original !== undefined) || isPas}
        />
        {errorMessage && <ValidationError>{errorMessage}</ValidationError>}
      </Card>
    )
  }
}

export default inject('Stores')(observer(DataCatalog))
