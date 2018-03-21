/*
  Theme is used with styled components to get access to global variables.
  Currently these values are also in scss files.
*/

const etsinTheme = {
  color: {
    bgPrimary: 'white',
    bgLight: '#f5f5f5',
    bgSecondary: 'rgb(235, 235, 235)',
    primary: 'rgb(77, 179, 231)',
    secondary: 'rgb(235, 235, 235)',
    white: 'white',
    superlightgray: 'rgb(246, 246, 246)',
    lightgray: 'rgb(231, 233, 237)',
    medgray: 'rgb(180, 180, 180)',
    gray: 'rgb(150, 150, 150)',
    darkgray: 'rgb(110, 110, 110)',
    dark: 'rgb(70, 70, 70)',
    error: '#eb6672',
    yellow: '#FFBD39',
    insetDark: 'rgba(0, 0, 0, 0.3)',
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
}

export default etsinTheme
