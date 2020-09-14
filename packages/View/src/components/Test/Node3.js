import React from 'react';
import AddNode from './addNode';
import Node1 from './Node1'
import Node2 from './Node2'
import NodeStart from './NodeStart'
import NodeEnd from './NodeEnd'
import style from './index.css';


export default class Node3 extends React.Component {
  state = {

  }
  addNode(item, key) {
    this.props.addNode(item, key)
  }
  click(params) {
    this.props.click(params)
  }
  renderNode(item, arr) {
    // const { data } = this.props
    if(item.childNode) {
      if(item.childNode.type==1) {
        arr.push(<>
          <Node1 addNode={this.addNode.bind(this, item.childNode)} data={item.childNode} />
          {
            item.childNode.conditionNodes.length > 0 ?
            <>
              <div className={style.branchWrap} style={{justifyContent: 'center'}}>
                <div className={style.branchBox}>
                  <div className={style.branchBoxWrap} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <button type='button' onClick={this.click.bind(this, item.childNode)} className={style.addBranch}>添加条件</button>
                    {this.renderBranchNode(item.childNode.conditionNodes)}
                  </div>
                </div>
              </div>
              <div className={style.addNodeBtnBox}>
                <div className={style.addNodeBtn}>
                  <span>
                    <AddNode addNode={this.addNode.bind(this, item.childNode)} content={<button className={style.btn}>+</button>} /> 
                  </span>
                </div>
              </div>
            </>:''
          }
        </>)
      }else if(item.childNode.type == 2) {
        arr.push(<>
          <Node2 addNode={this.addNode.bind(this, item.childNode)} data={item.childNode} />
          {
            item.childNode.conditionNodes.length > 0?
            <>
              <div className={style.branchWrap} style={{justifyContent: 'center'}}>
                <div className={style.branchBox}>
                  <div className={style.branchBoxWrap} style={{display: 'flex', justifyContent: 'center'}}>
                    <button type='button' onClick={this.click.bind(this, item.childNode)} className={style.addBranch}>添加条件</button>
                    {this.renderBranchNode(item.childNode.conditionNodes)}
                  </div>
                </div>
              </div>
              <div className={style.addNodeBtnBox}>
                <div className={style.addNodeBtn}>
                  <span>
                    <AddNode addNode={this.addNode.bind(this, item.childNode)} content={<button className={style.btn}>+</button>} /> 
                  </span>
                </div>
              </div> 
            </>:''
          }
        </>)
      }
      this.renderNode(item.childNode, arr)
    }
    return arr
  }
  renderBranchNode(branches) {
    return branches.map((item, i) => {
      if(i === 0) {
        return <div className={style.colBox}>
          <div className={style.topLeftCoverLine}></div>
          <div className={style.bottomLeftCoverLine}></div>
          <div className={style.conditionNode}>
            <div className={style.conditionNodeBox}>
              <div className={style.autoJudge}>
                <div className={style.titleWrap}>
                  <span className={style.conditionTitle}>条件</span>
                  <span className={style.priority}>优先级</span>
                  <i className={style.close}>x</i>
                </div>
                <div className={style.content}>请设置条件</div>
              </div>
              <div className={style.addNodeBtnBox}>
                <div className={style.addNodeBtn}>
                  <span>
                    <AddNode addNode={this.addNode.bind(this, item)} content={<button className={style.btn}>+</button>} /> 
                  </span>
                </div>
              </div>
            </div>
          </div>
          {
            item.childNode? this.renderNode(item, []): ''
          }
        </div>
      }else if(i === branches.length -1) {
        return <div className={style.colBox}>
          <div className={style.topRightCoverLine}></div>
          <div className={style.bottomRightCoverLine}></div>
          <div className={style.conditionNode}>
            <div className={style.conditionNodeBox}>
              <div className={style.autoJudge}>
                <div className={style.titleWrap}>
                  <span className={style.conditionTitle}>条件</span>
                  <span className={style.priority}>优先级</span>
                  <i className={style.close}>x</i>
                </div>
                <div className={style.content}>请设置条件</div>
              </div>
              <div className={style.addNodeBtnBox}>
                <div className={style.addNodeBtn}>
                  <span>
                    <AddNode addNode={this.addNode.bind(this, item)} content={<button className={style.btn}>+</button>} /> 
                  </span>
                </div>
              </div>
            </div>
          </div>
          {
            item.childNode? this.renderNode(item, []): ''
          }
        </div>
      }else {
        return <div className={style.colBox}>
          <div className={style.topLeftCoverLine}></div>
          <div className={style.bottomLeftCoverLine}></div>
          <div className={style.topRightCoverLine}></div>
          <div className={style.bottomRightCoverLine}></div>
          <div className={style.conditionNode}>
            <div className={style.conditionNodeBox}>
              <div className={style.autoJudge}>
                <div className={style.titleWrap}>
                  <span className={style.conditionTitle}>条件</span>
                  <span className={style.priority}>优先级</span>
                  <i className={style.close}>x</i>
                </div>
                <div className={style.content}>请设置条件</div>
              </div>
              <div className={style.addNodeBtnBox}>
                <div className={style.addNodeBtn}>
                  <span>
                    <AddNode addNode={this.addNode.bind(this, item)} content={<button className={style.btn}>+</button>} /> 
                  </span>
                </div>
              </div>
            </div>
          </div>
          {
            item.childNode? this.renderNode(item, []): ''
          }
        </div>
      }
    })
  }
  renderFlow(data) {
    if(data.childNode) {
      this.renderNode(data)
    }else {
      
    }
  }
  render() {
    const { branches } = this.props;
    // debugger
    return (
      <div className={style.nodeWrap}>
        <div className={style.branchWrap} style={{justifyContent: 'center'}}>
          <div className={style.branchBox}>
            <div className={style.branchBoxWrap} style={{display: 'flex', justifyContent: 'center'}}>
              <button type='button' onClick={this.click.bind(this, branches)} className={style.addBranch}>添加条件</button>
              {
                this.renderBranchNode(branches.conditionNodes)
              }
            </div>
          </div>
        </div>
        <div className={style.addNodeBtnBox}>
          <div className={style.addNodeBtn}>
            <span>
              <AddNode addNode={this.addNode.bind(this, 'jihe')} content={<button className={style.btn}>+</button>} /> 
            </span>
          </div>
        </div>
      </div>
    )
  }
}