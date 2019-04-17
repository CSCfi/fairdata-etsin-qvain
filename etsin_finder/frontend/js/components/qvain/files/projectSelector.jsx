import React, { Component } from 'react';
import Translate from 'react-translate-component'
import Select from 'react-select';
import styled from 'styled-components';

class ProjectSelector extends Component {
  render() {
    return (
      <Translate
        component={ProjectSelect}
        attributes={{ placeholder: 'qvain.files.projectSelect.placeholder' }}
      />
    )
  }
}

const ProjectSelect = styled(Select)`
  background-color: #f5f5f5;
  width: 164px;
  height: 38px;
  margin-top: 30px;
  margin-bottom: 45px;
`;

export default ProjectSelector
