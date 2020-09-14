
import { message } from 'antd';

import {
    getProjectData,
    getTaskLogData,
    addTaskManager,
    updateTaskManager,
    delTaskManager,
    delTaskManagerBatch,
    startTaskManager,
    stopTaskManager
} from '@/services/TaskManagement';

const namespace = 'TaskManagement'

export default {
    namespace,
    state: {
        //右侧任务列表
        taskData: [],
        pagination: {
            total: 20,
            page: 1,
            limit: 10
        }
    },
    effects: {
        //请求任务列表
        *getTaskLogData({
            payload
        }, { call, put }) {
            const res = yield call(getTaskLogData, payload)
            const newRes = res
                .data
                .data
                .reduce((r, c) => {
                    return [
                        ...r, {
                            key: c.id,
                            ...c
                        }
                    ]
                }, [])
            yield put({
                type: 'save',
                payload: {
                    taskData: newRes,
                    pagination: {
                        total: res.data.total,
                        page: res.data.pageNum,
                        limit: res.data.pageSize
                    }
                }
            })
        },
        //生效
        *startTaskManager({
            payload
        }, { call, put }) {
            const { id } = payload
            const res = yield call(startTaskManager, id)
            return res
        },
        //关闭
        *stopTaskManager({
            payload
        }, { call, put }) {
            const { id } = payload
            const res = yield call(stopTaskManager, id)
            return res
        },
        //删除一个
        *delTaskManager({
            payload
        }, { call, put }) {
            const { id } = payload
            const res = yield call(delTaskManager, id);
            return res
        },
        //批量删除
        *delTaskManagerBatch({
            payload
        }, { call, put }) {
            const { ids } = payload
            const res = yield call(delTaskManagerBatch, ids);
            return res
        },
        //新增
        *addTaskManager({ payload }, { call, put }) {
            const res = yield call(addTaskManager, payload)
            return res

        },
        //编辑
        *updateTaskManager({ payload }, { call, put }) {
            const res = yield call(updateTaskManager, payload)
            return res

        }
    },
    reducers: {
        save(state, action) {
            return {
                ...state,
                ...action.payload
            }
        }
    }
}