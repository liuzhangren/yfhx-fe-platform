import React, { Component } from 'react';
import { Popconfirm, Col, Row } from 'antd';
import LinkComponent from '../LinkComponent/LinkComponent';
import styles from './index.less';

export class LinkAction extends LinkComponent {

  renderJSX(props){
    return  <Action {...props} />
  }

}

export class Action extends Component {

  state = {
    visible: false
  }


  /**
   * 
   * @param {*} isClick 
   * @param {*} disabled
   * @returns true 表示禁用 ，false表示启用
   */
  getIsDisabled(isClick,disabled){
    
    // true 表示可以点击，false表示无法点击
    if(isClick){
      // false 启用，true表示禁用
      if(disabled == false){
        return false
      }
      return true
    }
      // 无法点击
      return true
    
  }

  render() {
    const { action, index } = this.props;
    const { isClick, popconfirm, onClick, width } = action;
    const colStyle = { width, cursor: 'pointer', textAlign: 'center', height: '20px' , ...this.props.style }
    
    const disabled = this.props.disabled || false
    const isDisabled = this.getIsDisabled(isClick,disabled)

    if (isDisabled) {
      colStyle.color = 'lightgrey'
      delete colStyle.cursor
    }

    if (popconfirm ) {
      return (
        <Popconfirm
          disabled={this.props.disabled}
          key={index + 1}
          visible={isDisabled ? false  : this.state.visible}
          onVisibleChange={_visible => {
            this.setState({
              visible: _visible,
            });
          }}
          {...popconfirm}
          onConfirm={isDisabled ? undefined : onClick || popconfirm.onConfirm}
        >
          <Col
            span={this.props.span}
            key={index}
            style={colStyle}
          >
            <span>{action.node}</span>
            <span>{action.btnName}</span>
          </Col>
        </Popconfirm>
      );
    }
    return (
      <Col
        span={this.props.span}
        key={index}
        style={colStyle}
        onClick={isDisabled ? undefined : onClick}
      >
        <span>{action.node}</span>
        <span>{action.btnName}</span>
      </Col>
    );
  }
}


class CardActions extends Component {
  static defaultProps = {
    rate: 0.1,
  };

  state = {};

  readerMap() {
    const { actions } = this.props;
    const { visible } = this.state;
    return actions.map((action, index) => {
      return (
        <LinkAction
          id={action.id}
          index={index}
          span={24 / actions.length}
          action={action}
        />
      )
    });
  }

  render() {
    const { baseHeight, rate } = this.props;
    const height = baseHeight * rate;
    return (
      <Row
        className={styles.Container}
      >
        {this.readerMap()}
      </Row>
    );
  }
}




export default CardActions
