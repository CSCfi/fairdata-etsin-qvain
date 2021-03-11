const devMetadataCreator = 'abc-user-123' // Teppo Testaaja

export const checkLogin = props => {
  const inDev = props.Stores.Env.environment === 'development'
  if (inDev) {
    return Promise.resolve()
  }
  return props.Stores.Auth.checkLogin()
}

export const getUsername = props => {
  const inDev = props.Stores.Env.environment === 'development'
  if (inDev && isTeppo(props)) {
    return devMetadataCreator
  }
  return props.Stores.Auth.user.name
}

export const isTeppo = props => props.Stores.Auth.user.commonName === 'Teppo Testikäyttäjä'
