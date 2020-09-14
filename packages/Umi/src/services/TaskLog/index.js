import request from '@/utils/request';

/**
 * 获取平台项目详情信息数据
 */
export async function getTaskLogData(query) {
  return request('/schedule/get/v1/quartzScheduleJobLogs', {
    params: query
  })
}