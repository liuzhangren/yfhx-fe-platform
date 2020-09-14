import React from 'react';
import AddNode from './addNode';
import style from './index.css';

export default class NodeEnd extends React.Component {
  state = {

  }


  render() {
    return (
      <div className={style.nodeWrap}>
        <div className={style.endNode}>
          <div className={style.endNodeCircle}></div>
          <div className={style.endNodeText}>end</div>
        </div>
      </div>
    )
  }
}