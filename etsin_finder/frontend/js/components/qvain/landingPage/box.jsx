import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Image from './image'
import { opacify } from 'polished'

export const Box = ({ children, title, arrow, blue, image, image2x, className, style }) => {
  const Div = blue ? BoxDivBlue : BoxDiv
  return (
    <BoxContainer className={className} style={style}>
      <Div>
        {title && <BoxTitle>{title}</BoxTitle>}
        <BoxContent>
          <Image src={image} src2x={image2x} />
          <BoxText>{children}</BoxText>
        </BoxContent>
      </Div>
      {arrow && <Arrow />}
    </BoxContainer>
  )
}

Box.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  image: PropTypes.string.isRequired,
  image2x: PropTypes.string,
  arrow: PropTypes.bool,
  blue: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
}

Box.defaultProps = {
  title: '',
  image2x: undefined,
  className: '',
  blue: false,
  arrow: false,
  style: undefined,
}

const BoxDiv = styled.div`
  border: 1px solid #00000011;
  box-shadow: 0 3px 6px #00000027;
  border-radius: 10px;
  padding: 1rem;
  min-height: 6rem;
  display: flex;
  align-items: center;
  font-size: 14px;
  width: 100%;
  flex-grow: 1;
`

const BoxDivBlue = styled(BoxDiv)`
  box-shadow: 0 3px 6px ${p => opacify(-0.8, p.theme.color.primary)};
  border: 1px solid ${p => opacify(-0.8, p.theme.color.primary)};
  color: ${p => p.theme.color.primaryDark};
`

const BoxTitle = styled.div`
  font-weight: bold;
  margin-right: 0.5rem;
  width: 2.5rem;
  flex-shrink: 0;
`

const BoxText = styled.div`
  font-weight: normal;
  flex-grow: 1;

  flex-basis: 8em;
  @media screen and (max-width: ${p => p.theme.breakpoints.sm}) {
    flex-basis: auto;
  }
`

const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Arrow = () => <div>&darr;</div>

const BoxContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: -0.25rem -0.5rem;
  > * {
    margin: 0.25rem 0.5rem;
  }
`

export const SideBySide = styled.div`
  display: flex;
  margin: 0 -0.5rem;
  & > * {
    margin: 0 0.5rem;
    flex-grow: 1;
    flex-basis: 12em;
  }
  @media screen and (max-width: ${p => p.theme.breakpoints.sm}) {
    ${BoxContent} {
      flex-direction: column;
    }
  }
`

export default Box
