/* eslint-disable no-var */

// The function won't be transpiled so avoid too modern features here.
function insertBeforeStyled(element) {
  // Insertion function for style-loader.
  // Makes styles from css files be inserted before styles from styled-components
  // so they can be easily overridden without modifying css.
  var parent = document.querySelector('head');
  var styled = parent.querySelector('[data-styled]')
  if (styled) {
    parent.insertBefore(element, styled)
  } else {
    parent.appendChild(element)
  }
}

module.exports = { insertBeforeStyled }
