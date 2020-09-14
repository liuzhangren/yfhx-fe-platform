import React from 'react';
import style from './addNode.css';
import {
  Popover
} from 'antd';
export default class  AddNode extends React.Component {
  state = {
    visible: false,
  }
  handleVisibleChange(visible) {
    this.setState({ visible });
  }
  addType(type) {
    this.setState({
      visible: false
    })
    this.props.addNode(type)
  }
  render() {
    return (
      <div className={style['add-node-btn-box']}>
        <div className={style['add-node-btn']}>
            <Popover
              onVisibleChange={this.handleVisibleChange.bind(this)}
              visible={this.state.visible}
              trigger="click"
              content={
                // <div>hello</div>
                <div className={style['add-node-popover-body']}>
                    <a className={`${style['add-node-popover-item']} ${style['approver']}`} onClick={this.addType.bind(this, 1)}>
                        <div className={style['item-wrapper']}>
                            <span className={style['iconfont']}></span>
                        </div>
                        <p>审批人</p>
                    </a>
                    <a className={`${style['add-node-popover-item']} ${style['notifier']}`} onClick={this.addType.bind(this, 2)}>
                        <div className={style['item-wrapper']}>
                            <span className={style['iconfont']}></span>
                        </div>
                        <p>抄送人</p>
                    </a>
                    <a className={`${style['add-node-popover-item']} ${style['condition']}`} onClick={this.addType.bind(this, 3)}>
                        <div className={style['item-wrapper']}>
                            <span className={style.iconfont}></span>
                        </div>
                        <p>条件分支</p>
                    </a>
                </div>
              }
            >
              {
                this.props.content
              }
            </Popover>
        </div>
      </div>
    )
  }
}
