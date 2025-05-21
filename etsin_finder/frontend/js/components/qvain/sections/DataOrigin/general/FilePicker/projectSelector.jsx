import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Select from 'react-select'
import styled from 'styled-components'
import Translate from '@/utils/Translate'
import { useStores } from '../../../../utils/stores'
import { ignoreAbort } from '@/utils/AbortClient'

export const ProjectSelectorBase = ({ disabled }) => {
  const {
    Qvain: {
      Files: { changeProject, selectedProject, loadingProject },
    },
    Auth: {
      user: { idaProjects },
    },
  } = useStores()

  const error = (loadingProject && loadingProject.error) || undefined

  const notFound = error && error.response && error.response.status === 404

  const getOptions = () => {
    // IDA projects found, so populate the IDA project dropdown
    if (idaProjects) {
      return idaProjects.map(projectId => ({ value: projectId, label: projectId }))
    } // ... Otherwise the dropdown will be left empty, but visible, if the user has no IDA projects.
    return undefined
  }

  const handleOnChange = selectedOption => {
    ignoreAbort(() => changeProject(selectedOption.value))
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

export default observer(ProjectSelectorBase)
