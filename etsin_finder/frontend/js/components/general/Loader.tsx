import styled from 'styled-components'
import withCustomProps from '@/utils/withCustomProps'

interface LoaderProps {
  left?: boolean
  margin?: string
  active: boolean
  color?: string
  size?: string
  spinnerSize?: string
}

const Loader = ({
  color = '',
  size = '2.5em',
  margin = '0',
  spinnerSize = '6px',
  active,
  left = false,
}: LoaderProps) => {
  const spinner = <Spinner color={color} size={size} />

  if (left) {
    return (
      <HolderLeft margin={margin} className={`${active ? 'loader-active' : ''}`}>
        {spinner}
      </HolderLeft>
    )
  }
  return (
    <Holder
      spinnerSize={spinnerSize}
      margin={margin}
      className={`${active ? 'loader-active' : ''}`}
    >
      {spinner}
    </Holder>
  )
}

export default Loader

type HolderProps = {
  margin: string
  spinnerSize?: string
}

const Holder = withCustomProps(styled.div<HolderProps>)`
  display: none;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  overflow: visible;
  margin: 0;
  &.loader-active {
    display: flex;
    margin: ${props => props.margin};
    div {
      border-width: ${p => p.spinnerSize};
    }
  }
`

type SpinnerProps = {
  size: string
  spinnerSize?: string
}

export const Spinner = withCustomProps(styled.div<SpinnerProps>)`
  height: ${p => p.size};
  width: ${p => p.size};
  animation: spinner 0.8s infinite linear;
  border: ${p => p.spinnerSize} solid ${p => (p.color ? p.color : p.theme.color.primary)};
  border-right-color: transparent;
  border-radius: 50%;
  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const HolderLeft = styled(Holder)`
  justify-content: left;
  padding: 0 0 0 1em;
`
