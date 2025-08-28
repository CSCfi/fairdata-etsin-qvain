import styled from 'styled-components'
import { darken } from 'polished'
import { Link } from 'react-router'

import { InvertedButton } from '../../../general/button'
import { StickySubHeader } from '../../general/card'
import withCustomProps from '@/utils/withCustomProps'

export const SubmitButton = styled(InvertedButton)`
  background: #fff;
  font-size: 1.2em;
  border-radius: 25px;
  padding: 5px 30px;
  border-color: #007fad;
  border: 1px solid;
`

export const ButtonContainer = styled.div`
  text-align: center;
  margin-left: auto;
  margin-right: auto;
`

export const CustomSubHeader = styled(StickySubHeader)`
  background-color: ${props => props.theme.color.superlightgray};
  justify-content: space-between;
`

export const LinkBackContainer = withCustomProps(styled.div)`
  text-align: ${props => props.position};
  white-space: nowrap;
`

export const LinkBack = styled(Link)`
  margin-left: 30px;
  color: #007fad;
  display: inline-flex;
  align-items: center;
  height: 100%;
  margin-top: 0;
`

export const LinkText = styled.span`
  color: ${props => props.theme.color.linkColor};
  font-size: 18px;
  padding-left: 5px;
  line-height: 1;
  &:hover {
    color: ${props => darken(0.1, props.theme.color.linkColor)};
  }
`
