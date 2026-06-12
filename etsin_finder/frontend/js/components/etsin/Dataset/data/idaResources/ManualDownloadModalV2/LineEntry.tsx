import { observer } from 'mobx-react'
import { CopyInput } from './Copy'
import { useStores } from '@/stores/stores'
import type { TranslationKey } from '@/stores/view/locale'

const LineEntry = ({ title, text }: { title: TranslationKey; text: string }) => {
  const {
    Locale: { translate },
  } = useStores()
  return (
    <>
      <dt>{translate(title)}</dt>
      <dd>
        <CopyInput text={text} />
      </dd>
    </>
  )
}

export default observer(LineEntry)
