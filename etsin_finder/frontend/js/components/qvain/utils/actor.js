export default (actor, language) => {
  if (Array.isArray(actor.label)) {
    return actor.label.map(labelPart => labelPart[language] || labelPart.und).join(', ')
  }
  return actor.label
}
