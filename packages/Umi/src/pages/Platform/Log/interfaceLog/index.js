import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  LinkQueryForm,
} from 'view';
import Table from '@/components/Alink/SingleTable';

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
      <>
        <LinkQueryForm
          formItems={[
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
              const [createDateBegin, createDateEnd] = transformDate(value.operatorDate)
              value.createDateBegin = createDateBegin
              value.createDateEnd = createDateEnd
              value.operatorDate = undefined
            } else {
              value.createDateBegin = undefined
              value.createDateEnd = undefined
              value.operatorDate = undefined
            }
            this.tb.refresh({ ...value }, '', true)
            this.tb.clearData()
            this.tbChild.clearAllData()
          }}
        />
        <Table
          ref={tb => { this.tb = tb }}
          onChange={this.onChange}
          link="/v1/pinterface-logs"
          columns={[
            {
              dataIndex: 'url',
              title: '接口url',
            },
            {
              dataIndex: 'method',
              title: '请求类型',
            },

            {
              dataIndex: 'requestParams',
              title: '请求参数信息',
            },

            {
              dataIndex: 'result',
              title: '返回数据信息',
            },

            {
              dataIndex: 'id',
              title: '操作用户id',
            },
            {
              dataIndex: 'createUserName',
              title: '操作用户名',
            },
            {
              dataIndex: 'createDate',
              title: '操作时间',
              width: 180,
            },

          ]}
        />
      </>
    )
  }
}

export default OperationLog;
