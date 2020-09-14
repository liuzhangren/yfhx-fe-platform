import request from '@/utils/request';

/**
 * 系统树
 */
export async function getSystemTree () {
  return request('/equip/get/v1/es-system-tree')
}

/**
 * 厂房树
 */
export async function getFacilityTree () {
  return request('/equip/get/v1/facility-tree')
}

/**
 * 生产线
 */
export async function getProLine () {
  return request('/equip/v1/es-production-lines')
}

/**
 * 设备类别
 */
export async function getCategoryTree () {
  return request('/equip/get/v1/es-equipment-category-tree')
}
