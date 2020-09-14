import request from '@/utils/request';
/**
 * 获取按钮权限列表
 */
export async function getData(query) {
    return request('/v1/resource-buttons')
}