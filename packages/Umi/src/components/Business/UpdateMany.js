import React from 'react';
import {
  Modal,
  XForm,
} from 'view';

export default class UpdateMany extends React.Component {
  state = {
    visible: false,
  }
  componentDidMount () {
    const { onInit } = this.props
    onInit(this)
  }

  show = () => {
    this.setState({
      visible: true,
    })
  }

  hide = () => {
    this.setState({
      visible: false,
    })
  }

  handleOk = () => {
    const { confirm } = this.props;
    const data = this.form.getFieldsValue()
    confirm(data)
  }

  setFieldsValue = data => {
    this.form.setFieldsValue(data)
  }

  render () {
    const { formItems } = this.props;
    return (
      <Modal
        title="批量编辑"
        visible={this.state.visible}
        bodyStyle={{ padding: 0 }}
        onOk={this.handleOk}
        destroyOnClose
        width="1200px"
        onCancel={this.hide}
        okText="确定"
        cancelText="取消"
      >
        <XForm
          ref={ref => { this.form = ref }}
          formItems={formItems}
        />
      </Modal>
    )
  }
}
