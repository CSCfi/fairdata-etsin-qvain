import { useEffect } from 'react'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import { useStores } from '@/utils/stores'
import { Tab, TabRow } from '@/components/general/Tab'

export const Tabs = () => {
  const {
    QvainDatasets: { tabs, Auth },
    Env: {
      Flags: { flagEnabled },
    },
  } = useStores()

  useEffect(() => {
    if (Auth.user.admin_organizations?.length > 0) {
      tabs.addOption('adminDatasets', 'qvain.datasets.tabs.admin')
      if (flagEnabled('QVAIN.REMS')) {
        tabs.addOption('applications', 'qvain.datasets.tabs.applications')
      }
      tabs.setActive('adminDatasets')
    }
  }, [Auth.user.admin_organizations, tabs, flagEnabled])

  return (
    <TabRow>
      {Object.entries(tabs.options).map(([id, label]) => (
        <Translate
          component={Tab}
          content={label}
          key={id}
          aria-selected={tabs.active === id}
          onClick={() => tabs.setActive(id)}
        />
      ))}
    </TabRow>
  )
}

export default observer(Tabs)
