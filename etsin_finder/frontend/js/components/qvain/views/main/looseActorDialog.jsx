import { observer } from 'mobx-react'

import Translate from '@/utils/Translate'
import ConfirmDialog from './confirmDialog'
import { useStores } from '../../utils/stores'

const LooseActorsDialog = () => {
  const {
    Qvain: { orphanActors, promptLooseActors },
    Locale: { lang, translate },
  } = useStores()

  const getRoleTranslation = role => translate(`qvain.actors.add.checkbox.${role}`)

  const getLooseActorsDialogProps = () => ({
    show: !!promptLooseActors,
    onCancel: () => promptLooseActors(false),
    onConfirm: () => promptLooseActors(true),
    content: {
      warning: (
        <>
          <Translate content={'qvain.general.looseActors.warning'} component="p" />
          <div>
            {(orphanActors || []).map(actor => {
              const actorName = (actor.person || {}).name || actor.organizations[0].name[lang]
              const rolesStr = actor.roles.map(getRoleTranslation)
              return `${actorName} / ${rolesStr.join(' / ')}`
            })}
          </div>
          <div style={{ margin: 10 }} />
          <Translate content={'qvain.general.looseActors.question'} style={{ fontWeight: 600 }} />
        </>
      ),
      confirm: <Translate content={'qvain.general.looseActors.confirm'} />,
      cancel: <Translate content={'qvain.general.looseActors.cancel'} />,
    },
  })

  return <ConfirmDialog {...getLooseActorsDialogProps()} />
}

export default observer(LooseActorsDialog)
