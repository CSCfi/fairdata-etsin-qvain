import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import styled from 'styled-components'

import Card from '../general/card'
import { dataCatalogSchema } from '../utils/formValidation'
import ValidationError from '../general/validationError'
import { DataCatalogIdentifiers } from '../utils/constants'
import { Checkbox, LabelLarge } from '../general/form'

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

  constructor(props) {
    super(props)

    this.state = {
      errorMessage: undefined,
      fileOrigin: undefined,
      useDoi: false,
    }
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

  handleDoiCheckboxChange = () => {
    const { setUseDoi } = this.props.Stores.Qvain
    setUseDoi(!this.state.useDoi)
    this.setState(prevState => ({
      useDoi: !prevState.useDoi
    }))
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
            this.setState({
              errorMessage: undefined,
              fileOrigin: selection.label,
            })
          }}
          onBlur={this.handleOnBlur}
          attributes={{ placeholder: 'qvain.files.dataCatalog.placeholder' }}
          isDisabled={(selected.length > 0) || (original !== undefined) || isPas}
        />
        {
          (this.state.fileOrigin === 'IDA' && original === undefined) && (
          <DoiSelectionContainer>
            <Checkbox
              id="doiSelector"
              onChange={this.handleDoiCheckboxChange}
              disabled={(this.state.fileOrigin !== 'IDA' || original !== undefined)}
              defaultChecked={this.state.useDoi || ((original !== undefined) && (dataCatalog === 'urn:nbn:fi:att:data-catalog-ida'))}
            />
            <DoiLabel
              htmlFor="doiSelector"
            >
              <Translate content="qvain.files.dataCatalog.doiSelection" />
            </DoiLabel>
          </DoiSelectionContainer>)
        }
        {errorMessage && <ValidationError>{errorMessage}</ValidationError>}
      </Card>
    )
  }
}

const DoiSelectionContainer = styled.div`
  margin-top: 20px;
`

const DoiLabel = styled.label`
  margin-right: auto;
  padding-left: 4px;
  display: inline-block;
`

export default inject('Stores')(observer(DataCatalog))
