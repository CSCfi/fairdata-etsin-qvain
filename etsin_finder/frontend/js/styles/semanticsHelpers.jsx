import { css } from 'styled-components'

const Semantics = css`
  article,
  section,
  header,
  footer,
  nav,
  aside,
  details,
  main {
    outline-style: solid;
    outline-width: 2px;
    outline-offset: -2px;
  }

  main {
    outline-color: turquoise;
  }

  article {
    outline-color: blue;
  }

  section {
    outline-color: green;
  }

  header {
    outline-color: red;
  }

  footer {
    outline-color: brown;
  }

  nav {
    outline-color: yellow;
  }

  aside {
    outline-color: purple;
  }

  details {
    outline-color: pink;
  }
`

export default Semantics
