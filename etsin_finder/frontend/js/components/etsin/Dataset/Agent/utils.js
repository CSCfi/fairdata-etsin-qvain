/* eslint-disable camelcase */
export const hasExtraInfo = agent =>
  agent.person || 
  agent.contributor_role || 
  agent.contributor_type || 
  agent.organization.parent || 
  agent.organization.homepage || 
  agent.organization.url

export const flatParentOrgs = (agent) => {
  let org = agent.organization
  const orgs = []
  while (org) {
    orgs.unshift({ ...org })
    org = org.parent
  }
  return orgs
}

export const getOrgKey = org => org.url || Object.values(org.pref_label)[0]

export const getRefDataKey = data => data.identifier || Object.values(data.pref_label)[0]
