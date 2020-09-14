import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  LinkQueryForm,
} from 'view';
import Table from '@/components/Alink/SingleTable';
import KeepAlive, { AliveScope } from 'react-activation'

@connect(({ loading, global, customFlow }) => ({
  baseHeight: global.contentHeight,
  loading,
  customFlow,
}))

class OperationLog extends React.Component {
  state = {
  }

  componentDidMount() {
    this.forceUpdate()
    if (this.tb) {
      this.tb.refresh({
      })
      // console.log('---->>>>' ,this.forceUpdate)
    }
  }

  refresh = () => {
    this.tb.refresh({
    })
  }

  render() {
    return (
      <AliveScope>
        <>
          <LinkQueryForm
            formItems={[
              {
                key: 'operatorUsername',
                label: '操作人',
                componentType: 'input',
              },
              {
                key: 'operatorDate',
                label: '操作日期',
                componentType: 'rangerPicker',
              },
            ]}
            verifySuccess={value => {
              const transformDate = arr => arr.reduce((r, c) => [
                ...r,
                moment(c).format('YYYY-MM-DD'),
              ], [])
              if (value.operatorDate && value.operatorDate.length > 0) {
                const [operatorDateBegin, operatorDateEnd] = transformDate(value.operatorDate)
                value.operatorDateBegin = operatorDateBegin
                value.operatorDateEnd = operatorDateEnd
                value.operatorDate = undefined
              } else {
                value.operatorDateBegin = undefined
                value.operatorDateEnd = undefined
                value.operatorDate = undefined
              }
              this.tb.refresh({ ...value }, '', true)
              this.tb.clearData()
              this.tbChild.clearAllData()
            }}
          />

          {/* <KeepAlive> */}
            <Table
              ref={tb => { this.tb = tb }}
              onChange={this.onChange}
              link="/v1/log-edit"
              columns={[
                {
                  dataIndex: 'operatorType',
                  title: '操作类型',
                  render: text => {
                    let result
                    if (text === 0) {
                      result = <span>登出操作</span>
                    } else if (text === 1) {
                      result = <span>登录操作</span>
                    } else if (text === 2) {
                      result = <span>新增数据</span>
                    } else if (text === 3) {
                      result = <span>编辑数据</span>
                    } else if (text === 4) {
                      result = <span>删除数据</span>
                    }
                    return result
                  },
                },

                {
                  dataIndex: 'requestUrl',
                  title: '请求url地址',
                },

                {
                  dataIndex: 'requestUri',
                  title: '访问url前缀',
                  width: 200,
                },

                {
                  dataIndex: 'requestClazz',
                  title: '请求类名称',
                },

                {
                  dataIndex: 'requestMethod',
                  title: '请求方法名称',
                },

                {
                  dataIndex: 'requestType',
                  title: '请求类型',
                },


                {
                  dataIndex: 'requestParams',
                  title: '请求参数信息',
                },

                {
                  dataIndex: 'returnData',
                  title: '返回数据信息',
                },

                {
                  dataIndex: 'operatorUserId',
                  title: '操作用户id',
                },
                {
                  dataIndex: 'operatorUsername',
                  title: '操作用户名',
                },
                {
                  dataIndex: 'operatorDate',
                  title: '操作时间',
                  width: 180,
                },
                {
                  dataIndex: 'accessIp',
                  title: '访问ip',
                },
                {
                  dataIndex: 'state',
                  title: '状态',
                },

              ]}
            />
          {/* </KeepAlive> */}
        </>
      </AliveScope >
    )
  }
}

export default OperationLog;
