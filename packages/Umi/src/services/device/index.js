// /v1/bus-dicts
import request from '@/utils/request';

export async function getEquipRedis(query) {
  return request(`/equip/v1/bus-redis?${query}`, {
    method: 'get'
  })
}
export async function getPlatformRedis(query) {
  return request(`/v1/dict-redis?${query}`, {
    method: 'get'
  })
}


export async function getDeviceTreeData(query) {
  return request('/equip/get/v1/bus-user-tree', {
    params: query
  })
}

export async function getDeviceData(query) {
  return request('/get/v1/pdicts', {
    params: query
  })
}

export async function getDeviceDataOther(query) {
  return request('/equip/v1/bus-dicts', {
    params: query
  })
}

export async function getDeviceDataOther2(query) {
  return request('/get/v1/pdicts', {
    params: query
  })
}

export async function getData(query) {
  return request('/get/v1/pdicts', {
    params: query
  })
}


export async function addDeviceData({ busDict }) {
  return request('/equip/v1/bus-dict', {
    method: 'POST',
    data: busDict
  })
}

export async function delManyDeviceData(params) {
  const ids = params
  // /v1/bus-dicts
  return request(`/equip/v1/bus-dicts`, {
    method: 'delete',
    params: {
      ids: params
    }
  })
}

export async function delOneDeviceData(id) {
  return request(`/equip/v1/bus-dict/${id}`, {
    method: 'delete'
  })
}

export async function updateDeviceData(data) {
  return request(`/equip/v1/bus-dict`, {
    method: 'put',
    data
  })
}

export async function getBusRedis(query) {
  return request('/equip/v1/bus-redis', {
    params: query
  })
}


export async function getDictRedis(query) {
  return request('/v1/dict-redis', {
    params: query
  })
}


//更新缓存
export async function getNewRedis(query) {
  return request('/equip/v1/bus-redis', {
    method: 'post',
    params: query
  })
}