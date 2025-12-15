import { useEffect } from 'react'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import { useStores } from '@/utils/stores'
import { Tab, TabRow } from '@/components/general/Tab'

export const Tabs = () => {
  const {
    QvainDatasets: { tabs, Auth },
  } = useStores()

  useEffect(() => {
    if (Auth.user.admin_organizations?.length > 0) {
      tabs.addOption('adminDatasets', 'qvain.datasets.tabs.admin')
      tabs.setActive('adminDatasets')
    }
  }, [Auth.user.admin_organizations, tabs])

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
