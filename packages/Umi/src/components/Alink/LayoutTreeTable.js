/*eslint-disable */
import React, { Component } from 'react';
import styles from './LayoutTreeTable.less';
import Left from '@/assets/arrow-left.jpg';
import Right from '@/assets/arrow-right.jpg';

export default class LayoutTreeTable extends Component {
  render() {
    const { className, style } = this.props;

    return <div className={`${styles.LayoutTreeTable} ${className}`} style={style}>
      {this.props.children}
    </div>
  }
}
export class LayoutTree extends LayoutTreeTable {
  state= {
    flag: false
  }

  getFlag = () => {
    const { right } = this.props;
    const { flag } = this.state;
    let result;
    if(right) {
      if(flag) {
        result = { direction: Left, space: { marginLeft: '2px' } }
      }else {
        result = { direction: Right, space: { marginLeft: '2px' } }
      }
    }else {
      if(flag) {
        result = { direction: Right, space: { marginRight: '2px' } }
      }else {
        result = { direction: Left, space: { marginRight: '2px' } }
      }
    }
    return result;
  }

  render() {
    const { className, style, right, isToggle=true } = this.props;
    const { flag } = this.state;
    return (
      <>
        {
          isToggle && right?
          <div
            className={styles.ArrowBox}
            onClick={() => {
              this.setState({
                flag: !flag
              })
            }}
            style={{
              marginLeft: 0,
              marginRight: 4,
            }}
          >
          <img
            src={this.getFlag().direction}
            style={{
              ...this.getFlag().space
            }}
          />
          {/* <Icon
            style={{
              fontSize: 30,
              marginLeft: 4,
            }}
            type={this.getFlag()}
          /> */}
          </div>:null
      
        }
        <div className={`${styles.LayoutTree} ${right ? styles.LayoutTreetight : ''} ${className}`} style={{...style, display: flag?'none':'block'}}>
          {this.props.children}
        </div>
        {
          isToggle && !right?
          <div
            className={styles.ArrowBox}
            onClick={() => {
              this.setState({
                flag: !flag
              })
            }}
          >
          <img
            src={this.getFlag().direction}
            style={{
              ...this.getFlag().space
            }}
          />
          {/* <Icon
            style={{
              fontSize: 30,
              marginLeft: 4,
            }}
            type={this.getFlag()}
          /> */}
          </div>:null
        }
      </>
    )
  }
}
export class LayoutTable extends LayoutTreeTable {
  render() {
    const { className, style } = this.props;
    return <div className={`${styles.LayoutTable} ${className}`} style={style}>
      {this.props.children}
    </div>
  }
}
