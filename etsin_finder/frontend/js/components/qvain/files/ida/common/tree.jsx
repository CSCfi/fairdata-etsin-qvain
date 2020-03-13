import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { LinkButton } from '../../../../general/button'
import { Children, ChildrenItem, ItemRow, Items, ItemSpacer, isDirectory } from './items'
import Loader from '../../../../general/loader'

// propagate properties from parent directories
const getParentArgs = (directoryView, parent, parentArgs) => ({
  parentChecked: !!(directoryView.isChecked(parent) || parentArgs.parentChecked),
  parentAdded: !!(parent.added || parentArgs.parentAdded),
  parentSelected: !!(parent.selected || parentArgs.parentSelected),
})

// limit how many items are shown at once for a directory
export const ShowMore = ({ directoryView, parent, level, count }) => (
  <ItemRow key="more">
    <ItemSpacer level={level} />
    <LinkButton onClick={() => directoryView.toggleShowAll(parent)} type="button">Show {count} more items</LinkButton>
  </ItemRow>
)

ShowMore.propTypes = {
  directoryView: PropTypes.object.isRequired,
  parent: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
}

// draw child items recursively
const drawChildren = (treeProps, parent, level = 0, parentArgs = {}) => {
  let items = [].concat(parent.directories || [], parent.files || [])

  const { Item, EmptyHelp, directoryView, moreItemsLevel, filterChildren } = treeProps

  const newParentArgs = getParentArgs(directoryView, parent, parentArgs)

  if (filterChildren) {
    items = filterChildren(items, parent, newParentArgs)
  }

  let hiddenCount = 0
  if (!directoryView.isShowAll(parent)) {
    if (items.length > directoryView.showLimit + directoryView.showLimitMargin) {
      hiddenCount = items.splice(directoryView.showLimit).length
    }
  }

  return (
    <Children>
      {items.map(item => (
        <Fragment key={item.key}>
          <Item treeProps={treeProps} item={item} level={level} parentArgs={newParentArgs} />
          {isDirectory(item) && directoryView.isOpen(item) && (
            <ChildrenItem>
              {drawChildren(treeProps, item, level + 1, newParentArgs)}
            </ChildrenItem>
          )}
        </Fragment>
      ))}
      {hiddenCount > 0 && <ShowMore directoryView={directoryView} parent={parent} level={level + moreItemsLevel} count={hiddenCount} />}
      {items.length === 0 && level === 0 && <EmptyHelp />}
    </Children>
  )
}

// returns a function for rendering a file hierarchy
export const useRenderTree = ({
  Files,
  directoryView,
  Item, // component used for rendering a single item
  EmptyHelp = () => null, // component shown when there are no visible items
  filterChildren = null, // function for determining which child items are shown
  moreItemsLevel = 0 // extra indentation for the "Show All Items" button
}) => {
  const renderTree = () => {
    const { root, loadingProject } = Files
    const loading = loadingProject && !loadingProject.error
    const treeProps = { Files, Item, directoryView, filterChildren, moreItemsLevel, EmptyHelp }
    return (
      <>
        {loading && <Loader active />}
        <Items>
          {root && drawChildren(treeProps, root)}
        </Items>
      </>
    )
  }

  return { renderTree }
}

export default useRenderTree
