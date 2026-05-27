import { merge, cloneDeep } from 'lodash-es'

import { getEtsinPortalConfig } from '@/etsinPortals/registry'
import lumiAifSearchHeroImage from '@/assets/images/lumi-aif-search-hero.png'

/** Original Fairdata light gray; used where LUMI theme overrides `lightgray` but pills need the base tone. */
export const ETSIN_BASE_LIGHTGRAY = 'rgb(231, 233, 237)'

const defaultUi = {
  body: {
    fontFamily: "'Lato', Helvetica, Arial, sans-serif",
    letterSpacing: 'normal',
  },
  paragraph: {
    fontFamily: "'Lato', sans-serif",
    fontSize: '1em',
  },
  hero: {
    primaryBackgroundColor: '#007FAD',
    primaryBackgroundImage: 'none',
    primaryBackgroundSize: 'cover',
    primaryBackgroundPosition: 'center',
    gradientOverlayOpacity: '0',
    gradientBlend: '#06144b',
  },
  footer: {
    backgroundColor: 'transparent',
  },
  contentBox: {
    backgroundColor: 'transparent',
  },
  search: {
    filterContainerBg: 'transparent',
    sortControl: {
      backgroundColor: 'transparent',
      fontSize: 'inherit',
    },
    resultsPanel: {
      backgroundColor: 'transparent',
      padding: '0',
      margin: '0',
      marginTop: '3rem',
      width: '100%',
      borderRadius: '0',
    },
    resultsAmountPeriod: {
      color: 'rgb(115, 115, 115)',
    },
    noResultsHint: {
      color: 'inherit',
    },
    resultListItemTitle: {
      fontSize: '1.4em',
    },
    resultsListAccessRights: {
      fontSize: '1em',
      linkBackground: ETSIN_BASE_LIGHTGRAY,
      linkColor: 'inherit',
    },
    filterCategory: {
      backgroundColor: ETSIN_BASE_LIGHTGRAY,
      fontSize: '1em',
    },
    filterItems: {
      backgroundColor: 'transparent',
      listButtonFontSize: '1em',
    },
    clearFiltersFontSize: '1em',
  },
  dataset: {
    tabs: {
      navLinkBorder: 'none',
      navLinkActiveColor: 'black',
    },
    content: {
      marginTop: '0',
      backgroundColor: 'transparent',
      border: 'none',
      borderTop: 'initial',
      boxShadow: '0px 4px 7px 3px #eaf4f8',
    },
    title: {
      headingColor: 'rgb(50, 50, 50)',
      labelColor: 'rgb(79, 79, 79)',
      labelBackground: ETSIN_BASE_LIGHTGRAY,
    },
    accessRights: {
      buttonColor: 'rgb(79, 79, 79)',
      buttonBorder: ETSIN_BASE_LIGHTGRAY,
      buttonBackground: ETSIN_BASE_LIGHTGRAY,
      buttonHoverColor: 'rgb(79, 79, 79)',
    },
    panel: {
      borderRadius: '0',
    },
    backButton: {
      backgroundColor: 'transparent',
      color: '#007FAD',
      padding: '0',
      borderRadius: '0',
      border: 'none',
      fontWeight: '400',
      hoverBackgroundColor: 'transparent',
      hoverColor: '#007FAD',
    },
    remoteResourceLink: {
      color: '#0E8632',
      pathMaxWidth: '22rem',
    },
    copyButton: {
      transform: 'none',
      iconColor: null,
    },
    citationButton: {
      iconColor: null,
    },
    iconButton: {
      transform: 'none',
      iconTransform: 'none',
    },
    sidebarIdentifier: {
      copyIconColor: null,
      copyIconBorder: null,
      copyButtonTransform: 'none',
    },
    sidebarArea: {
      backgroundColor: '#E5EFF1',
    },
    agent: {
      linkColor: '#025B96',
      rowHoverBackground: 'transparent',
      rowHoverColor: '#025B96',
      rowHoverBorder: 'none',
    },
  },
}

const lumiUi = {
  body: {
    fontFamily: "'Mr Eaves XL Mod OT', 'Lato', Helvetica, Arial, sans-serif",
    letterSpacing: '1px',
  },
  paragraph: {
    fontFamily: "'Mr Eaves XL Mod OT', 'Lato', Helvetica, Arial, sans-serif",
    fontSize: 'calc(1em + 1px)',
  },
  hero: {
    primaryBackgroundColor: '#06144b',
    primaryBackgroundImage: `url(${lumiAifSearchHeroImage})`,
    primaryBackgroundSize: '50% auto',
    primaryBackgroundPosition: 'right center',
    gradientOverlayOpacity: '1',
    gradientBlend: '#06144b',
  },
  footer: {
    backgroundColor: 'white',
  },
  contentBox: {
    backgroundColor: 'white',
  },
  search: {
    filterContainerBg: 'white',
    sortControl: {
      backgroundColor: 'white',
      fontSize: 'calc(1em + 1px)',
    },
    resultsPanel: {
      backgroundColor: 'white',
      padding: '1.5rem',
      margin: '0.75rem auto',
      marginTop: '1rem',
      width: 'calc(100% - 1.5rem)',
      borderRadius: '0.3rem',
    },
    resultsAmountPeriod: {
      color: '#231f20',
    },
    noResultsHint: {
      color: '#231f20',
    },
    resultListItemTitle: {
      fontSize: 'calc(1.4em + 1px)',
    },
    resultsListAccessRights: {
      fontSize: 'calc(1em + 1px)',
      linkBackground: ETSIN_BASE_LIGHTGRAY,
      linkColor: 'black',
    },
    filterCategory: {
      backgroundColor: '#ffffff',
      fontSize: 'calc(1em + 1px)',
    },
    filterItems: {
      backgroundColor: 'white',
      listButtonFontSize: 'calc(1em + 1px)',
    },
    clearFiltersFontSize: 'calc(1em + 1px)',
  },
  dataset: {
    tabs: {
      navLinkBorder: '', // filled with theme.colors in component
      navLinkActiveColor: 'black',
    },
    content: {
      marginTop: '-1rem',
      backgroundColor: 'white',
      border: '', // `2px solid ${bgSecondary}` in component
      borderTop: 'none',
      boxShadow: '0 1px 3px rgba(35, 31, 32, 0.08)',
    },
    title: {
      headingColor: '#231f20',
      labelColor: 'black',
      labelBackground: ETSIN_BASE_LIGHTGRAY,
    },
    accessRights: {
      buttonColor: 'black',
      buttonBorder: ETSIN_BASE_LIGHTGRAY,
      buttonBackground: ETSIN_BASE_LIGHTGRAY,
      buttonHoverColor: 'black',
    },
    panel: {
      borderRadius: '0.3rem',
    },
    backButton: {
      backgroundColor: '#ffffff',
      color: '#231f20',
      padding: '0.35em 0.75em',
      borderRadius: '0.3em',
      border: '1px solid #2c6789',
      fontWeight: '700',
      hoverBackgroundColor: '#7477b8',
      hoverColor: '#231f20',
    },
    remoteResourceLink: {
      color: '#7477b8',
      pathMaxWidth: '17rem',
    },
    copyButton: {
      transform: 'translateY(1px)',
      iconColor: '#2c6789',
    },
    citationButton: {
      iconColor: '#2c6789',
    },
    iconButton: {
      transform: 'translateY(1px)',
      iconTransform: 'translateY(-0.5px)',
    },
    sidebarIdentifier: {
      copyIconColor: '#2c6789',
      copyIconBorder: '#2c6789',
      copyButtonTransform: 'translateY(1px)',
    },
    sidebarArea: {
      backgroundColor: '#e2e6f0',
    },
    agent: {
      linkColor: '#2c6789',
      rowHoverBackground: '#2c6789',
      rowHoverColor: '#ffffff',
      rowHoverBorder: '1px solid #2c6789',
    },
  },
}

const etsinTheme = {
  color: {
    bgPrimary: 'white',
    bgLight: '#f7f7f7',
    bgSecondary: 'rgb(235, 235, 235)',
    bgGreen: '#E5EFF1',
    primaryLight: '#eaf4f8',
    primary: '#007FAD',
    primaryDark: '#004d79',
    secondary: 'rgb(235, 235, 235)',
    white: 'white',
    superlightgray: 'rgb(246, 246, 246)',
    lightgray: 'rgb(231, 233, 237)',
    medgray: 'rgb(180, 180, 180)',
    gray: 'rgb(115, 115, 115)',
    darkgray: '#4f4f4f',
    superdarkgray: 'rgb(50, 50, 50)',
    dark: '#4F4F4F',
    darker: '#212529',
    error: '#eb6672',
    errorDark: '#b05158',
    yellow: '#FFBD39',
    success: '#0E8632',
    insetDark: 'rgba(0, 0, 0, 0.3)',
    linkColorUIV2: '#025B96',
    linkColor: 'rgb(0, 98, 134)',
    redText: '#ce0000',
    itemBackgroundLight: '#eef2f8',
    tags: {
      green: '#0C772C',
      brightGreen: '#DBFFE6',
      yellow: '#946201',
      brightYellow: '#FFF0CA',
      blue: '#002F5F',
      brightBlue: '#E8F9FF',
    },
  },
  breakpoints: {
    xs: '410px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  ui: defaultUi,
}

/** Resolve nav link border for LUMI (uses palette). */
export function resolveDatasetTabsNavLinkBorder(theme) {
  if (theme.ui.dataset.tabs.navLinkBorder === '') {
    return `2px solid ${theme.color.bgSecondary}`
  }
  return theme.ui.dataset.tabs.navLinkBorder
}

export function resolveDatasetContentBorder(theme) {
  if (theme.ui.dataset.content.border === '') {
    return `2px solid ${theme.color.bgSecondary}`
  }
  return theme.ui.dataset.content.border
}

// Create new theme by merging changes recursively
export const lumiAifEtsinTheme = merge(cloneDeep(etsinTheme), {
  color: {
    bgPrimary: '#231f20',
    bgLight: '#7477b8',
    bgSecondary: '#e2e6f0',
    bgGreen: '#7477b8',
    primaryLight: '#7477b8',
    primary: '#2c6789',
    primaryDark: '#231f20',
    secondary: '#7477b8',
    superlightgray: '#ffffff',
    lightgray: '#ffffff',
    dark: '#231f20',
    darker: '#231f20',
    success: '#2c6789',
    linkColorUIV2: '#2c6789',
    linkColor: '#2c6789',
    itemBackgroundLight: '#ffffff',
  },
  ui: lumiUi,
})

export const getThemeByApp = app => {
  return getEtsinPortalConfig(app).id === 'lumi-aif' ? lumiAifEtsinTheme : etsinTheme
}

export default etsinTheme
