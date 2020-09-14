// http://129.211.80.62:19001/platform/get/v1/resource-Ptree
// /get/v1/pusers  用户 /get/v1/pprojects 项目   /get/v1/proles 角色
import request from '@/utils/request';

export async function addRoleResReal(data) {
  
  return request('/post/v1/proleResourceReal', {
    method: 'post',
    data
  });
}

export async function getRoleTreeData(params) {
  return request('/get/v1/resource-Ptree', {
    method: 'get',
    params
  })
}

/**
 * 查询角色资源关联数据
 */
export async function getRoleResReal(data) {
  return request('/post/v1/getRoleResReal', {
    method: 'post',
    data
  });
}

export async function getRoleData(query) {
  return request('/get/v1/proles', {
    params: query
  })
}

export async function getPuserData(query) {
  return request('/get/v1/pusers', {
    params: query
  })
}



export async function addRoleData({prole}) {
  return request('/post/v1/prole', {
    method: 'post',
    data: prole
  })
}
// /put/v1/prole
export async function updateRoleData(data) {
  return request(`/put/v1/prole`, {
    method: 'put',
    data
  })
}

export async function delManyRoleData(params) {
  const ids = params
  return request(`/delete/v1/proles/${ids}`, {
    method: 'delete'
  })
}

export async function delOneRoleData(id) {
  return request(`/delete/v1/prole/${id}`, {
    method: 'delete'
  })
}

export async function addRoleUserReal(data) {
  return request('/post/v1/proleUserReal', {
    method: 'post',
    data
  })
}



export async function delManyUserData(data) {
  return request(`/delete/v1/proleUserReals`, {
    method: 'post',
    data
  })
}
