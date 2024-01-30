const remapActorIdentifiers = dataset => {
  // Turns actor UUIDs into temporary ids, e.g. "<id>" -> "#<id>".
  // Useful when copying a V3 dataset because actor id values are specific to a dataset.
  const remap = obj => {
    const isReferenceData = !!obj.url
    if (!obj.id || isReferenceData) {
      return
    }
    if (!obj.id.toString().startsWith('#')) {
      obj.id = `#${obj.id}`
    }
  }

  for (const actor of dataset.actors) {
    remap(actor)
    if (actor.person) {
      remap(actor.person)
    }
    let org = actor.organization
    while (org) {
      remap(org)
      org = org.parent
    }
  }
}

export default remapActorIdentifiers
