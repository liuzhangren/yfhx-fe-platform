import React, { Component } from 'react';
import {SForm} from 'view';

export default class RoleForm extends Component {
  static defaultProps = {
    formItems: [
      {
        key: 'roleName',
        label: '角色名称',
        componentType: 'input',
        options: {
          rules: [{ required: true },{ min: 1, max: 30, message: "最大长度50个字符" }],
        },
      },
      {
        key: 'roleDesc',
        label: '角色描述',
        componentType: 'textArea',
        options: {
          rules: [{ required: true }, { max: 200 , message: "最大长度200个字符"}],
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
