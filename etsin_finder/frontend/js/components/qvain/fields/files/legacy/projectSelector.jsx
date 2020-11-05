import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import Select from 'react-select'
import styled from 'styled-components'
import { withStores } from '../../utils/stores'

export class ProjectSelectorBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    error: undefined,
  }

  getOptions() {
    // IDA projects found, so populate the IDA project dropdown
    if (this.props.Stores.Auth.user.idaProjects) {
      return this.props.Stores.Auth.user.idaProjects.map(projectId => ({
        value: projectId,
        label: projectId,
      }))
    } // ... Otherwise the dropdown will be left empty, but visible, if the user has no IDA projects.
    return undefined
  }

  handleOnChange = selectedOption => {
    this.props.Stores.Qvain.changeProject(selectedOption.value)
      .then(() => {
        this.setState({ error: undefined })
      })
      .catch(e => {
        console.log(e)
        this.setState({ error: e.message })
      })
  }

  render() {
    const options = this.getOptions()

    // If editing an existing dataset, user cannot link files from another project. - 10.6.2019
    const { original, selectedFiles, selectedDirectories } = this.props.Stores.Qvain
    const editing = original !== undefined && [...selectedFiles, ...selectedDirectories].length > 0

    let selected

    // Error handling for the case where the user wants to publish an IDA dataset but has no IDA projects
    if (options) {
      selected = options.find(opt => opt.value === this.props.Stores.Qvain.selectedProject)
    }
    const { error } = this.state
    return (
      <Fragment>
        <Translate
          aria-label="Select project"
          options={options}
          isDisabled={editing}
          component={ProjectSelect}
          value={selected}
          onChange={this.handleOnChange}
          attributes={{ placeholder: 'qvain.files.projectSelect.placeholder' }}
        />
        {error === 'Request failed with status code 404' && (
          <ErrorMessage>
            <Translate content="qvain.files.projectSelect.loadErrorNoFiles" />
          </ErrorMessage>
        )}
        {error !== undefined && error !== 'Request failed with status code 404' && (
          <ErrorMessage>
            <Translate content="qvain.files.projectSelect.loadError" />
            {error}
          </ErrorMessage>
        )}
      </Fragment>
    )
  }
}

const ErrorMessage = styled.p`
  color: ${props => props.theme.color.redText};
`

export const ProjectSelect = styled(Select)`
  background-color: #f5f5f5;
  width: 164px;
  height: 38px;
  margin-top: 30px;
  margin-bottom: 10px;
  color: #808080;
`

export default withStores(observer(ProjectSelectorBase))
