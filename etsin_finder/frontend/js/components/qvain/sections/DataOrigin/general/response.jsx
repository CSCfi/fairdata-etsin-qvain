import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import Loader from '@/components/general/loader'
import { TableButton } from '@/components/qvain/general/buttons'
import { useStores } from '@/stores/stores'

// Shows success/fail based on a RPC request response. If the response prop is null, shows a loader.
const Response = ({ response, history, requestClose }) => {
  const {
    Env: { getQvainUrl },
  } = useStores()

  const handleOpenNewVersion = identifier => {
    history.push(getQvainUrl(`/dataset/${identifier}`))
    requestClose()
  }

  // If something went wrong.
  if (response && response.error) {
    return (
      <ResponseContainerError>
        <ResponseContainerContent>
          <ResponseLabel>
            <Translate content="qvain.files.responses.fail" />
          </ResponseLabel>
          <p>{response.error.toString().replace(/,/g, '\n')}</p>
        </ResponseContainerContent>
      </ResponseContainerError>
    )
  }

  // If response was ok.
  if (response) {
    // Get new identifier if new version was created.
    const newIdentifier = response.new_version_created && response.new_version_created.identifier
    return (
      <ResponseContainerSuccess>
        <ResponseContainerContent>
          <ResponseLabel success>
            <Translate content="qvain.files.responses.changeComplete" />
          </ResponseLabel>
          {newIdentifier && (
            <>
              <Translate
                component="p"
                content="qvain.files.responses.versionCreated"
                with={{ identifier: newIdentifier }}
              />
              <NewVersionButton onClick={() => handleOpenNewVersion(newIdentifier)}>
                <Translate content={'qvain.files.responses.openNewVersion'} />
              </NewVersionButton>
            </>
          )}
        </ResponseContainerContent>
      </ResponseContainerSuccess>
    )
  }

  // No response loaded yet, show loader.
  return (
    <ResponseContainerLoading>
      <Loader active />
    </ResponseContainerLoading>
  )
}

Response.propTypes = {
  response: PropTypes.object,
  history: PropTypes.object.isRequired,
  requestClose: PropTypes.func,
}

Response.defaultProps = {
  response: null,
  requestClose: () => {},
}

const ResponseLabel = styled.p`
  font-weight: bold;
  display: inline-block;
  vertical-align: top;
`

const ResponseContainerSuccess = styled.div`
  background-color: #e8ffeb;
  text-align: center;
  width: 100%;
  color: green;
  z-index: 2;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  position: relative;
  margin-bottom: 0.5em;
  min-width: 300px;
`
const ResponseContainerError = styled.div`
  background-color: #ffebe8;
  text-align: center;
  width: 100%;
  color: ${props => props.theme.color.redText};
  z-index: 2;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  position: relative;
  margin-bottom: 0.5em;
  min-width: 300px;
`

const ResponseContainerLoading = styled.div`
  background-color: #fff;
  text-align: center;
  width: 100%;
  z-index: 2;
  height: 105px;
  padding-top: 30px;
  min-width: 300px;
`

const ResponseContainerContent = styled.div`
  max-width: 1140px;
  width: 100%;
  text-align: left;
  display: inline-block;
  padding-left: 30px;
  padding-right: 20px;
  padding-top: 20px;
  white-space: pre-line;
`

const NewVersionButton = styled(TableButton)`
  width: auto;
  margin-top: 0;
  margin-bottom: 1em;
`

export default withRouter(observer(Response))
