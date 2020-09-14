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
              label: '邮件日期',
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
          link="/v1/emailLogs"
          columns={[

            {
              dataIndex: 'subject',
              title: '邮件主题',
            },

            {
              dataIndex: 'mainTo',
              title: '接收人',
              width: 200,
            },

            {
              dataIndex: 'copyTo',
              title: '抄送人',
            },

            {
              dataIndex: 'content',
              title: '邮件内容',
            },

            {
              dataIndex: 'state',
              title: '状态',
            },


            {
              dataIndex: 'error',
              title: '错误信息',
            },

            {
              dataIndex: 'module',
              title: '功能模块',
            },

          ]}
        />
      </>
    )
  }
}

export default OperationLog;
