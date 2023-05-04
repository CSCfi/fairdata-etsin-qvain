import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import CopyToClipboard from '../../../copyToClipboard'
import Loader from '@/components/general/loader'

const Display = styled.input.attrs({
  type: 'text',
  readOnly: true,
})`
  border-radius: 4px;
  border: none;
  background: ${p => p.theme.color[p.disabled ? 'superlightgray' : 'lightgray']};
  padding: 0.5rem;
  flex-grow: 1;
`

const Row = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  gap: 0.5rem;
  position: relative;
`

const CopyText = ({ title, text, loading }) => (
  <>
    <Title>{title}</Title>
    <Row>
      {loading && (
        <LoaderWrapper>
          <Loader active size="12pt" spinnerSize="0.15em" />
        </LoaderWrapper>
      )}
      <Display value={text} disabled={loading} />
      <CopyToClipboard
        content={text}
        label="dataset.dl.manualDownload.copyButton"
        tooltip="dataset.dl.manualDownload.copyButtonTooltip"
        tooltipSuccess="dataset.dl.manualDownload.copyButtonTooltipSuccess"
        tooltipPosition="left"
        horizontal
        disabled={loading}
        disable
      />
    </Row>
  </>
)

CopyText.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  loading: PropTypes.bool,
}

CopyText.defaultProps = {
  text: '',
  loading: false,
}

const Title = styled.h2`
  line-height: 1.5;
  margin-bottom: 0.25em;
  margin-top: 1em;
`

export const LoaderWrapper = styled.div`
  pointer-events: none;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default observer(CopyText)
