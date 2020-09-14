import React from 'react';
import { SForm } from 'view';


export default class OrgForm extends React.Component {
  render() {
    const formItems = [

      {
        key: 'sortNo',
        label: '排序',
        componentType: 'inputNumber',
        props: {
          max: 99999
        },
        options: {
          rules: [{ required: true, message: "序号不能为空" }],
        },
      }
    ]
    const { onFormLoad, type } = this.props;
    if (type === "ADD") {
      formItems.unshift({
        key: 'porgName',
        label: '上级组织名称',
        componentType: 'input',
        props: {
          disabled: true
        },
        options: {
          rules: [{ required: true }],
        },
      },
        {
          key: 'orgNo',
          label: '组织编号',
          componentType: 'input',
          options: {
            rules: [{ required: true, message: "组织编号能为空" },
            { pattern: /[a-zA-Z0-9]+$/, message: "组织编号必须为字母或数字" },
            { min: 1, max: 30, message: "最大长度30个字符" }
            ],
          },
        },
        {
          key: 'orgName',
          label: '组织名称',
          componentType: 'input',
          options: {
            rules: [{ required: true, message: "组织名称不能为空" },
            { min: 1, max: 30, message: "最大长度30个字符" }],
          },
        },
      )
    } else {
      formItems.unshift(
        {
          key: 'orgNo',
          label: '组织编号',
          componentType: 'input',
          props: { disabled: true },
          options: {
            rules: [{ required: true },
            { pattern: /[a-zA-Z0-9]+$/, message: "组织编号必须为字母或数字" },
            { min: 1, max: 30, message: "最大长度30个字符" }],

          },
        },
        {
          key: 'orgName',
          label: '组织名称',
          componentType: 'input',
          props: { disabled: true },
          options: {
            rules: [{ required: true,message: "组织名称不能为空"  },
              { min: 1, max: 30, message: "最大长度30个字符" }],
          },
        },
      )
    }
    // console.log('SForm Components!!', Object.keys(this.refs.form))
    return (
      <SForm
        ref='form'
        // callback={() => {this.props.callback(this.refs.form.getFiledsValue())}}
        ref={(form) => {
          return onFormLoad(form);
        }}
        // ref={form => {
        //   onFormLoad(form);
        // }}
        formItems={formItems}
      />
    );
  }
}

