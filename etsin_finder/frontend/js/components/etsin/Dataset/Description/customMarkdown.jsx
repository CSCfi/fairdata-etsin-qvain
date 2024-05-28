import styled from 'styled-components'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const CustomMarkdown = styled(ReactMarkdown).attrs({ remarkPlugins: remarkGfm })`
  > * {
    &:first-child {
      margin-top: 0 !important;
    }
    &:last-child {
      margin-bottom: 0 !important;
    }
  }

  a {
    color: ${p => p.theme.color.primary};
    text-decoration: none;
    &.absent {
      color: ${p => p.theme.color.error};
    }
    &.anchor {
      display: block;
      padding-left: 30px;
      margin-left: -30px;
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 20px 0 10px;
    padding: 0;
    font-weight: bold;
    -webkit-font-smoothing: antialiased;
    cursor: text;
    position: relative;
  }

  h2:first-child {
    margin-top: 0;
    padding-top: 0;
  }

  h1:first-child {
    margin-top: 0;
    padding-top: 0;
    + h2 {
      margin-top: 0;
      padding-top: 0;
    }
  }

  h3:first-child,
  h4:first-child,
  h5:first-child,
  h6:first-child {
    margin-top: 0;
    padding-top: 0;
  }

  h1:hover a.anchor,
  h2:hover a.anchor,
  h3:hover a.anchor,
  h4:hover a.anchor,
  h5:hover a.anchor,
  h6:hover a.anchor {
    text-decoration: none;
  }

  h1 {
    tt,
    code {
      font-size: inherit;
    }
  }

  h2 {
    tt,
    code {
      font-size: inherit;
    }
  }

  h3 {
    tt,
    code {
      font-size: inherit;
    }
  }

  h4 {
    tt,
    code {
      font-size: inherit;
    }
  }

  h5 {
    tt,
    code {
      font-size: inherit;
    }
  }

  h6 {
    tt,
    code {
      font-size: inherit;
    }
  }

  h1 {
    font-size: 28px;
    color: black;
  }

  h2 {
    font-size: 24px;
    border-bottom: 1px solid ${p => p.theme.color.medgray};
    color: black;
  }

  h3 {
    font-size: 18px;
  }

  h4 {
    font-size: 16px;
  }

  h5 {
    font-size: 14px;
  }

  h6 {
    color: ${p => p.theme.color.darkgray};
    font-size: 14px;
  }

  p,
  blockquote,
  ul,
  ol,
  dl,
  li,
  table,
  pre {
    margin: 15px 0;
    color: ${p => p.theme.color.darkgray};
  }

  hr {
    border: 0 none;
    color: ${p => p.theme.color.medgray};
    height: 4px;
    padding: 0;
  }

  body > {
    h2:first-child {
      margin-top: 0;
      padding-top: 0;
    }
    h1:first-child {
      margin-top: 0;
      padding-top: 0;
      + h2 {
        margin-top: 0;
        padding-top: 0;
      }
    }
    h3:first-child,
    h4:first-child,
    h5:first-child,
    h6:first-child {
      margin-top: 0;
      padding-top: 0;
    }
  }

  a:first-child {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 0;
      padding-top: 0;
    }
  }

  h1 p,
  h2 p,
  h3 p,
  h4 p,
  h5 p,
  h6 p {
    margin-top: 0;
  }

  li p.first {
    display: inline-block;
  }

  ul,
  ol {
    padding-left: 30px;
    list-style: initial;
  }

  ul :first-child,
  ol :first-child {
    margin-top: 0;
  }

  ul :last-child,
  ol :last-child {
    margin-bottom: 0;
  }

  dl {
    padding: 0;
    dt {
      font-size: 14px;
      font-weight: bold;
      font-style: italic;
      padding: 0;
      margin: 15px 0 5px;
      &:first-child {
        padding: 0;
      }
      > {
        :first-child {
          margin-top: 0;
        }
        :last-child {
          margin-bottom: 0;
        }
      }
    }
    dd {
      margin: 0 0 15px;
      padding: 0 15px;
      > {
        :first-child {
          margin-top: 0;
        }
        :last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  blockquote {
    border-left: 4px solid ${p => p.theme.color.medgray};
    padding: 0 15px;
    color: ${p => p.theme.color.darkgray};
    > {
      :first-child {
        margin-top: 0;
      }
      :last-child {
        margin-bottom: 0;
      }
    }
  }

  table {
    padding: 0;
    tr {
      border-top: 1px solid ${p => p.theme.color.medgray};
      background-color: white;
      margin: 0;
      padding: 0;
      &:nth-child(2n) {
        background-color: ${p => p.theme.color.superlightgray};
      }
      th {
        font-weight: bold;
        border: 1px solid ${p => p.theme.color.medgray};
        text-align: left;
        margin: 0;
        padding: 6px 13px;
      }
      td {
        border: 1px solid ${p => p.theme.color.medgray};
        text-align: left;
        margin: 0;
        padding: 6px 13px;
      }
      th :first-child,
      td :first-child {
        margin-top: 0;
      }
      th :last-child,
      td :last-child {
        margin-bottom: 0;
      }
    }
  }

  img {
    max-width: 100%;
  }

  span {
    &.frame {
      display: block;
      overflow: hidden;
      > span {
        border: 1px solid ${p => p.theme.color.medgray};
        display: block;
        float: left;
        overflow: hidden;
        margin: 13px 0 0;
        padding: 7px;
        width: auto;
      }
      span {
        img {
          display: block;
          float: left;
        }
        span {
          clear: both;
          color: #333333;
          display: block;
          padding: 5px 0 0;
        }
      }
    }
    &.align-center {
      display: block;
      overflow: hidden;
      clear: both;
      > span {
        display: block;
        overflow: hidden;
        margin: 13px auto 0;
        text-align: center;
      }
      span img {
        margin: 0 auto;
        text-align: center;
      }
    }
    &.align-right {
      display: block;
      overflow: hidden;
      clear: both;
      > span {
        display: block;
        overflow: hidden;
        margin: 13px 0 0;
        text-align: right;
      }
      span img {
        margin: 0;
        text-align: right;
      }
    }
    &.float-left {
      display: block;
      margin-right: 13px;
      overflow: hidden;
      float: left;
      span {
        margin: 13px 0 0;
      }
    }
    &.float-right {
      display: block;
      margin-left: 13px;
      overflow: hidden;
      float: right;
      > span {
        display: block;
        overflow: hidden;
        margin: 13px auto 0;
        text-align: right;
      }
    }
  }
  code,
  tt {
    margin: 0 2px;
    padding: 0 5px;
    white-space: nowrap;
    background-color: ${p => p.theme.color.superlightgray};
    border-radius: 3px;
  }
  pre code {
    margin: 0;
    line-height: 1em;
    padding: 0;
    white-space: pre;
    border: none;
    background: transparent;
  }

  pre {
    background-color: ${p => p.theme.color.superlightgray};
    overflow: auto;
    padding: 9px 15px;
    border-radius: 5px;
    margin-bottom: 10px;
  }

  pre code,
  pre tt {
    background-color: transparent;
    border: none;
  }
`

export default CustomMarkdown
