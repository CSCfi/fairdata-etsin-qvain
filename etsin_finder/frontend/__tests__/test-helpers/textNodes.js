export const textNodes = root => {
  /* Return all nonempty text nodes contained by root element. */
  let textNodes = []

  function recurse(node) {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
      textNodes.push(node)
    }

    let currentNode = node.firstChild
    while (currentNode) {
      recurse(currentNode)
      currentNode = currentNode.nextSibling
    }
  }

  recurse(root)
  return textNodes
}

export const textValues = root => {
  /* Return trimmed text values for all nonempty text nodes contained by root element.

  For example, textValues(document) for
    <div>
      Hello<span> there </span>world!
    </div>
  will return ['Hello', 'there', 'world!']

  */
  return textNodes(root).map(node => node.data.trim())
}
