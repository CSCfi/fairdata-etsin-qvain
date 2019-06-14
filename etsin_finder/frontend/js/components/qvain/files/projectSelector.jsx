import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import Select from 'react-select';
import styled from 'styled-components';

export class ProjectSelectorBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    error: undefined
  }

  getOptions = () => {
    const { environment } = this.props.Stores.Env
    if (environment === 'development' || environment === 'test') {
      return [
        { value: 'project_x', label: 'project_x' },
        { value: 'empty', label: 'test nonexistant IDA project' }
      ]
    }
    const projects = this.props.Stores.Auth.user.idaGroups
      .filter(group => group.includes('IDA'))
      .map(group => group.substring(
        group.indexOf(':') + 1,
        group.length
      ))
      .map(projectId => ({ value: projectId, label: projectId }))
    return environment === 'test' ?
      [...projects, { value: 'project_x', label: 'project_x' }] :
      projects
  }

  handleOnChange = (selectedOption) => {
    console.log('ProjectSelect handleOnChange')
    this.props.Stores.Qvain.changeProject(selectedOption.value).then(() => {
      this.setState({ error: undefined })
    }).catch(e => {
      console.log(e)
      this.setState({ error: e.message })
    })
  }

  render() {
    const options = this.getOptions()
    // if editing an existing dataset, user cannot link files from another project. - 10.6.2019
    const { original, selectedFiles, selectedDirectories } = this.props.Stores.Qvain
    const editing = original !== undefined && [...selectedFiles, ...selectedDirectories].length > 0
    const selected = options.find(opt => opt.value === this.props.Stores.Qvain.selectedProject)
    const { error } = this.state
    return (
      <Fragment>
        <Translate
          options={options}
          isDisabled={editing}
          component={ProjectSelect}
          value={selected}
          onChange={this.handleOnChange}
          attributes={{ placeholder: 'qvain.files.projectSelect.placeholder' }}
        />
        {error !== undefined && (
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
  color: red;
`;

export const ProjectSelect = styled(Select)`
  background-color: #f5f5f5;
  width: 164px;
  height: 38px;
  margin-top: 30px;
  margin-bottom: 10px;
`;

export default inject('Stores')(observer(ProjectSelectorBase))
