import {
	getEntryListData,
	handleDelOneEntryData,
	handleAddOneEntryData,
	getEntryMenuResourceData,
	getPlanTaskListData,
	getDoneTaskListData,
	getInHandTaskListData,
	getTaskByMyselfData,
	getFlowTreeData,
	getHeaderInfoData,
	getPlanTaskCountData,
	getDoneTaskCountData,
	getInHandTaskCountData,
	getTaskByMyselfCountData,

} from '@/services/home';

const namespace = 'home'

export default {
namespace,
state: {
	resourceSelectOption: [],
	entryList: [],
	pagination: {
		total: 20,
		page: 1,
		limit: 10,
	},
	menuData: [],
	headerInfo: {},
},
effects: {
	*getFlowTree({ payload }, { call, put }) {
		const res = yield call(getFlowTreeData, payload)
		if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
			yield put({ type: 'save', payload: { menuData: res.data[0].children } })
		}
	},

	*getTaskList({ payload }, { call, put }) {
		const { taskType, page, limit, categoryId } = payload
		const taskRequestType = {
			plan: getPlanTaskListData,
			done: getDoneTaskListData,
			inHand: getInHandTaskListData,
			mySelf: getTaskByMyselfData,
		}
		const res = yield call(taskRequestType[taskType], { page, limit, categoryId })
		if (res && res.data) {
			yield put({ type: 'save',
payload: {
				taskList: res.data.data,
				pagination: {
					total: res.data.total,
					page: res.data.pageNum,
					limit: res.data.pageSize,
				},
			} })
			// yield put({type: 'save',payload: {[`${taskType}TaskList`]:res.data.data}})
		}
	},
	*getHeaderInfo(obj, { call, put }) {
		const res = yield call(getHeaderInfoData);
		if (res && res.data) {
			yield put({
				type: 'save',
				payload: { headerInfo: res.data },
			});
		}
	},

	*getTaskCount({ payload, callBack }, { call }) {
		const { taskType, categoryId } = payload
		const taskRequestType = {
			plan: getPlanTaskCountData,
			done: getDoneTaskCountData,
			inHand: getInHandTaskCountData,
			mySelf: getTaskByMyselfCountData,
		}
		const res = yield call(taskRequestType[taskType], { categoryId })
		if (callBack) callBack(res)
	},

	*getEntryMenuResource({ payload }, { call, put }) {
		const res = yield call(getEntryMenuResourceData, payload)
		const replaceKey = data => data.reduce((r, c) => {
				const { list, id, resourceName } = c
				c.children = list
				c.title = resourceName
				c.key = id
				c.value = id
				if (c.list && Array.isArray(c.list) && c.list.length > 0) {
					replaceKey(c.list)
				}
			return [...r, c]
}, [])

		if (res && Array.isArray(res.data) && res.data.length > 0) {
			yield put({ type: 'save', payload: { entryMenuResource: replaceKey(res.data[0].list) } })
		}
	},

	*getEntryList({ payload }, { call, put }) {
		const res = yield call(getEntryListData, payload)
		if (res && res.data) {
			yield put({ type: 'save', payload: { entryList: res.data.data } })
		}
	},

	*handleDelOneEntry({ payload, callBack }, { call }) {
		const res = yield call(handleDelOneEntryData, payload)
		if (callBack) callBack(res)
	},

	*handleAddOneEntry({ payload, callBack }, { call }) {
		const res = yield call(handleAddOneEntryData, payload)
		if (callBack) callBack(res)
	},

},
reducers: {
    save(state, action) {
        return {
            ...state,
            ...action.payload,
        }
    },
  },
}
