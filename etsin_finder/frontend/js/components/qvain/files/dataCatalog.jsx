import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import Card from '../general/card'
import { dataCatalogSchema } from '../utils/formValidation'
import ValidationError from '../general/validationError'

const options = [
  { value: 'urn:nbn:fi:att:data-catalog-ida', label: 'IDA' },
  { value: 'urn:nbn:fi:att:data-catalog-att', label: 'ATT' }
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
    const { dataCatalog, setDataCatalog } = this.props.Stores.Qvain
    return (
      <Card>
        <Translate component="h3" content="qvain.files.dataCatalog.label" />
        <Translate component="p" content="qvain.files.dataCatalog.explanation" />
        <Translate
          component={Select}
          name="dataCatalog"
          value={dataCatalog}
          options={options}
          onChange={(selection) => {
            setDataCatalog(selection)
            this.setState({ errorMessage: undefined })
          }}
          onBlur={this.handleOnBlur}
          attributes={{ placeholder: 'qvain.files.dataCatalog.placeholder' }}
        />
        {errorMessage && <ValidationError>{errorMessage}</ValidationError>}
      </Card>
    )
  }
}

export default inject('Stores')(observer(DataCatalog))
