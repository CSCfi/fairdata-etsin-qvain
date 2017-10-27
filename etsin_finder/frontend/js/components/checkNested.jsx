const checkNested = (obj, ...argus) => {
  const args = Array.prototype.slice.call(argus, 0);
  let newObj = obj
  for (let i = 0; i < args.length; i += 1) {
    if (!newObj || !Object.prototype.hasOwnProperty.call(newObj, args[i])) {
      return false;
    }
    newObj = newObj[args[i]];
  }
  return true;
}

export default checkNested
