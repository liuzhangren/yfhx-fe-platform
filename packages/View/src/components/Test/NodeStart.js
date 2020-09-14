import React from 'react';
import AddNode from './addNode';
import style from './index.css';

export default class NodeStart extends React.Component {
  state = {

  }


  render() {
    return (
      <div className={style.nodeWrap}>
        <div className={`${style.nodeWrapBox}`}>
          <div>
            <div className={style.title}>start</div>
            <div className={style.content}>请开始流程设计</div>
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