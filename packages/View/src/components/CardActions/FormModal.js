import React from 'react';
import { Modal } from 'antd';
import { Form } from 'kotomi-ui'

/**
 * 表单弹出窗
 * @param components 表单和组件的映射信息
 * @param scripts 表单的布局信息
 * @param rules 表单的验证信息
 */
export default class FormModal extends React.Component {

    state = {
      visible: false,
      title: ''
    }
  
    show = ({ title }) => {
      this.setState({
        visible: true,
        title
      })
    }
  
    handleCancel = () => {
      this.setState({
        visible: false
      })
    }
  
    handleOk = () => {
      const { onOk } = this.props;
      const self = this;
      if (onOk) {
        self.form.validateFields((error, value) => {
          if (!error) {
            if (!(onOk(value) === false)) {
              self.setState({
                visible: false
              })
            }
          }
        })
      }
    }
  
    render() {
      const { visible, title } = this.state
      const { initialValues, components, script, rules } = this.props
      const self = this
      return (
        <Modal
          title={title}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form
            refExt={form => { self.form = form }}
            components={components}
            script={script}
            rules={rules}
            initialValues={initialValues}
          />
        </Modal>
      )
    }
  
  }