import { observer } from 'mobx-react'

import { useStores } from '@/stores/stores'
import type { TranslationKey } from '@/stores/view/locale'

type TranslateProps = {
  children?: React.ReactNode
  content?: TranslationKey
  attributes?: Record<string, any>
  component?: React.ElementType
  with?: Record<string, any>
  unsafe?: boolean
} & Record<string, any>

const Translate = ({
  children,
  content,
  attributes = {},
  component = 'span',
  with: _with = undefined,
  unsafe = false,
  ...props
}: TranslateProps) => {
  const { Locale } = useStores()

  let translation
  if (content) {
    translation = Locale.translate(content, { ..._with })
  }

  const translatedAttributes: Record<string, any> = {}
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

export default observer(Translate)
