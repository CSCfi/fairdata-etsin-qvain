import { useRef } from 'react'
import Transition from 'react-transition-group/Transition'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import withCustomProps from '@/utils/withCustomProps'

const HeightTransition = ({
  duration,
  in: _in,
  children,
  initialHeight = '0px',
  onlyMobile = false,
  endVisibility = 'hidden',
}) => {
  const nodeRef = useRef()

  const getTransitionStyles = node => {
    const height = node?.scrollHeight || 0
    const targetHeight = `${height}px`
    return {
      entering: {
        height: initialHeight,
        visibility: 'inherit',
      },
      entered: {
        height: targetHeight,
        visibility: 'inherit',
      },
      exiting: {
        height: targetHeight,
        visibility: 'inherit',
      },
      exited: {
        height: initialHeight,
        visibility: endVisibility,
      },
    }
  }

  return (
    <Transition in={_in} timeout={0} nodeRef={nodeRef}>
      {state => {
        const transitionStyles = getTransitionStyles(nodeRef.current)
        return (
          <TransitionDiv
            ref={nodeRef}
            initialHeight={initialHeight}
            visibility={transitionStyles[state].visibility}
            height={transitionStyles[state].height}
            duration={duration}
            onlyMobile={onlyMobile}
          >
            {children}
          </TransitionDiv>
        )
      }}
    </Transition>
  )
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

HeightTransition.propTypes = {
  duration: PropTypes.number.isRequired,
  in: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  initialHeight: PropTypes.string,
  onlyMobile: PropTypes.bool,
  endVisibility: PropTypes.string,
}

export default HeightTransition
