import React, { Component } from 'react';

import { LinkTree, PageLoading } from 'view';
import { connect } from 'dva'
import request from '@/utils/request'
import { Spin } from 'antd'

const MyContainer = WrappedComponent => {
  @connect(({ global }) => ({ baseHeight: global.contentHeight }))
  class LogProps extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        treeData: [],
        loading: false,
      }
    }

    componentDidMount() {
      const { onInit = () => { } } = this.props;
      onInit && onInit(this);
      this.refresh()
    }

    async refresh(param) {
      const self = this;
      const { childrenProps = 'children', nameProps = 'text', keyProps = 'id', beforeSetData } = this.props;
      self.requestData(self, param).then(treeData => {
        const replaceKey = data => data.reduce((r, c) => {
            const { children, text, id, ...rest } = c
            c.isLeaf = ''
            c.children = c[childrenProps]
            c.title = c[nameProps]
            c.key = c[keyProps]
            if (c.children == null) {
              c.children = ''
            }
            if (c.children && c.children !== null && c.children.length > 0) {
              replaceKey(c.children)
            }
            return [
              ...r,
              c,
            ]
          }, [])
        let newData = treeData;
        if (beforeSetData) { // 修改
          newData = beforeSetData(newData)
        }
        self.setState({
          treeData: replaceKey(newData),
        }, () => {
          self.forceUpdate()
        });
      });
    }

    requestData(self, param) {
      const { renderTitle } = this.props;

      this.setState({ loading: true })
      return new Promise(resolve => {
        const idName = self.props.requestKey || 'id';
        const idValue = self.props.requestValue || '';
        const { link } = self.props

        request(param ? link + self.toParame(param) : link, 'GET', {}).then(respData => {
          if (respData && respData.data instanceof Array) {
            self.setState({ loading: false })
            resolve(
              respData.data,
            );
          }
        });
      });
    }

    toParame = data => {
      let param = '?';
      Object.keys(data).forEach(key => {
        if (data[key] != null && data[key] !== '' && data[key] !== undefined) {
          param += `${key}=${data[key]}&`;
        }
      })
      return param;
    }

    render() {
      const { link, ref, beforeSetData, childrenProps, nameProps, keyProps, ...rest } = this.props;
      const { treeData, loading } = this.state;
      return (
        <Spin spinning={loading}>
          <div style={{ padding: '11px 18px', minHeight: 100 }}>
            <WrappedComponent
              showLine
              {...rest}
              treeData={treeData}
            />


          </div>
        </Spin>
      )
    }
  }

  // return LogProps;
  return React.forwardRef((props, ref) => <LogProps {...props} onInit={ref} />);
}

export default MyContainer(LinkTree);
