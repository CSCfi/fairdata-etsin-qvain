import { Home, Search } from '@/routes'

export const defaultEtsinNavRoutes = [
  {
    loadableComponent: Home,
    label: 'nav.home',
    path: '/',
    end: true,
  },
  {
    loadableComponent: Search,
    label: 'nav.datasets',
    path: '/datasets',
    end: false,
  },
]

/** Branded portal: single search entry at site root. */
export const lumiAifEtsinNavRoutes = [
  {
    loadableComponent: Search,
    label: 'nav.datasets',
    path: '/',
    end: true,
  },
]

/**
 * @param {import('./registry').defaultEtsinPortalConfig} portal
 */
export function getEtsinNavRoutesForPortal(portal) {
  if (portal.id === 'lumi-aif') {
    return lumiAifEtsinNavRoutes
  }
  return defaultEtsinNavRoutes
}
