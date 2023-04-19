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
    // success: '#53BA8A',
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
}

export default etsinTheme
