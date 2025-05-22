import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import { useStores } from '@/stores/stores'

const Translate = ({ children, content, attributes, component, with: _with, unsafe, ...props }) => {
  const { Locale } = useStores()

  let translation
  if (content) {
    translation = Locale.translate(content, { ..._with })
  }

  const translatedAttributes = {}
  for (const key of Object.keys(attributes)) {
    if (attributes[key]) {
      translatedAttributes[key] = Locale.translate(attributes[key], { ..._with })
    }
  }

  // If present, content replaces children
  const C = component
  if (unsafe && translation != null) {
    return (
      <C dangerouslySetInnerHTML={{ __html: translation }} {...props} {...translatedAttributes} />
    )
  }
  return (
    <C {...props} {...translatedAttributes}>
      {translation || children}
    </C>
  )
}

Translate.propTypes = {
  component: PropTypes.elementType,
  unsafe: PropTypes.bool,
  content: PropTypes.node,
  attributes: PropTypes.object,
  with: PropTypes.object, // provide context
  children: PropTypes.node,
}

Translate.defaultProps = {
  component: 'span',
  unsafe: false,
  content: undefined,
  attributes: {},
  with: undefined,
  // Omitted children: undefined to fix `hasChildren` helper returning false for Translate component
}

export default observer(Translate)
