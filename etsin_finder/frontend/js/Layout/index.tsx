import { useRef } from 'react'
import { observer } from 'mobx-react'

import ErrorBoundary from '../components/general/errorBoundary'
import AnnounceAndReset from '../components/general/announceAndReset'
import SkipToContent from '../components/general/skipToContent'
import Header from '../components/header'
import Footer from './Footer'
import Content from './Content'
import QvainHeader from '../components/qvain/general/header'
import { useStores } from '../stores/stores'
import LoginErrorModal from './LoginErrorModal'

const Layout = () => {
  const content = useRef<HTMLElement>(null)
  const {
    Env: { isQvain },
  } = useStores()

  const focusContent = () => {
    if (content.current) {
      content.current.focus()
    }
  }

  return (
    <ErrorBoundary>
      <AnnounceAndReset />
      <header>
        <SkipToContent callback={focusContent} />
        {isQvain ? <QvainHeader /> : <Header />}
      </header>
      <Content contentRef={content} />
      <Footer />
      <LoginErrorModal />
    </ErrorBoundary>
  )
}

export default observer(Layout)
