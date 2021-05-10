export const formatCurl = url => url && `curl -fOJ "${url}"`

export const formatWget = url => url && `wget --content-disposition "${url}"`
