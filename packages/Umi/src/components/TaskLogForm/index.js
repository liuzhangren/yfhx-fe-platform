import React, { Component } from 'react';
import {SForm} from 'view';

export default class TaskLogForm extends Component {


  render() {
    const formItems = [
      {
        key: 'name',
        label: '任务描述',
        componentType: 'input',
        options: {
            rules: [{ required: true,message: "任务描述不能为空"  },
              { min: 1, max: 30, message: "最大长度30个字符" }],
          },
        props: { disabled: true}
      },
      {
        key: 'projectName',
        label: '任务所属项目',
        componentType: 'input',
        props: { disabled: true}
      },
      {
        key: 'bizState',
        label: '任务处理结果',
        componentType: 'input',
        props: { disabled: true}
      },
      {
        key: 'bizData',
        label: '任务处理信息',
        componentType: 'textArea',
        props: {
          autoSize: { minRows: 3, maxRows: 5 },
          disabled: true
        }
      },
    ]
    const { onFormLoad} = this.props;
    return (
      <SForm
        ref={form => {
          onFormLoad(form);
        }}
        formItems={formItems}
      />
    );
  }
}
