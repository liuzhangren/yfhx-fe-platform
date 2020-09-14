import React from 'react';
import Modal from '../../components/Modal/Smodal';

import Confirm from '../../components/Modal/confirm';
import { Button } from 'antd';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }
  Click () {
    //this.setState({ visible: true })
    Confirm({
      onOk: () => {
        console.log("确定")
      },
      onCancel: () => {
        console.log("取消")
      }
    }, "many")
  }

  onCancal () {
    this.setState({ visible: false })
  }

  onOk () {
    this.setState({ visible: false })
  }

  render () {



    return (
      <div>
        <Button
          size="large"
          type="primary"
          onClick={() => { this.Click() }}
        >
          Modal
                </Button>
        <Modal visible={this.state.visible} title={'Modal'}
          onOk={this.onOk.bind(this)}
          onCancel={this.onCancal.bind(this)}
        //isFull
        //footer={""}
        >
          <iframe height="500" width="100%" src="https://3x.ant.design"></iframe>
        </Modal>
      </div>
    )
  }
}
