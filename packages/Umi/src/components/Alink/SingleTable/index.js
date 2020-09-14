import React from 'react';

import { connect } from 'dva';
import Table from '@/components/Alink/Table/Table'

import TableRenders from '@/utils/tableRenders';

function parseURL (url) {
  const a = document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function () {
      const ret = {};
      const seg = a.search.replace(/^\?/, '').split('&'); // 将该字符串首位的?替换成空然后根据&来分隔返回一个数组
      const len = seg.length;
      let i = 0;
      let s;
      for (; i < len; i++) {
        if (!seg[i]) {
          continue;
        }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
      }
      return ret;
    }()),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^\/])/, '/$1'), // 将该字符串首位不是/的用这个组([^\/])替换，$1代表出现在正则表达式中的第一个()、$2代表出现在正则表达式中的第二个()...
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/'),
  };
}


const MyContainer = WrappedComponent => {
  @connect(({ global, button }) => ({ baseHeight: global.contentHeight, buttonData: button.Data }))
  class LogProps extends React.Component {
    state = {
      authrize: [],
      authrizetype: [],
      columns: [],
    }

    componentDidMount () {
      this.init()
    }

    componentWillReceiveProps (newProps) {
      // buttonData浏览器刷新会有延迟
      this.init()
    }

    init (call) {
      const { buttonData, columns = [], isAuthrize } = this.props;

      const url = parseURL(window.location.href)
      const pathname = url.hash
      const authrizetype = []
      const authrize = buttonData.filter(item => {
        const path = /^\/.+/.test(item) ? item : (`/${item}`)
        const arr = path.split('/')
        let newPath = ''
        for (let i = 0; i < arr.length - 1; i++) {
          const o = arr[i]
          if (o) {
            newPath += `/${o}`
          }
        }
        if (newPath === pathname) {
          authrizetype.push(arr[arr.length - 1])
        }
        return newPath === pathname;
      })

      this.setState({ authrize, authrizetype }, () => {
        call && call()
      })
    }

    viewBtns (buttons) {
      buttons = buttons || []
      const { isAuthrize } = this.props;
      const { authrizetype } = this.state;

      if (isAuthrize) {
        let newbuttons = [];
        if (buttons.length) {
          newbuttons = buttons.filter(item => {
            const itmAuthrizeType = item.props.authrizetype;
            if (itmAuthrizeType) {
              return authrizetype.some(item => item.toLowerCase() === itmAuthrizeType.toLowerCase())
            }
            return false
          })
        }


        return newbuttons;
      }
      return buttons
    }

    render () {
      const { buttonData, forwardedRef, baseHeight, scroll, headerButton = [], batchButton = [], isAuthrize, columns = [], ...rest } = this.props;
      const { authrizetype, columns: newColumns } = this.state;
      if (isAuthrize) {
        let idx; let
          operation;
        for (let i = columns.length - 1; i >= 0; i--) {
          const item = columns[i]
          if (item.dataIndex === 'operation') {
            idx = i;
            operation = item;
            break;
          }
        }
        if (operation) {
          const newOperation = {
            ...operation,
            render: (text, record, index) => {
              const renderFn = operation.render;
              const rend = renderFn(text, record, index);
              if (rend.length) {
                const view = this.viewBtns(rend)

                return TableRenders.LinkArrayRender(view)
              }

              return rend
            },
          }
          columns.splice(idx, 1, newOperation)
        }
      }

      const newProps = {
        scroll: scroll || { y: (baseHeight - 190) },
        headerButton: this.viewBtns(headerButton),
        batchButton: this.viewBtns(batchButton),
        columns,
      };
      const authrizeProps = {
        isAuthrize, authrizetype,
      }
      return (
        <WrappedComponent ref={forwardedRef}
          {...rest}
          {...newProps}
          {...authrizeProps}
        />
      )
    }
  }

  return React.forwardRef((props, ref) => <LogProps {...props} forwardedRef={ref} />);
}

export default MyContainer(Table);
