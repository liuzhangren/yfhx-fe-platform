import request from '@/utils/request';

export async function getOrgData(query) {
  return request('/get/v1/porgs', {
    params: query
  })
}
export async function getOrgTreeData() {
  return request('/get/v1/org-tree')
}

export async function addOrgData({porg}) {
  return request('/post/v1/porg', {
    method: 'post',
    data: porg
  })
}

export async function delManyOrgData(params) {
  const ids = params
  return request(`/delete/v1/porgs/${ids}`, {
    method: 'delete'
  })
}

export async function delOneOrgData(id) {
  return request(`/delete/v1/porg/${id}`, {
    method: 'delete'
  })
}

export async function updateOrgData(data) {
  return request(`/put/v1/porg`, {
    method: 'put',
    data
  })
}

export async function getExecutive(orgNo) {
  return request(`/get/v1/director/${orgNo}`)
}