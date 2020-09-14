import React from 'react';
import {
  Collapse,
  Icon
} from 'antd';
import style from './index.less';
const { Panel } = Collapse;

class LinkCollapse extends React.Component {
  state = {
    iconType: {}
  }
  componentDidMount () {
    const { collapseItems, defaultActiveKey } = this.props;
    if (collapseItems && collapseItems.length > 0) {
      this.setState({
        iconType: collapseItems.reduce((r, c) => {
          return {
            ...r,
            ...(defaultActiveKey.includes(c.key) ? { [c.key]: "up-square" } : { [c.key]: "down-square" })
          }
        }, {})
      })
    }
  }
  onChange (key) {
    const { iconType } = this.state;
    let isClose = 1;
    const newIconType = Object.keys(iconType).reduce((r, c) => {
      if (key.includes(c)) {
        isClose = 0
        r[c] = 'up-square'
      } else {
        r[c] = 'down-square'
      }
      return r
    }, {})
    this.setState({
      iconType: newIconType
    })
    const { onChange } = this.props;
    if (onChange) {
      onChange(key, isClose)
    }
  }
  render () {
    // console.log(this.state)
    const { id } = this.props
    return (
      <div className={style.box} id={id}>
        <Collapse
          bordered={false}
          defaultActiveKey={this.props.defaultActiveKey}
          onChange={this.onChange.bind(this)}
        >
          {
            this.props.collapseItems && this.props.collapseItems.length > 0 ?
              this.props.collapseItems.map((c, i) => {
                return (
                  <Panel
                    {...c.props}
                    header={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '4px', height: '13px', marginRight: '8px', backgroundColor: '#0066ff' }} />
                        <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#333333' }}> {c.header} <Icon style={{ fontSize: '16px', color: '#999999' }} type={this.state.iconType[c.key]} /> </div>
                      </div>
                    }
                    key={c.key}
                  >
                    {c.content}
                  </Panel>
                )
              }) : null
          }
        </Collapse>
      </div>
    )
  }
}

export default LinkCollapse;