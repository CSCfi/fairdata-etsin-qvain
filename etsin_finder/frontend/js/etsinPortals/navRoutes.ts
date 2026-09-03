import React from "react"
import { Home, Search } from '@/routes'

type HelpOptions = "ETSIN" | "QVAIN" | "LUMIAIF"

interface PreLoadable {
    preload: Function
} 

export type LoadableComponent = React.ReactElement & PreLoadable

export type RouteDetails = {
    loadableComponent: LoadableComponent,
    label: string,
    path: string
    end: boolean,
    help: HelpOptions,
}

export const defaultEtsinNavRoutes: RouteDetails[] = [
  {
    loadableComponent: Home,
    label: 'nav.home',
    path: '/',
    end: true,
    help: 'ETSIN',
  },
  {
    loadableComponent: Search,
    label: 'nav.datasets',
    path: '/datasets',
    end: false,
    help: 'ETSIN'
  },
]

/** Branded portal: single search entry at site root. */
export const lumiAifEtsinNavRoutes: RouteDetails[] = [
  {
    loadableComponent: Search,
    label: 'nav.datasets',
    path: '/',
    end: true,
    help: 'LUMIAIF'
  },
]

/**
 * @param {import('./registry').defaultEtsinPortalConfig} portal
 */
export function getEtsinNavRoutesForPortal(portal: any) {
  if (portal.id === 'lumi-aif') {
    return lumiAifEtsinNavRoutes
  }
  return defaultEtsinNavRoutes
}

