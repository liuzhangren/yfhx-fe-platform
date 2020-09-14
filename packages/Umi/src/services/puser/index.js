import request from '@/utils/request';

export async function saveDictUserReal(data) {
  return request('/equip/v1/bus-dict-user-real', {
    method: 'POST',
    data,
  })
}

export async function getUserDictTree(account) {
  return request(`/equip/v1/user-tree/${account}`)
}

export async function getPuserData(query) {
  return request('/get/v1/pusers', {
    params: query,
  })
}

export async function getOrgTreeData() {
  return request('/get/v1/org-tree')
}


export async function resetPwd(id) {
  return request(`/put/v1/resPwd/${id}`, {
    method: 'put',
  })
}

export async function updateManyPuserData(data) {
  return request('/put/v1/pusers', {
    method: 'put',
    data,
  })
}

export async function updatePuserData(data) {
  return request('/put/v1/puser', {
    method: 'put',
    data,
  })
}

export async function setPuser(id) {
  return request(`/put/v1/setPuser/${id}`, {
    method: 'put',
  })
}

export async function setManyPuser(ids) {
  return request(`/put/v1/setPuserBatch/${ids}`, {
    method: 'put',
  });
}
