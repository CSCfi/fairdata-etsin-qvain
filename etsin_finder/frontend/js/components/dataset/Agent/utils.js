/* eslint-disable camelcase */
export const hasExtraInfo = agent =>
  agent.contributor_role ||
  agent.contributor_type ||
  agent.member_of ||
  agent.is_part_of ||
  agent.homepage

export const flatParentOrgs = agent => {
  const { member_of, is_part_of } = agent

  let org = member_of || is_part_of
  const orgs = []
  while (org) {
    orgs.unshift({ ...org })
    org = org.is_part_of
  }
  return orgs
}

export const getOrgKey = org => org.identifier || Object.values(org.name)[0]

export const getRefDataKey = data => data.identifier || Object.values(data.pref_label)[0]
