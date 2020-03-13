import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import Select from 'react-select';
import styled from 'styled-components';

export class ProjectSelectorBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    disabled: false
  }

  getOptions = () => {
    const { environment } = this.props.Stores.Env

    let projects

    if (this.props.Stores.Auth.user.idaGroups) {
      projects = this.props.Stores.Auth.user.idaGroups
        .filter(group => group.includes('IDA'))
        .map(group => group.substring(
          group.indexOf(':') + 1,
          group.length
        ))
        .map(projectId => ({ value: projectId, label: projectId }))
    }

    if ((environment === 'development') && (projects === undefined)) {
      return [
        { value: 'project_x', label: 'project_x' },
        { value: 'empty', label: 'test nonexistant IDA project' }
      ]
    }

    return environment === 'test' ?
      [...projects, { value: 'project_x', label: 'project_x' }] :
      projects
  }

  handleOnChange = (selectedOption) => {
    this.props.Stores.Qvain.Files.changeProject(selectedOption.value)
  }

  render() {
    const options = this.getOptions()
    // if editing an existing dataset, user cannot link files from another project. - 10.6.2019
    const selected = options.find(opt => opt.value === this.props.Stores.Qvain.Files.selectedProject)
    const { disabled } = this.props

    const { error } = this.props.Stores.Qvain.Files.loadingProject || {}
    const notFound = error && error.response && error.response.status === 404
    return (
      <Fragment>
        <Translate
          aria-label="Select project"
          options={options}
          isDisabled={disabled}
          component={ProjectSelect}
          value={selected}
          onChange={this.handleOnChange}
          attributes={{ placeholder: 'qvain.files.projectSelect.placeholder' }}

          menuPlacement="auto"
          menuPosition="fixed"
          menuShouldScrollIntoView={false}
        />
        {notFound && (
          <ErrorMessage>
            <Translate content="qvain.files.projectSelect.loadErrorNoFiles" />
          </ErrorMessage>
        )}
        {error && !notFound && (
          <ErrorMessage>
            <Translate content="qvain.files.projectSelect.loadError" />
            {String(error)}
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
  display: inline-block;
  background-color: #f5f5f5;
  width: 220px;
  height: 38px;
  color: #808080;
`;

export default inject('Stores')(observer(ProjectSelectorBase))
