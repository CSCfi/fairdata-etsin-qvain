export const checkLogin = props => {
  const inDev = props.Stores.Env.environment === 'development'
  if (inDev) {
    return Promise.resolve()
  }
  return props.Stores.Auth.checkLogin()
}

export const getUsername = props => props.Stores.Auth.user.name
