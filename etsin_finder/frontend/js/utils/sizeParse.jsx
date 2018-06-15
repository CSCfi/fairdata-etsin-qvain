const sizeParse = (bytes, decimals) => {
  if (!bytes) return null
  if (bytes === 0) return '0 Bytes'
  if (bytes === 1) return '1 Byte'
  const k = 1024
  const dm = typeof decimals === 'number' ? decimals : 2
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const pow = k ** i
  return `${parseFloat((bytes / pow).toFixed(dm))} ${sizes[i]}`
}

export default sizeParse
