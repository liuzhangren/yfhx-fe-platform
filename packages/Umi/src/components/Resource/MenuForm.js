import React, { Component } from 'react';
import { SForm } from 'view';

export default class MenuForm extends Component {
  render() {
    const { onFormLoad } = this.props;

    const formItems = [
      {
        key: 'resourceName',
        label: '菜单名称',
        componentType: 'input',
        options: {
          rules: [{ required: true, message: '菜单名称不能为空' },
          { min: 1, max: 30, message: '最大长度30个字符' }],
        },
      },
      {
        key: 'icon',
        label: '菜单图标',
        componentType: 'iconSelect',
        // options: {
        //   rules: [{ required: true }],
        // },
      },

      {
        key: 'url',
        label: '菜单路径',
        componentType: 'input',
        options: {
          rules: [{ required: true, message: '菜单路径不能为空' },
          { pattern: /^[0-9a-zA-Z/]*$/g, message: '菜单路径必须为字母或数字或/' },
          { max: 30, message: '最大长度30个字符' },
          ],
        },
      },
      {
        key: 'resourceType',
        label: '资源类型',
        componentType: 'optionSelect',
        options: {
          rules: [{ required: true, message: '资源类型不能为空' }],
        },
        props: {
          options: [{
            value: 0,
            label: '目录',
          }, {
            value: 1,
            label: '菜单',
          }, {
            value: 2,
            label: '按钮',
          },

          ],
        },
      },
      {
        key: 'sortNo',
        label: '排序',
        componentType: 'inputNumber',
        props: {
          max: 99999,
        },
        options: {
          rules: [{ required: true, message: '序号不能为空' }],
        },
      },
    ]

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
