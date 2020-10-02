import React from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import ConfirmDialog from './confirmDialog'

const LooseActorsDialog = ({ Stores }) => {
  const getLooseActorsDialogProps = () => {
    const { orphanActors, promptLooseActors } = Stores.Qvain
    const { lang } = Stores.Locale
    return {
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
                const rolesStr = actor.roles.map(
                  role => `${translate(`qvain.actors.add.checkbox.${role}`)}`
                )
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
    }
  }

  return <ConfirmDialog {...getLooseActorsDialogProps()} />
}

LooseActorsDialog.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(LooseActorsDialog))
