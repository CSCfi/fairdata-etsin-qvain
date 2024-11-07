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

  const remapOrg = org => {
    let _org = org
    while (_org) {
      remap(_org)
      _org = _org.parent
    }
  }

  const remapActor = actor => {
    remap(actor)
    if (actor.person) {
      remap(actor.person)
    }
    remapOrg(actor.organization)
  }

  dataset.actors?.forEach(a => remapActor(a))
  dataset.provenance?.forEach(p => p.is_associated_with?.forEach(a => remapActor(a)))
}

export default remapActorIdentifiers
