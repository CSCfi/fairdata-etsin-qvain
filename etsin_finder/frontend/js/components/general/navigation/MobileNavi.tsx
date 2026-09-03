import { NavLink } from 'react-router'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCog } from '@fortawesome/free-solid-svg-icons'
import Translate from '@/utils/Translate'

import DropdownMenu from './dropdownMenu'
import LangToggle from './langToggle'
import LoginButton from './LoginButton'
import { Link } from '../Button'
import { useStores } from '@/stores/stores'

import type { RouteDetails } from '@/etsinPortals/navRoutes'
import type { ReactNode } from 'react'
import type { TranslationKey } from '@/stores/view/locale'

type MobileNaviProps = {
  helpUrl: string,
  naviRoutes: RouteDetails[],
  children: ReactNode
  loginThroughService: string
}

const MobileNavi = ({ helpUrl, naviRoutes, children, loginThroughService }: MobileNaviProps) => {
  const {
    Accessibility,
    Locale: { translate },
  } = useStores()
  return (
    <MobileItems>
      <DropdownMenu
        transparent
        buttonContent={<FontAwesomeIcon title="Menu" icon={faBars} size="lg" />}
      >
        {naviRoutes.map(route => (
          <NavItem
            key={route.path}
            end={route.end}
            to={route.path}
            onPointerOver={() => {
              if (route.loadableComponent) {
                route.loadableComponent.preload()
              }
            }}
            onClick={() => {
              Accessibility.announce(translate('changepage', { page: translate(route.label as TranslationKey) }))
            }}
          >
            <Translate content={route.label as TranslationKey} />
          </NavItem>
        ))}
      </DropdownMenu>
      <DropdownMenu
        transparent
        buttonContent={<FontAwesomeIcon title="Settings" icon={faCog} size="lg" />}
      >
        <CustomContainer>
          <Row>
            {children}
            <LangToggle mobile margin="0.4em 0.4em 0.4em 0em" />
            <Link width="100%" href={helpUrl} rel="noopener noreferrer" target="_blank">
              <Translate content="nav.help" />
            </Link>
          </Row>
        </CustomContainer>
      </DropdownMenu>
      <LoginContainer>
        <LoginButton loginThroughService={loginThroughService} />
      </LoginContainer>
    </MobileItems>
  )
}

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
`



export default MobileNavi

const MobileItems = styled.div`
  display: inline-flex;
  height: 100%;
`

const Row = styled.div`
  display: inline-flex;
  width: 100%;
  align-items: center;
`

const NavItem = styled(NavLink)`
  margin: 0.8em 1.5em;
  color: ${p => p.theme.color.dark};
  text-transform: uppercase;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
  text-decoration: none;
  font-size: 1.1em;
  span {
    position: relative;
  }
  &.active {
    color: ${p => p.theme.color.primary};
    & span::after {
      content: '';
      position: absolute;
      display: block;
      border-bottom: 2px solid ${p => p.theme.color.primary};
      width: 100%;
      bottom: -2px;
    }
  }
  &:hover {
    color: ${p => p.theme.color.primary};
  }
`

const CustomContainer = styled.div`
  margin: 0 auto;
  padding: 1em 1.3em;
  max-width: 400px;
  width: 100%;
`
