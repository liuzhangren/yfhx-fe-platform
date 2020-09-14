import React from 'react';
import {
  Modal,
} from 'view';
import { Button } from 'antd';

export default class ViewFlowModal extends React.Component {
  state = {
    visible: false,
  }

  handleOk = () => {
    this.setState({
      visible: false,
    })
  }

  hide = () => {
    this.setState({
      visible: false,
    })
  }

  show = flowId => {
    this.setState({
      flowId,
      visible: true,
    })
  }

  renderFooter = () => (
      <>
        <Button onClick={() => this.hide()}>取消</Button>
        <Button onClick={() => { console.log('下载') }} type="primary">下载</Button>
      </>
    )

  render() {
    const { flowId } = this.state;
    return (
      <Modal
        title="查看流程"
        visible={this.state.visible}
        footer={this.renderFooter()}
        onCancel={this.hide}
        isFull
        centered
      >
        <img
          alt="流程设计"
          src={`/process/v1/viewFlowInstPic/${flowId}?${Date.now()}`}
          style={{
            margin: '0 auto',
            display: 'block',
          }}
        />
      </Modal>
    )
  }
}
