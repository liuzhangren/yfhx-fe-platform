import request from '@/utils/request';
// import { restfulApi } from '@/services/restful';

/**
 * 获取消息列表
 */
export async function fetchNoticesData() {
  return request('/v1/pmessage/newNum')
}

/**
 * 改变消息读取状态
 */
export async function changeNoticeReadStated(id) {
  return request(`/v1/pmessage/updateReadState/${id}`)
}

/**
 * 清除消息列表
 */
export async function clearNoticesData() {
  return request('/equip/v1/es-account-creation-apps')
}

/**
 * 发送邮件
 */
export async function sendMessageData({ submitData }) {
  return request('/v1/pmessage/send', {
    method: 'post',
    data: {
      ...submitData,
    },
  })
}

/**
 * 保存草稿
 */
export async function saveMessageData({ submitData }) {
  return request('/v1/pmessage', {
    method: 'post',
    data: {
      ...submitData,
    },
  })
}

/**
 * 更新草稿
 */
export async function updateMessageData({ submitData }) {
  return request('/v1/pmessage', {
    method: 'put',
    data: {
      ...submitData,
    },
  })
}

/**
 * 获取草稿
 */
export async function fetchBraftNewsData() {
  return request('/v1/pmessage/inBox')
}

/**
 * 批量删除已接受
 */
export async function delsAcceptMessageData({ strDel }) {
  return request(`/v1/messageIn/del?${strDel}`, {
    method: 'delete',
  })
}
/**
 * 删除已发送
 */
export async function delSentMessageData({ record }) {
  return request(`/v1/pmessages?ids=${record.id}`, {
    method: 'delete',
  })
}
/**
 * 删除已发送
 */
export async function delBraftMessageData({ record }) {
  return request(`/v1/messageOut/del?ids=${record.id}`, {
    method: 'delete',
  })
}
/**
 * 删除已接受
 */
export async function delAcceptMessageData({ record }) {
  return request(`/v1/messageIn/del?ids=${record.delId}`, {
    method: 'delete',
  })
}
/**
 * 获取字典
 */
export async function getReadStateData() {
  const res = await request('/get/v1/pdicts?pcode=READ_STATE');
  const res2 = await request('/get/v1/pdicts?pcode=MESSAGE_TYPE')
  return Promise.resolve([res, res2])
}
