{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import { createRef, Component } from 'react'
import Transition from 'react-transition-group/Transition'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import withCustomProps from '@/utils/withCustomProps'

export default class HeightTransition extends Component {
  constructor(props) {
    super(props)
    this.state = {
      transitionStyles: {
        entering: {
          height: this.props.initialHeight,
          visibility: 'inherit',
        },
        entered: {
          height: 'inherit',
          visibility: 'inherit',
        },
        exiting: {
          height: 'inherit',
          visibility: 'inherit',
        },
        exited: {
          height: this.props.initialHeight,
          visibility: this.props.endVisibility,
        },
      },
    }

    this.container = createRef()
  }

  componentDidMount() {}

  getHeight = node => {
    const height = node.scrollHeight
    this.props.contentHeight(height)
    this.setState({
      transitionStyles: {
        entering: {
          height: this.props.initialHeight,
          visibility: 'inherit',
        },
        entered: {
          height: `${height}px`,
          visibility: 'inherit',
        },
        exiting: {
          height: `${height}px`,
          visibility: 'inherit',
        },
        exited: {
          height: this.props.initialHeight,
          visibility: this.props.endVisibility,
        },
      },
    })
  }

  resetHeight = () => {
    this.setState({
      transitionStyles: {
        entering: {
          height: this.props.initialHeight,
          visibility: 'inherit',
        },
        entered: {
          height: 'inherit',
          visibility: 'inherit',
        },
        exiting: {
          height: 'inherit',
          visibility: 'inherit',
        },
        exited: {
          height: this.props.initialHeight,
          visibility: this.props.endVisibility,
        },
      },
    })
  }

  sendHeightToParent = node => {
    const height = node.scrollHeight
    this.props.contentHeight(height)
  }

  render() {
    return (
      <Transition
        in={this.props.in}
        timeout={0}
        onExit={node => this.getHeight(node)}
        onEnter={node => this.getHeight(node)}
        addEndListener={node => {
          node.addEventListener('transitionend', this.resetHeight, false)
        }}
      >
        {state => (
          <TransitionDiv
            ref={this.container}
            onClick={node => this.sendHeightToParent(node)}
            initialHeight={this.props.initialHeight}
            visibility={this.state.transitionStyles[state].visibility}
            height={this.state.transitionStyles[state].height}
            duration={this.props.duration}
            onlyMobile={this.props.onlyMobile}
          >
            {this.props.children}
          </TransitionDiv>
        )}
      </Transition>
    )
  }
}

const TransitionDiv = withCustomProps(styled.div).attrs(props => ({
  height: props.height ? props.height : props.initialHeight,
  visibility: props.visibility ? props.visibility : 'inherit',
}))`
  visibility: ${props => props.visibility};
  max-height: ${props => props.height};
  width: 100%;
  overflow: hidden;
  transition: max-height ${props => props.duration}ms ease-in-out;
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    visibility: ${props => (props.onlyMobile ? 'inherit' : props.visibility)};
    max-height: ${props => (props.onlyMobile ? 'inherit' : props.height)};
  }
`

HeightTransition.defaultProps = {
  onlyMobile: false,
  initialHeight: '0px',
  endVisibility: 'hidden',
  contentHeight: () => {},
}

HeightTransition.propTypes = {
  duration: PropTypes.number.isRequired,
  in: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  initialHeight: PropTypes.string,
  onlyMobile: PropTypes.bool,
  endVisibility: PropTypes.string,
  contentHeight: PropTypes.func,
}
