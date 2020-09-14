import React from 'react';
import {
  Form,
  Spin,
} from 'antd';
import {
  SForm,
  Modal,
} from 'view';


@Form.create()

class EquipeBusModal extends React.Component {
  static defaultProps = {
    formItems: [
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
      {
        key: 'sort',
        label: '排序编号',
        componentType: 'inputNumber',
        placeholder: '排序编号',
        options: {
          rules: [{ required: true }],
        },
      },
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
    ],
  };

  state = {
    type: 'ADD',
    visible: false,
  }

  componentDidMount () {
    this.props.onInit(this);
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  handleOk = () => {
    const self = this;

    this.form.validateFields((err, values) => {
      if (!err) {
        const confirm = self.props.confirm || function () { };
        try {
          if (self.state.type == 'ADD') {
            confirm(
              {
                ...values,
              },
              self.state.type,
            );
          } else {
            confirm(
              {
                ...self.state.data,
                ...values,
              },
              self.state.type,
            );
          }
        } catch (e) { }
      }
    });
  }

  hide = () => {
    this.setState({
      visible: false,
    });
  }

  show = (type, data) => {
    this.setState(
      {
        visible: true,
        type,
        data,
      },
      () => {
        if (type == 'UPDATE') {
          if (this.form) {
            this.form.setFieldsValue({
              ...data,
            });
          }
        } else if (type == 'ADD') {
          if (this.form) {
            this.form.resetFields();
            this.form.setFieldsValue(data);
          }
        } else if (this.form && !data) {
          this.form.resetFields();
        } else {
          this.form.setFieldsValue({
            ...data,
          });
        }
      },
    );
  }

  render () {
    const { onFormLoad, formItems } = this.props;
    const title = this.state.type == 'ADD' ?
      '新增设备业务字典' :
      '编辑设备业务字典'
    return (
      <Modal
        title={title}
        visible={this.state.visible}
        okText="保存"
        cancelText="取消"
        onOk={this.handleOk.bind(this)}
        onCancel={this.handleCancel.bind(this)}
        forceRender
        width={700}
      >
        <Spin spinning={this.props.loading}>
          <SForm
            ref={form => this.form = form}
            formItems={formItems}
          />
          {/* <RoleForm onFormLoad={form => (this.form = form)} type={this.state.type} /> */}
        </Spin>
      </Modal>
    )
  }
}

export default EquipeBusModal
