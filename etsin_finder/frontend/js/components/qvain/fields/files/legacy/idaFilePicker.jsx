import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import ProjectSelector from './projectSelector'
import SelectedFiles from './selectedFiles'
import FileSelector from './fileSelector'
import { withStores } from '../../../utils/stores'

export class IDAFilePickerBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  handleToggleForm = event => {
    event.preventDefault()
    const { idaPickerOpen } = this.props.Stores.Qvain
    if (idaPickerOpen) {
      this.props.Stores.Qvain.idaPickerOpen = false
    } else {
      this.props.Stores.Qvain.idaPickerOpen = true
      this.props.Stores.Qvain.extResFormOpen = false
    }
  }

  render() {
    return (
      <Fragment>
        <Translate component="p" content="qvain.files.ida.help" />
        <Fragment>
          <ProjectSelector />
          <FileSelector />
          <SelectedFiles />
        </Fragment>
      </Fragment>
    )
  }
}

export default withStores(observer(IDAFilePickerBase))
