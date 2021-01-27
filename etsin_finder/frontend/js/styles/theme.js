/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

/*
  Theme is used with styled components to get access to global variables.
  Currently these values are also in scss files.
*/

const etsinTheme = {
  color: {
    bgPrimary: 'white',
    bgLight: '#f7f7f7',
    bgSecondary: 'rgb(235, 235, 235)',
    primaryLight: '#e5f2f7',
    primary: '#007FAD',
    primaryDark: '#004d79',
    secondary: 'rgb(235, 235, 235)',
    white: 'white',
    superlightgray: 'rgb(246, 246, 246)',
    lightgray: 'rgb(231, 233, 237)',
    medgray: 'rgb(180, 180, 180)',
    gray: 'rgb(115, 115, 115)',
    darkgray: 'rgb(95, 95, 95)',
    superdarkgray: 'rgb(50, 50, 50)',
    dark: '#4F4F4F',
    darker: '#212529',
    error: '#eb6672',
    errorDark: '#b05158',
    yellow: '#FFBD39',
    // success: '#53BA8A',
    success: '#0E8632',
    insetDark: 'rgba(0, 0, 0, 0.3)',
    linkColor: 'rgb(0, 98, 134)',
    redText: '#ce0000',
    itemBackgroundLight: '#eef2f8',
  },
  breakpoints: {
    xs: '410px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
}

export default etsinTheme
