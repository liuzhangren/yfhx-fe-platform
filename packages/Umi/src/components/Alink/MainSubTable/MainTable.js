import React from 'react';

import { connect } from 'dva';
import {
  Collapse,
} from 'view';
import SingleTable from '@/components/Alink/SingleTable'
import styles from './index.less'


/**
 * height:主表的容器高度，支持百分比，不带px像素值
 *
 */
@connect(({ global }) => ({ baseHeight: global.contentHeight }))
class MainTable extends React.Component {
  static defaultProps = {
    height: '50%',
  };

  state = {
    style: { height: 'auto' },
    viewHeight: 0,
  }

  componentDidMount () {
    const { height, baseHeight } = this.props;
    window.addEventListener(
      'resize', () => {
        const y = this.getHeight()
        this.setState({
          style: { height },
          viewHeight: this.getHeight(),
        })
      })
    const y = this.getHeight()
    let pxnum = height;
    if (/^\d+%$/.test(height)) {
      const heightNum = parseInt(height) / 100;
      pxnum = (baseHeight - 20) * heightNum
    }
    this.setState({
      style: { height: pxnum },
      viewHeight: y < 30 ? 30 : y,
    })
  }

  getHeight () {
    const { height = '50%', queryForm, table, baseHeight, title } = this.props;
    let y = 0;
    let el = 170;
    if (!queryForm) {
      el -= 56;
    }
    if (/^\d+%$/.test(height)) {
      const heightNum = parseInt(height) / 100;
      y = (baseHeight - 20) * heightNum - el
    } else {
      y = height - el;
    }
    if (title) {
      y -= 46;
    }
    const { headerButton, batchButton, showPagination } = table;
    if ((!headerButton || !headerButton.length) && (!batchButton || !batchButton.length)) {
      y += 40;
    }
    if (showPagination === false) {
      y += 36;
    }
    y = y < 30 ? 30 : y;
    return Math.floor(y - 2);
  }

  render () {
    const { style, viewHeight } = this.state
    const { height, queryForm, table, title } = this.props;

    return (<div className="MainTable" style={style}>
      {title ? <Collapse
        style={{ padding: '0px' }}
        defaultActiveKey={['1', '2']}
        onChange={(key, isClose) => {
          if (isClose) {
            this.setState({ style: { height: 'auto' } })
          } else {
            this.setState({ style: { height } })
          }
        }}
        collapseItems={[
          {
            key: '1',
            header: title,
            props: {
              showArrow: false,
            },
            content: (<>
              {queryForm}
              <SingleTable {...table} scroll={{ y: this.getHeight() }}></SingleTable>
            </>),
          },
        ]} /> : <>
          {queryForm}
          <SingleTable {...table} scroll={{ y: this.getHeight() }}></SingleTable>
        </>}


    </div>)
  }
}

export default MainTable;
