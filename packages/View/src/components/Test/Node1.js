import React from 'react';
import AddNode from './addNode';
import style from './index.css';

export default class Node1 extends React.Component {
  state = {
    
  }
  render() {
    const { data } = this.props
    return (
      <div className={style.nodeWrap}>
        <div className={`${style.nodeWrapBox}`}>
          <div>
            <div className={style.title} style={{backgroundColor: 'rgb(255, 148, 62)'}}>
              审批人 {data.id}
              <i className={style.close} style={{top: 0, right: 0}}>x</i>
            </div>
            <div className={style.content}>请选择审批人 {data.id}</div>
          </div>
        </div>
        <div className={style.addNodeBtnBox}>
          <div className={style.addNodeBtn}>
            <span>
              <AddNode addNode={this.props.addNode} content={<button className={style.btn}>+</button>} /> 
            </span>
          </div>
        </div>
      </div>
    )
  }
}