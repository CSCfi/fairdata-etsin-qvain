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
  cy,
}) => (
  <BoxButton
    onClick={onClick}
    className={className}
    selected={selected}
    disabled={disabled}
    cy={cy}
  >
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
  cy: PropTypes.string,
}

CatalogButton.defaultProps = {
  title: '',
  className: '',
  selected: false,
  disabled: false,
  cy: '',
}

const getOpacy = p => opacify(-0.8, p.disabled ? p.theme.color.darkgray : p.theme.color.primary)

const Button = styled.button.attrs({
  type: 'button',
})`
  line-height: inherit;
  font-size: 14px;
  border-radius: 10px;
  border: 2px solid;
  padding: 16px 16px;
  min-height: 6rem;
  display: flex;
  align-items: stretch;
  width: 100%;
  flex-grow: 1;
  background: #fff;
  cursor: pointer;

  @media screen and (max-width: ${p => p.theme.breakpoints.sm}) {
    justify-content: center;
  }

  @media screen and (max-width: ${p => p.theme.breakpoints.lg}) {
    padding: 1rem 2.5rem;
  }

  @media screen and (max-width: ${p => p.theme.breakpoints.md}) {
    padding: 1rem 1.5rem;
  }
`

const ActiveButton = styled(Button)`
  color: inherit;
  border-color: ${p => getOpacy(p)};

  :hover {
    box-shadow: 0 3px 6px ${p => getOpacy(p)};
    border-color: ${p => p.theme.color.primary};
    color: ${p => p.theme.color.primaryDark};
    background: #fcfeff;
  }
`

const SelectedButton = styled(Button).attrs({ className: 'selected' })`
  color: ${p => p.theme.color.primaryDark};
  border-color: ${p => p.theme.color.primary};
`

const DisabledButton = styled(Button)`
  color: ${p => p.theme.color.gray}
  background-color: ${p => p.theme.color.lightGray};
  border-color: ${p => p.theme.color.lightGray};
  cursor: auto;
`

export function BoxButton({ children, selected, disabled, onClick, cy }) {
  if (disabled)
    return (
      <DisabledButton disabled onClick={onClick} data-cy={cy}>
        {children}
      </DisabledButton>
    )
  if (selected)
    return (
      <SelectedButton onClick={onClick} data-cy={cy}>
        {children}
      </SelectedButton>
    )
  return (
    <ActiveButton onClick={onClick} data-cy={cy}>
      {children}
    </ActiveButton>
  )
}

BoxButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  cy: PropTypes.string,
}

BoxButton.defaultProps = {
  selected: false,
  disabled: false,
  cy: '',
}

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
