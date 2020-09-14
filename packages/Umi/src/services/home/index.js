import request from '@/utils/request';

export async function getEntryListData(query) {
  return request('/v1/pcommon-user-functions', {})
}

export async function handleDelOneEntryData(id) {
	return request(`/v1/pcommon-user-function/${id}`, {
		method: 'delete'
	})
}

export async function getHeaderInfoData() {
  return request('/equip/v1/es-equip-base-query-feign/queryEquipHomePage', {})
}

export async function handleAddOneEntryData(data) {
  return request('/v1/pcommon-user-function', {
    method: 'POST',
    data
  })
}

export async function getEntryMenuResourceData(data) {
  return request('/get/v1/nav', {})
}


export async function getPlanTaskListData(query) {
  return request('/process/v2/flowTask/planTaskList', {
    params: query
  })
}

export async function getInHandTaskListData(query) {
  return request('/process/v2/flowTask/inHandTaskList', {
    params: query
  })
}

export async function getDoneTaskListData(query) {
  return request('/process/v2/flowTask/doneTaskList', {
    params: query
  })
}
export async function getTaskByMyselfData(query) {
  return request('/process/v2/flowTask/findTaskByMyself',{
    params: query
  })
}

export async function getFlowTreeData(query) {
  return request('/process/flow-category/getTrees', {
    params: query
  })
}

export async function getPlanTaskCountData(query) {
  return request('/process/v2/flowTask/planTaskListNum', {
    params: query
  })
}
export async function getDoneTaskCountData(query) {
  return request('/process/v2/flowTask/doneTaskListNum', {
    params: query
  })
}
export async function getInHandTaskCountData(query) {
  return request('/process/v2/flowTask/inHandTaskListNum', {
    params: query
  })
}
export async function getTaskByMyselfCountData(query) {
  return request('/process/v2/flowTask/findTaskByMyselfNum', {
    params: query
  })
}






