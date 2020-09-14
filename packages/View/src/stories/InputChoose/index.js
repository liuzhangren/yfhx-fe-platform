import React from 'react';
import SForm from '../../components/Form/SForm';
import Item from 'antd/lib/list/Item';
import { Button } from 'antd';

export default class SFormPage extends React.Component {
  state = {

  }

  render() {
    const formItems = [
      {
        key: 'test',
        label: '测试',
        componentType: 'inputChoose',
        props: {
          multiple: true,
          afterDel: res => console.log(res),
          onClick: () => {
            // console.log(this.form)
            const data = [
              {
                account: 'liuzr',
                userName: '刘章仁'
              },
              {
                account: 'ch',
                userName: '陈欢'
              },
              {
                account: 'ch',
                userName: '陈欢'
              },
              {
                account: 'ch',
                userName: '陈欢'
              },
              {
                account: 'ch',
                userName: '陈欢'
              },
              {
                account: 'ch',
                userName: '陈欢'
              },
              {
                account: 'ch',
                userName: '陈欢'
              },
            ]
            const target = {
              label: data.map(item => item.userName),
              value: data.map(item => item.account)
            }
            // console.log(target)
            this.form.setFieldsValue({test: target})
          }
        },
        options: {
          rules: [{ required: false, }],
        },
      },
    ]
    return (
      <>
        <SForm
          ref={form => {
            this.form = form;
          }}
          formItems={formItems}
          rowNum={2}
          layoutType={4}
        />
        <Button onClick={() => {console.log(this.form.getFieldsValue())}}>确定</Button>
      </>
    )
  }
}