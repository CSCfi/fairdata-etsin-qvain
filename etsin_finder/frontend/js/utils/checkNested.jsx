{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

// used to check if object contains other objects
// for example:
// let obj = { tim: { name: 'Tim', children: { bob: {name: 'Bob' }}}}
// checkNested(obj.tim, 'children', 'bob')
// returns true because tim contains children and children contains bob

const checkNested = (obj, ...argus) => {
  if (!obj) return false
  const args = Array.prototype.slice.call(argus, 0)
  let newObj = obj
  for (let i = 0; i < args.length; i += 1) {
    if (!newObj || !Object.prototype.hasOwnProperty.call(newObj, args[i])) {
      return false
    }
    newObj = newObj[args[i]]
  }
  return true
}

export default checkNested
