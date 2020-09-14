
import request from '@/utils/request';

export async function getDictTreeData(query) {
  return request('/v1/dict-tree')
}

export async function updateCache(query) {
  return request('/v1/dict-redis',{
    method: 'POST',
  })
}



// export async function getPdictsData(params) { 
//   return request('/get/v1/pdicts', {
//     params
//   })
// }


