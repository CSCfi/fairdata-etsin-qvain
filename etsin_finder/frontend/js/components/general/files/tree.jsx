import { Fragment } from 'react'
import PropTypes from 'prop-types'
import Translate from '@/utils/Translate'

import { LinkButton } from '../button'
import { ItemRow, Items, ItemSpacer, isDirectory } from './items'
import DefaultLoader from '../loader'
import FilterRow from './FilterRow'

// propagate properties from parent directories
const getParentArgs = (directoryView, parent, parentArgs) => ({
  parentChecked: !!(directoryView.isChecked(parent) || parentArgs.parentChecked),
  parentAdded: !!(parent.added || (parentArgs.parentAdded && !parent.removed)),
  parentRemoved: !!(parent.removed || (parentArgs.parentRemoved && !parent.added)),
})

// limit how many items are shown at once for a directory
export const ShowMore = ({ directoryView, parent, level }) => (
  <ItemRow key="more">
    <ItemSpacer level={level} />
    <Translate
      component={LinkButton}
      content="general.showMore"
      onClick={() => directoryView.showMore(parent)}
    />
  </ItemRow>
)

ShowMore.propTypes = {
  directoryView: PropTypes.object.isRequired,
  parent: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
}

// draw child items recursively
const drawChildren = (treeProps, parent, level = 0, parentArgs = {}) => {
  const { Item, EmptyHelp, directoryView, moreItemsLevel, filterByService } = treeProps

  const newParentArgs = getParentArgs(directoryView, parent, parentArgs)

  let filterFunc = v => v
  if (filterByService) {
    filterFunc = v => v.serviceCreated === filterByService
  }

  const items = directoryView.getItems(parent).filter(filterFunc)
  const hasMore = directoryView.hasMore(parent)

  return (
    <>
      <FilterRow
        parent={parent}
        items={items}
        level={level + moreItemsLevel - 1}
        directoryView={directoryView}
      />
      {items.map(item => (
        <Fragment key={item.key}>
          <Item treeProps={treeProps} item={item} level={level} parentArgs={newParentArgs} />
          {isDirectory(item) &&
            directoryView.isOpen(item) &&
            drawChildren(treeProps, item, level + 1, newParentArgs)}
        </Fragment>
      ))}
      {hasMore && (
        <ShowMore directoryView={directoryView} parent={parent} level={level + moreItemsLevel} />
      )}
      {items.length === 0 && level === 0 && <EmptyHelp />}
    </>
  )
}

// returns a function for rendering a file hierarchy
export const useRenderTree = (
  {
    Files,
    directoryView,
    Loader = null,
    Item, // component used for rendering a single item
    EmptyHelp = () => null, // component shown when there are no visible items
    NoProjectHelp = () => null, // component shown when project root fails to load
    moreItemsLevel = 0, // indentation for the "Show All Items" button to account for space taken by buttons
    filterByService = 'ida', // show only items created by specific service
  },
  extraProps
) => {
  const renderTree = () => {
    const { root, isLoadingProject, selectedProject } = Files
    const treeProps = {
      Files,
      Item,
      directoryView,
      moreItemsLevel,
      EmptyHelp,
      extraProps,
      filterByService,
    }
    const LoaderComponent = Loader || DefaultLoader

    if (isLoadingProject) {
      return <LoaderComponent active />
    }

    if (selectedProject && !root) {
      return <NoProjectHelp />
    }

    return <Items>{root && drawChildren(treeProps, root)}</Items>
  }

  return { renderTree }
}

export default useRenderTree
