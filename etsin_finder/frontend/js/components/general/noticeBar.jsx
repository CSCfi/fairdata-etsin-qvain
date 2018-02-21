import React from 'react'
import styled from 'styled-components'

const Bar = styled.div`
  width: 100%;
  min-height: 3em;
  background-color: ${props => props.theme.color.error};
  display: flex;
  color: white;
  justify-content: center;
  align-items: center;
`

const NoticeText = styled.h3`
  margin-bottom: 0;
`

const NoticeBar = ({ children }) => (
  <Bar>
    <NoticeText>{children}</NoticeText>
  </Bar>
)

export default NoticeBar
