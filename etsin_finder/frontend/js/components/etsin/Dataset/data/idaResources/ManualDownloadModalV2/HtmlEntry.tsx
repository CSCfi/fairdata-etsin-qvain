import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import parse, { domToReact } from 'html-react-parser'
import { CopySpan } from './Copy'
import { useStores } from '@/stores/stores'
import type { TranslationKey } from '@/stores/view/locale'

const Display = styled.span`
  border-radius: 4px;
  border: none;
  flex-grow: 1;
  word-break: break-word;

  ol {
    list-style: disc;
    list-style-position: inside;
  }

  tt {
    font-family: monospace;

    word-break: break-all;
    display: inline-block;
    align-self: center;
  }

  b {
    font-weight: bold;
  }
`

const Row = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  gap: 0.5rem;
  position: relative;
`

const getNodeText = (node: any) => {
  let text = node.data || ''
  for (const child of node.children || []) {
    text += getNodeText(child)
  }
  return text
}

const replace = (node: any) => {
  if (node.attribs) {
    delete node.attribs.style
  }
  if (node.name === 'tt' || node.name == 'code') {
    const text = getNodeText(node)
    const children = domToReact(node.children)
    return <CopySpan text={text}>{children}</CopySpan>
  }
}

const Entry = ({ title, text }: { title: TranslationKey; text: string }) => {
  const {
    Locale: { translate },
  } = useStores()
  const parsed = parse(text, { replace })

  return (
    <>
      <Title>{translate(title)}</Title>
      <Row>
        <Display>{parsed}</Display>
      </Row>
    </>
  )
}

Entry.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
}

Entry.defaultProps = {
  text: '',
}

const Title = styled.h2`
  line-height: 1.5;
  margin-bottom: 0;
  margin-top: 0.5rem;
  font-size: 120%;
`

export default observer(Entry)
