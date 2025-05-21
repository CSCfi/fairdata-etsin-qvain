import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import ConfirmDialog from './confirmDialog'
import { useStores } from '../../utils/stores'

const LooseProvenanceDialog = () => {
  const {
    Qvain: { promptLooseProvenances, provenancesWithNonExistingActors },
    Locale: { lang },
  } = useStores()
  const getLooseProvenanceDialogProps = () => ({
    show: !!promptLooseProvenances,
    onCancel: () => promptLooseProvenances(false),
    onConfirm: () => promptLooseProvenances(true),
    content: {
      warning: (
        <>
          <Translate content={'qvain.general.looseProvenances.warning'} component="p" />
          <div>{provenancesWithNonExistingActors.map(p => p.name[lang] || p.name.und)}</div>
          <div style={{ margin: 10 }} />
          <Translate
            content={'qvain.general.looseProvenances.question'}
            style={{ fontWeight: 600 }}
          />
        </>
      ),
      confirm: <Translate content={'qvain.general.looseProvenances.confirm'} />,
      cancel: <Translate content={'qvain.general.looseProvenances.cancel'} />,
    },
  })

  return <ConfirmDialog {...getLooseProvenanceDialogProps()} />
}

export default observer(LooseProvenanceDialog)
