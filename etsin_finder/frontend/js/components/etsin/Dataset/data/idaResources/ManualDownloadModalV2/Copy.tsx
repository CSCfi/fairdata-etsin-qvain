import styled from 'styled-components'

import CopyToClipboard from '../../../CopyToClipboard'
import React from 'react'

const Input = styled.input.attrs({
  type: 'text',
  readOnly: true,
})`
  border-radius: 4px;
  border: none;
  background: ${p => p.theme.color[p.disabled ? 'superlightgray' : 'lightgray']};
  padding: 0.25rem;
  flex-grow: 1;
  text-overflow: ellipsis;
`

const CopyBlock = styled.span`
  display: inline-flex;
  background: ${p => p.theme.color.lightgray};
  margin: 0.125rem;
  border-radius: 4px;
  padding: 0.125rem;
  gap: 0.5rem;
  align-items: stretch;
  vertical-align: middle;
  word-break: break-all;

  // leave space for . after block
  max-width: calc(100% - 0.5em);
`

const CopyBlockWide = styled(CopyBlock)`
  width: 100%;
  display: flex;
`

interface CopyFieldProps {
  children: React.ReactNode
  text: string
}

export const CopySpan = ({ children, text }: CopyFieldProps) => {
  return (
    <CopyBlock>
      <code title={text}>{children}</code>
      <CopyToClipboard
        content={text}
        tooltip="dataset.dl.manualDownload.copyButtonTooltip"
        tooltipSuccess="dataset.dl.manualDownload.copyButtonTooltipSuccess"
        tooltipPosition="left"
      />
    </CopyBlock>
  )
}

export const CopyInput = ({ text }: { text: string }) => {
  return (
    <CopyBlockWide>
      <Input value={text} title={text} />
      <CopyToClipboard
        content={text}
        tooltip="dataset.dl.manualDownload.copyButtonTooltip"
        tooltipSuccess="dataset.dl.manualDownload.copyButtonTooltipSuccess"
        tooltipPosition="left"
      />
    </CopyBlockWide>
  )
}
