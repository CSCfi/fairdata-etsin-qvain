{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import { createGlobalStyle } from 'styled-components'
import etsinTheme from './theme'
import Grid from './grid'

const GlobalStyle = createGlobalStyle`
  /* reset */
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  /* GRID */
  ${Grid}

  /* ETSIN */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    font-family: sans-serif;
    line-height: 1.15;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    -ms-overflow-style: scrollbar;
  }

  body {
    margin: 0;
    font-weight: 400;
    line-height: 1.5;
    text-align: left;
    background-color: #fff;
    font-family: 'Lato', Helvetica, Arial, sans-serif;
    font-size: 0.92em;
    color: ${etsinTheme.color.dark};
    font-size: 1em;
    @media screen and (min-width: ${etsinTheme.breakpoints.md}) {
      font-size: 1em;
    }
  }

  strong {
    font-weight: 700;
  }

  .app {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  .content > div {
    opacity: 0;
  }

  /* --- BOOTSTRAP --- */

  .container {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
  }

  @media (min-width: 576px) {
    .container {
      max-width: 540px;
    }
  }

  @media (min-width: 768px) {
    .container {
      max-width: 720px;
    }
  }

  @media (min-width: 992px) {
    .container {
      max-width: 960px;
    }
  }

  @media (min-width: 1200px) {
    .container {
      max-width: 1140px;
    }
  }

  /* --- Other --- */

  .app {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  body:not(.user-is-tabbing) :focus,
  body:not(.user-is-tabbing) input:focus,
  body:not(.user-is-tabbing) select:focus,
  body:not(.user-is-tabbing) textarea:focus {
    outline: none;
  }
  body:not(.user-is-tabbing) .btn:focus {
    box-shadow: none;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    margin-left: 0px;
    margin-right: 0px;
    @media screen and (min-width: ${etsinTheme.breakpoints.sm}) {
      margin-left: -15px;
      margin-right: -15px;
    }
  }

  .content {
    display: flex;
    min-height: 70vh;
    min-height: calc(100vh - 4em - 200px);
    background-color: inherit;
    & > div {
      width: 100%;
      opacity: inherit;
    }
  }

  .regular-row {
    padding: 20px 0;
    @media screen and (min-width: ${etsinTheme.breakpoints.md}) {
      padding: 40px 0;
    }
  }
  .nopadding {
    padding: 0;
  }
  .error {
    color: white;
    text-align: center;
    background-color: ${etsinTheme.color.error};
    padding: 20px 0;

    a {
      color: white;
      font-weight: 700;
    }
  }

  .skip-to-content {
    position: absolute;
    left: 0;
    top: 0;
    max-width: 1px;
    max-height: 0px;
    margin-left: 0;
    text-align: center;
    overflow: hidden;
    padding: 0;
    list-style: outside none;
    background-color: transparent;
    &:focus {
      padding: 0.5em 1em;
      max-width: 200px;
      max-height: 50px;
    }
  }

  .light-border {
    border: 2px solid ${etsinTheme.color.lightgray};
  }

  .screen-reader-only {
    position: absolute;
    height: 1px;
    width: 1px;
    clip: rect(1px 1px 1px 1px); // IE 6 and 7
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: polygon(0px 0px, 0px 0px, 0px 0px);
    -webkit-clip-path: polygon(0px 0px, 0px 0px, 0px 0px);
    overflow: hidden !important;
  }

  .text-center {
    text-align: center !important;
  }

  table {
    border-collapse: collapse;
  }


  /* ---- FONTS ---- */

  input,
  button.btn,
  button,
  select,
  textarea,
  optgroup,
  option {
    font-family: inherit;
    font-size: inherit;
    font-style: inherit;
    font-weight: inherit;
  }

  h1, .heading1 {
    font-size: 2em;
    line-height: 1.4em;
    font-weight: 700;
    letter-spacing: 1px;
  }

  h2, .heading2 {
    font-size: 1.4em;
    line-height: calc(1.4 * 1.4em);
    font-weight: 700;
  }

  h3, .heading3 {
    font-size: 1.2em;
    line-height: calc(1.5 * 1.2em);
    font-weight: 700;
  }

  h4, .heading4 {
    font-size: 1.1em;
    line-height: calc(1.5 * 1.1em);
    font-weight: 700;
  }

  p, .paragraph {
    font-family: 'Lato', sans-serif;
    font-size: 1em;
    line-height: calc(1.7 * 1em);
  }

  .small-text {
    font-size: 0.875em;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  .heading1,
  .heading2,
  .heading3,
  .heading4 {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }

  p {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  a {
    text-decoration: none;
    color: ${etsinTheme.color.primary};
    &:hover {
      color: ${etsinTheme.color.primaryDark};
    }
  }

  /* modal is open */
  .ReactModal__Body--open {
    /* prevent body from scrolling */
    overflow: hidden;

    /* blur modal background */
    #root {
      filter: blur(1px);
    }
  }

  /* Visually hide element from screen, still readable for screen readers. */
  .visuallyhidden:not(:focus):not(:active) {
    position: absolute;

    width: 1px;
    height: 1px;
    margin: -1px;
    border: 0;
    padding: 0;

    white-space: nowrap;

    clip-path: inset(100%);
    clip: rect(0 0 0 0);
    overflow: hidden;
  }
`

export default GlobalStyle
