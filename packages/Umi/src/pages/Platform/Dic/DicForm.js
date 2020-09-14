import React, { Component } from 'react';
import { Form, Button, Row, Col,Spin } from 'antd';
import { SForm, Scard } from 'view';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
@Form.create()
class PuserForm extends Component {

  constructor(props) {
    super(props);
  }
  state = {
    value: [],
    data: [],
    loading: false,
  };

  componentDidMount() {
    
  }

  render() {
    const { onFormLoad, type } = this.props;
    const formItems = [
      {
        key: 'dictCode',
        label: '字典编码',
        componentType: 'input',
        props: {
          disabled: type === "UPDATE" ? true : false
        },
        options: {
          rules: [
            { required: true },
            { min: 1, max: 50, message: '最大长度50个字符!' }
          ],
        },
      },     
      {
        key: 'dictName',
        label: '字典名称',
        componentType: 'input',
        options: {
          rules: [
            { required: true },
            { min: 1, max: 100, message: '最大长度100个字符!' }
          ],
        },
      },
      {
        key: 'pcode',
        label: '上级字典',
        componentType: 'input',
        props: {
          disabled:true
        },
      },
      {
        key: 'sort',
        label: '排序号',
        componentType: 'inputNumber',
        options: {
          rules: [
            { required: true },
          ],
        },

      },
      {
        key: 'remark',
        label: '备注',
        componentType: 'textArea',
        options: {
          rules: [],
        },
        props: {
          autoSize: { minRows: 3, maxRows: 5 },
        },
      },
    ]

    return (
      <SForm
        ref={form => {
          onFormLoad(form);
        }}
        formItems={formItems}
        rowNum={2}
        layoutType={4}
      />
    );
  }
}

export default connect(({ puser, org }) => ({
  puser, org
}))(props => <PuserForm {...props} />);