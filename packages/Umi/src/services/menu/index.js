import request from '@/utils/request';


export async function getMenu() {
  return request(`/get/v1/nav`, { method: 'get' });
}
export async function getAllMenu() {
  return request(`/v1/routers`, { method: 'get' });
}
export async function getAllMenuChild(id) {
  return request(`/v1/resource-child`, {
    method: 'GET',
    params: {
      id: id.id
    }
  })
}