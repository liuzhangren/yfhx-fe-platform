import React from 'react';
import {
  Form,
  Spin,
} from 'antd';
import {
  Modal,
} from 'view';
import RoleForm from './RoleForm';

@Form.create()

class MenuColumnModal extends React.Component {
  static defaultProps = {
    loading: false,
  };

  state = {
    type: 'ADD',
    visible: false,
    data: {},
  };

  componentDidMount () {
    this.props.onInit(this);
  }

  handleCancel () {
    this.setState({
      visible: false,
    });
  }

  handleOk () {
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

  hide () {
    this.setState({
      visible: false,
    });
  }

  show (type, data) {
    //
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
    const title = this.state.type == 'ADD'
      ? '新增角色'
      : '编辑角色'
    return (
      <div>
        <Modal
          title={title}
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          forceRender
          okText="保存"
          cancelText="取消"
          width="80vw"
        >
          <Spin spinning={this.props.loading}>
            <RoleForm onFormLoad={form => (this.form = form)} type={this.state.type} />
          </Spin>
        </Modal>
      </div>
    );
  }
}

export default MenuColumnModal;
