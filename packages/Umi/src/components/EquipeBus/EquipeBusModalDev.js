import React from 'react';
import {
  Form,
} from 'antd';
import {
  SForm,
} from 'view';

@Form.create()

class EquipeBusModal extends React.Component {
  isInit = false;

  state = {
    type: 'ADD',
  }

  // componentDidMount () {
  //   const { type } = this.props;
  //   this.setState({ type })
  //   console.log(type)
  // }

  componentWillReceiveProps (nextProps) {
    const { type } = nextProps;
    this.setState({ type })
    console.log(type)
  }

  getFormItems () {
    const { type } = this.state
    const formItems = [
      {
        key: 'pcode',
        label: '所属类型',
        placeholder: '所属类型',
        componentType: 'input',
        props: {
          disabled: true,
        },
        options: {
          rules: [{ required: true }, { min: 1, max: 50, message: '最大长度为50个字符' }],
        },
      },
      {
        key: 'dictCode',
        label: '字典编号',
        placeholder: '字典编号',
        componentType: 'input',
        options: {
          rules: [{ required: true }, { min: 1, max: 50, message: '最大长度为50个字符' }],
        },
      },
      {
        key: 'dictName',
        label: '字典名称',
        componentType: 'input',
        placeholder: '字典名称',
        options: {
          rules: [{ required: true }, { min: 1, max: 100, message: '最大长度为100个字符' }],
        },
      },
      // {
      //   key: 'sort',
      //   label: '排序编号',
      //   componentType: 'inputNumber',
      //   placeholder: '排序编号',
      //   options: {
      //     rules: [{ required: true }],
      //   },
      // },
      {
        key: 'remark',
        label: '备注',
        componentType: 'textArea',
        placeholder: '备注信息',
        props: {
          autoSize: { minRows: 3, maxRows: 5 },
        },
        options: {
          rules: [{ required: false }],
        },
      },
    ]
    if (type === 'UPDATE') {
      formItems.splice(
        4,
        0,
        {
          key: 'isEffective',
          label: '是否有效',
          componentType: 'optionRadio',
          placeholder: '备注信息',
          props: {
            options: [
              { label: '是', value: '1' },
              { label: '否', value: '0' },
            ],
          },
          options: {
            rules: [{ required: true }],
          },
        },
      );
    }
    return formItems
  }

  render () {
    const formItems = this.getFormItems();
    const { onFormLoad } = this.props;
    return (
      <SForm
        ref={form => { onFormLoad(form); }}
        formItems={formItems}
      />
    )
  }
}

export default EquipeBusModal
