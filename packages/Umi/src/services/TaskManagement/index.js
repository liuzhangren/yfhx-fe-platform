import request from '@/utils/request';
import { restfulApi } from '../restful';

/**
 * 获取平台项目详情信息数据
 */
export async function getProjectData(query) {
  return request('/get/v1/pprojects', {
    params: query
  })
}


export async function getTaskLogData(query) {

  return request('/schedule/get/v1/quartzScheduleJobs', {
    params: query
  })
}
/**
 * 更新任务日志信息
 */

export async function updateTaskLog(param) {
  return restfulApi('/schedule/put/v1/quartzScheduleJobLog', 'PUT', param);
}


/**
 * 新增任务管理
 * @param {} params
 */
export async function addTaskManager(params) {
  return restfulApi('/schedule/post/v1/quartzScheduleJob', 'post', params)
}

/**
 * 编辑任务管理
 */

export async function updateTaskManager(param) {
  return restfulApi('/schedule/put/v1/quartzScheduleJob', 'PUT', param);
}
/**
 *  删除任务日志
 */
export async function delTaskManager(id) {
  return request(`/schedule/delete/v1/quartzScheduleJob/${id}`, { method: 'DELETE' });
}

/**
 *  批量删除任务管理数据
 */
// export async function delTaskManagerBatch(ids) {
//   return restfulApi(`/schedule/delete/v1/quartzScheduleJobs/${ids}`, 'DELETE', {});
// }

export async function delTaskManagerBatch(params) {
  const ids = params
  return request(`/schedule/delete/v1/quartzScheduleJobs/${ids}`, {
    method: 'DELETE'
  })
}
/**
 *  生效任务管理数据
 */
export async function startTaskManager(id) {
  return request(`/schedule/v1/schedule/start/${id}`, {
    method: 'PUT',
  });
}

/**
 *  关闭任务管理数据
 */
export async function stopTaskManager(id) {
  return request(`/schedule/v1/schedule/close/${id}`, {
    method: 'PUT',
  });
}