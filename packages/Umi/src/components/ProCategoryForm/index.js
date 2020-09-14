import React, { Component } from 'react';
import {SForm} from 'view';

export default class ProCategoryForm extends Component {
  static defaultProps = {
    formItems: [
      {
        key: 'name',
        label: '分类名称',
        componentType: 'input',
        options: {
          rules: [{ required: true },{ min: 1, max: 30, message: "最大长度30个字符" }],
        },
      },
      {
        key: 'sortNo',
        label: '序号',
        componentType: 'inputNumber',
        props: {
          max: 99999
        },
        options: {
          rules: [{ required: true,message: "序号不能为空" }],
        },
      }, 
      {
        key: 'remark',
        label: '备注',
        componentType: 'textArea',
        options: {
          rules: [{ max: 200 , message: "最大长度200个字符"}],
        },
        props: {
          autoSize: { minRows: 3, maxRows: 5 },

        },
      },
    ],
  };

  render() {
    const { onFormLoad, formItems } = this.props;
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
