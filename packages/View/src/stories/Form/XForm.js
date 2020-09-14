import XForm from '../../components/Form/XForm'
import React from 'react'
import { Button } from 'antd'


export default class Page extends React.Component {
  state = {

  }

  render () {
    return (
      <>
        <XForm
          ref={ref => { this.form = ref }}
          formItems={[
            {
              label: '设备类型',
              key: 'equipType',
              componentType: 'input',
              props: {
                // disabled: true
              },
              options: {
                rules: [{ required: true }],
              },
            },
            {
              label: '申请日期',
              key: 'applyDate',
              componentType: 'datePicker',
              // props: {
              //   disabled: true
              // },
              // options: {
              //   rules: [{ required: true }],
              // },
            },
            {
              label: '设备类别',
              key: 'equipCategory',
              componentType: 'optionSelect',
              props: {
                disabled: true
              },
              options: {
                // rules: [{ required: true }],
              },
            },
            {
              label: '设备类别1',
              key: 'equipCategory1',
              componentType: 'optionSelect',
              props: {
                disabled: true
              },
              options: {
                // rules: [{ required: true }],
              },
            },
            {
              label: '设备类别2',
              key: 'equipCategory2',
              componentType: 'optionSelect',
              props: {
                disabled: true
              },
              options: {
                // rules: [{ required: true }],
              },
            },
          ]}
        />
        <Button onClick={() => {
          console.log(this.form.getFieldsValue())
        }}>确定</Button>
      </>
    )
  }

}