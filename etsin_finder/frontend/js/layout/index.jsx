
import { useRef } from 'react'
import { observer } from 'mobx-react'

import ErrorBoundary from '../components/general/errorBoundary'
import KeepAlive from '../components/general/keepAlive'
import AnnounceAndReset from '../components/general/announceAndReset'
import SkipToContent from '../components/general/skipToContent'
import Header from '../components/header'
import Footer from './footer'
import Content from './content'
import QvainHeader from '../components/qvain/general/header'
import { useStores } from '../stores/stores'
import LoginErrorModal from './LoginErrorModal'

const Layout = () => {
  const content = useRef()
  const {
    Env: { isQvain },
  } = useStores()

  const focusContent = () => {
    this.content.current.focus()
  }

  return (
    <ErrorBoundary>
      <KeepAlive loginThroughService={isQvain ? 'qvain' : 'etsin'} />
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
