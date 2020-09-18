import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import Select from 'react-select'
import styled from 'styled-components'

export const ProjectSelectorBase = ({ Stores, disabled }) => {
  const { changeProject, selectedProject } = Stores.Qvain.Files
  const { idaProjects } = Stores.Auth.user
  const { error } = Stores.Qvain.Files.loadingProject || {}
  const notFound = error && error.response && error.response.status === 404

  const getOptions = () => {
    // IDA projects found, so populate the IDA project dropdown
    if (idaProjects) {
      return idaProjects
        .filter(project => project.includes('IDA'))
        .map(project => project.substring(project.indexOf(':') + 1, project.length))
        .map(projectId => ({ value: projectId, label: projectId }))
    } // ... Otherwise the dropdown will be left empty, but visible, if the user has no IDA projects.
    return undefined
  }

  const handleOnChange = selectedOption => {
    changeProject(selectedOption.value)
  }

  const options = getOptions()
  const selected = options && options.find(opt => opt.value === selectedProject)

  return (
    <>
      <Translate
        aria-label="Select project"
        options={options}
        isDisabled={disabled}
        component={ProjectSelect}
        value={selected}
        onChange={handleOnChange}
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
    </>
  )
}

ProjectSelectorBase.propTypes = {
  Stores: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
}

ProjectSelectorBase.defaultProps = {
  disabled: false,
}

const ErrorMessage = styled.p`
  color: ${props => props.theme.color.redText};
`

export const ProjectSelect = styled(Select)`
  display: inline-block;
  background-color: #f5f5f5;
  width: 220px;
  height: 38px;
  color: #808080;
`

export default inject('Stores')(observer(ProjectSelectorBase))
