import React, { Fragment } from 'react'
import retojsx from 'react-element-to-jsx-string'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const CodeContainer = styled.code`
  padding: 1em;
  background-color: #444;
  border-radius: 0px 5px 5px 5px;
  color: white;
  display: block;
  margin: 1em 0em;
  max-width: 100%;
  width: max-content;
  margin-top: 4em;
  position: relative;
  border: 0px;
  z-index: -100;
  &::before {
    content: 'code:';
    color: #ccc;
    padding: 0.5em 1em;
    display: block;
    width: max-content;
    position: absolute;
    background-color: #444;
    top: 0;
    transform: translateY(-70%);
    border-radius: 5px 5px 0px 0px;
    left: 0;
  }
`

export default class ComponentCode extends React.Component {
  state = {}

  render() {
    return (
      <Fragment>
        <div>{this.props.children}</div>
        <CodeContainer>
          {retojsx(this.props.children, {
            displayName: this.props.displayName,
            filterProps: this.props.filterProps,
          })}
        </CodeContainer>
      </Fragment>
    )
  }
}

ComponentCode.defaultProps = {
  displayName: undefined,
  filterProps: [],
}

ComponentCode.propTypes = {
  displayName: PropTypes.func,
  filterProps: PropTypes.array,
  children: PropTypes.node.isRequired,
}
