import React, { Fragment } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const NoticeBar = props => (
  <Fragment>
    {props.deprecated && (
      <Bar color="deprecated">
        <NoticeText>{props.deprecated}</NoticeText>
      </Bar>
    )}
    {props.cumulative && (
      <Bar color="cumulative">
        <NoticeText>{props.cumulative}</NoticeText>
      </Bar>
    )}
    {props.notice && (
      <Bar color="notice">
        <NoticeText>{props.notice}</NoticeText>
      </Bar>
    )}
  </Fragment>
)

export default NoticeBar

const Bar = styled.div.attrs({
  colors: {
    deprecated: props => props.theme.color.error,
    cumulative: props => props.theme.color.cumulative,
  },
})`
  width: 100%;
  min-height: 2em;
  background-color: ${props => props.colors[props.color]};
  display: flex;
  color: white;
  justify-content: center;
  align-items: center;
`

const NoticeText = styled.h3`
  padding: 0.5em 1em;
  margin-bottom: 0;
  text-align: center;
`

NoticeBar.defaultProps = {
  deprecated: '',
  cumulative: '',
  notice: '',
}

NoticeBar.propTypes = {
  deprecated: PropTypes.string,
  cumulative: PropTypes.string,
  notice: PropTypes.string,
}
