import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import Select from 'react-select';
import styled from 'styled-components';

export class ProjectSelectorBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  getOptions = () => {
    if (this.props.Stores.Env.environment === 'development') {
      return [{ value: 'project_x', label: 'project_x' }]
    }
    return this.props.Stores.Auth.user.idaGroups
      .filter(group => group.includes('IDA'))
      .map(group => group.substring(
        group.indexOf(':') + 1,
        group.length
      ))
      .map(projectId => ({ value: projectId, label: projectId }))
  }

  handleOnChange = (selectedOption) => {
    console.log('ProjectSelect handleOnChange')
    this.props.Stores.Qvain.changeProject(selectedOption.value)
  }

  render() {
    const options = this.getOptions()
    const selected = options.find(opt => opt.value === this.props.Stores.Qvain.selectedProject)
    return (
      <Translate
        options={options}
        component={ProjectSelect}
        value={selected}
        onChange={this.handleOnChange}
        attributes={{ placeholder: 'qvain.files.projectSelect.placeholder' }}
      />
    )
  }
}

export const ProjectSelect = styled(Select)`
  background-color: #f5f5f5;
  width: 164px;
  height: 38px;
  margin-top: 30px;
  margin-bottom: 10px;
`;

export default inject('Stores')(observer(ProjectSelectorBase))
