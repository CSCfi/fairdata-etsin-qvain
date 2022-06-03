import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { opacify } from 'polished'
import Image from './Image'

export const CatalogButton = ({
  children,
  onClick,
  title,
  selected,
  image,
  className,
  disabled,
}) => (
  <BoxButton onClick={onClick} className={className} selected={selected} disabled={disabled}>
    <BoxContent>
      <TitleArea>
        <Image src={image} disabled={disabled} />
      </TitleArea>
      <BoxText>
        {title && <BoxTitle>{title}</BoxTitle>}
        {children}
      </BoxText>
    </BoxContent>
  </BoxButton>
)

const TitleArea = styled.div`
  display: flex;
  align-items: center;
  margin: 0;
`

CatalogButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  image: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
}

CatalogButton.defaultProps = {
  title: '',
  className: '',
  selected: false,
  disabled: false,
}

const getOpacy = p => opacify(-0.8, p.disabled ? p.theme.color.darkgray : p.theme.color.primary)

const float = p =>
  !p.selected &&
  `
box-shadow: 0 3px 6px ${getOpacy(p)};
border: 2px solid ${getOpacy(p)};
color: ${p.disabled ? p.theme.color.gray : p.theme.color.primaryDark};
background: #fcfeff;
position: relative;
`

const BoxButton = styled.button.attrs({
  type: 'button',
})`
  color: inherit;
  line-height: inherit;
  border: 2px solid ${p => p.theme.color.primary};
  box-shadow: 0 3px 6px #00000027;
  border-radius: 10px;
  padding: 16px 16px;
  min-height: 6rem;
  display: flex;
  align-items: stretch;
  font-size: 14px;
  width: 100%;
  flex-grow: 1;
  background: #fff;

  @media screen and (max-width: ${p => p.theme.breakpoints.sm}) {
    justify-content: center;
  }

  @media screen and (max-width: ${p => p.theme.breakpoints.lg}) {
    padding: 1rem 2.5rem;
  }

  @media screen and (max-width: ${p => p.theme.breakpoints.md}) {
    padding: 1rem 1.5rem;
  }

  ${float}
`

const BoxTitle = styled.div`
  font-weight: bold;
  flex-wrap: nowrap;
  margin-right: 0.5rem;
  flex-shrink: 0;
  text-transform: uppercase;
`

const BoxText = styled.div`
  font-weight: 500;
  flex-grow: 0.7;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;

  flex-basis: 8em;
  @media screen and (max-width: ${p => p.theme.breakpoints.sm}) {
    flex-basis: auto;
  }
`

const BoxContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: -0.25rem -0.5rem;
  > * {
    margin: 0.25rem 0.5rem;
  }

  @media screen and (max-width: ${p => p.theme.breakpoints.sm}) {
    flex-direction: column;
    text-align: center;
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
    ${BoxTitle} {
      margin-right: 0;
    }

    ${BoxButton} {
      padding: 1rem 0.5rem;
    }
  }
`

export default CatalogButton
