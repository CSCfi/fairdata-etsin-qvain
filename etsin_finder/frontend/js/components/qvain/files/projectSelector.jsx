import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import Select from 'react-select';
import styled from 'styled-components';

class ProjectSelector extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  getOptions = () => {
    const theOptions = this.props.Stores.Qvain.selectedFiles.map(sf =>
      ({ value: sf.project_identifier, label: sf.project_identifier })
    )
    return theOptions.filter((option, index) =>
      theOptions.map(opt => opt.value).indexOf(option.value) === index
    )
  }

  render() {
    return (
      <Translate
        options={this.getOptions()}
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

export default inject('Stores')(observer(ProjectSelector))
