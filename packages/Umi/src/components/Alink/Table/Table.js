/*eslint-disable*/
import React from 'react';
import ReactDOM from 'react-dom';
import {
  Table,
  ConfigProvider,
  Button,
  Pagination,
  message,
  Icon,
  Divider,
  Tooltip,
} from 'antd';

import zhCN from 'antd/es/locale/zh_CN';

import request from '@/utils/request'

import { Resizable } from 'react-resizable';
import { Confirm, Warning, Modal } from 'view';
import { GetUid } from '@/utils/tableRenders'
import style from './index.less';
import Sort from '@/utils/sort'

class ResizeableTitle extends React.Component {
  render() {
    const { onResize, width, onClick, ...restProps } = this.props;

    if (!width) {
      return <th {...restProps} onClick={(...args) => {
        onClick && onClick(...args)
      }} />;
    }

    return (
      <Resizable
        width={width}
        height={0}
        onResizeStart={() => (this.resizing = true)}
        onResizeStop={() => {
          setTimeout(() => {
            this.resizing = false;
          });
        }}
        onResize={onResize}
      >
        <th
          onClick={(...args) => {
            console.log(">>>", this.resizing);
            if (!this.resizing && onClick) {
              onClick(...args);
            }
          }}
          {...restProps}
        />
      </Resizable>
    );
  }
}


/**
 * link:请求链接，
 * defaultParams:{} 默认的请求参数
 * beforeSetData:(data)=>{return data}  预处理数据
 *frontCache:bool 是否前端缓存数据，不会有行号
 * afterGetData:(data,param,page)=>{} 请求完数据的回调
 * showPagination:bool,  是否显示分页,默认存在
 * sortNo:bool,是否显示序号列,默认存在
 * checkable:bool 是否能勾选  默认存在
 * defaultRowCheckableKeys:[] 默认勾选的key值
 *
 * checkAll:bool 默认是否全部勾选
 * isAsync:bool 行点击事件和复选框勾选事件是否同步 默认false,当为true时，rowSelectedMultiple一定是true
 *
 *
 *
 * clearAllData:清除所有的数据，包括行数据
 * defaultRowSelectedKeys:[] 默认行选中key值,
 * rowSelectedMultiple:false  //行选是否能多选selectedRowsData 所有选中行的数据，record当前行的数据
 * onChange(rowCheckableKeys, selectedRows(当前页行数据))   勾选行事件的回调
 * rowSelected(record,keys)  行选中事件 record该行数据，keys该行的key值
 * rowDoubleSelected(record) 双击回调事件    record该行数据,

 *
 *
 *
 *
 * 方法
 *
 *
 */

export class RowDelete extends React.Component {
  render() {
    const { onCallback = () => { }, record, table, click } = this.props;
    return (
      <Tooltip title="删除">
        <a style={{ color: '#ff008c' }} className={style.rowDelete} onClick={e => {
          e.stopPropagation()
          click ? click() :
            Confirm({
              onOk() {
                table.rowDelete(record, onCallback)
              },
              onCancel() { },
            }, 'one')
        }} >
          <Icon type="delete" />
        </a>
      </Tooltip>)
  }
}


export class RowsDelete extends React.Component {
  render() {
    const { onCallback = () => { }, table, disabled, beforeConfirm } = this.props;
    return (<Button
      icon="delete"
      disabled={disabled}
      onClick={() => {
        let pass = true;
        if (beforeConfirm) {
          pass = beforeConfirm()
        }
        if (pass !== false) {
          Confirm({
            onOk() {
              table.rowsDelete('', onCallback)
            },
            onCancel() { },
          }, 'many');
        }
      }}
    >{this.props.children}</Button>)
  }
}

export class AddRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { beforeShow = () => { }, onCallback = () => { }, table, modal, record } = this.props;
    return (
      <Button
        type="primary"
        icon="plus"
        onClick={() => {
          const pass = beforeShow();
          if (pass === false) {

          } else {
            modal && modal.show('ADD', record)
          }
          // props.refresh()
        }}
      >{this.props.children}</Button>)
  }
}

export class ViewRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { onClick = () => { }, table, modal, record } = this.props;
    return (
      <Tooltip title="查看">
        <a
          onClick={e => {
            e.stopPropagation()
            modal && modal.show('VIEW', record)
          }}>
          <Icon type="search" />


        </a>
      </Tooltip>)
  }
}

export class EditRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { onClick = () => { }, table, modal, record, click } = this.props;
    return (
      <Tooltip title="编辑">
        <a
          onClick={e => {
            e.stopPropagation()
            modal && modal.show('UPDATE', record)
            click && click()
          }}>
          <Icon type="edit" />


        </a>
      </Tooltip>)
  }
}

export class TableModal extends React.Component {
  static defaultProps = {
    loading: false
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      type: '',
      record: '', loading: this.props.loading
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.loading !== this.props.loading) {
      this.setState({ loading: nextProps.loading });
    }
  }

  show(type, record) {
    const { onShow } = this.props;
    this.setState({ visible: true, type, record }, () => {
      setTimeout(() => {
        onShow && onShow(record, type)
      }, 10)
    })
  }

  hide() {
    this.setState({ visible: false, loading: false })
  }

  onCancel = () => {
    const { onShow, onOk, table, title, onCancel, onCallBack = () => { }, ...rest } = this.props;
    const { visible, type, record } = this.state;
    this.hide()
    onCancel && onCancel()
  }

  onOk = () => {
    const { onShow, onOk, table, title, onCancel, onCallBack = () => { }, onFail = () => { }, ...rest } = this.props;
    const { visible, type, record } = this.state;
    const data = onOk && onOk(type, record);
    if (data) {
      if (type === 'UPDATE') {
        this.setState({ loading: true })
        table.rowEdit(data, res => {
          onCallBack(type, data, res)
          this.hide();
        }, (res) => {
          this.setState({ loading: false })
          onFail(data, res)
        })

      } else {
        this.setState({ loading: true })
        table.rowAdd(data, res => {
          onCallBack(type, data, res)
          this.hide();
        }, (res) => {
          this.setState({ loading: false })
          onFail(data, res)
        })
      }
    }
  }

  renderFooter = () => {
    const { visible, type, record, loading } = this.state;
    const { footer } = this.props;
    if (footer) {
      return footer;
    }
    return <><Button onClick={this.onCancel}>取消</Button>{type === 'VIEW' || type === 'INPUT' ? null : <Button type="primary" loading={loading} disabled={loading} onClick={this.onOk}>保存</Button>}</>
  }

  render() {
    const { onShow, onOk, table, title, onCancel, onCallBack = () => { }, ...rest } = this.props;
    const { visible, type, record } = this.state;
    const newTitle = type === 'UPDATE' ? '编辑' : type === 'VIEW' ? '查看' : type === 'ADD' ? '新增' : ''
    const okText = type === 'VIEW' ? null : '保存'

    return (<Modal destroyOnClose
      bodyStyle={{ padding: 0 }}
      title={newTitle + title}
      visible={visible}
      okText={okText}
      footer={this.renderFooter()}
      onCancel={() => {
        this.hide()
        onCancel && onCancel()
      }} {...rest}>
      {this.props.children}
    </Modal>)
  }
}


let vsData = [];
const pageLength = 50;

export default class App extends React.Component {
  static defaultProps = {
    pageSize: 10,
    bordered: true,
    showPagination: true,
    sortNo: true,
    checkable: true,
    defaultRowCheckableKeys: [],
    defaultRowSelectedKeys: [],
    rowSelectedMultiple: false,
    dictLinkPrefix: '',
    frontCache: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      rowCheckableKeys: [], // 勾选状态key值
      rowCheckableData: [], // 勾选状态数据值
      rowSelectedKeys: [], // 行选中key值
      rowSelectedData: [], // 行选中行数据
      loading: false, // 请求状态
      data: [], // 显示数据,
      param: {}, // 表格参数
      pageSizeOptions: ['10', '30', '50', '100', '500', '1000', '3000', '5000'],
      pagination: {
        current: 1,
      },
      dictData: {},
      vsPage: 1,
      curPageRowCheckableKeys: [], // 当前页勾选key
      curPageRowCheckableData: [], // 当前页勾选key

    }
  }

  scrollToTop() {
    const table = ReactDOM.findDOMNode(this.table);
    const content = table.getElementsByClassName('ant-table-body')[0]
    content.scrollTop = 0;
  }

  componentDidMount() {
    const { pageSize, defaultRowCheckableKeys, defaultRowSelectedKeys, rowSelectedMultiple, isAsync } = this.props;
    const { rowCheckableKeys, rowSelectedKeys, pageSizeOptions } = this.state;
    const pagination = {
      ...this.state.pagination,
      pageSize: parseInt(pageSize, 0),
      current: 1,
    }
    const selected = rowSelectedKeys.concat(defaultRowSelectedKeys);
    let showSelected = []
    if (!rowSelectedMultiple) {
      showSelected.push(selected[0]);
    } else {
      showSelected = selected;
    }

    if (isAsync) {
      showSelected = rowCheckableKeys.concat(defaultRowCheckableKeys)
    }

    this.setState({
      pagination,
      rowCheckableKeys: rowCheckableKeys.concat(defaultRowCheckableKeys),
      rowSelectedKeys: showSelected,
      pageSizeOptions: this.getPageSizeOptionsInit(),
    }, () => {
      // 加载数据字典
      this.loadDict()
      if (this.props.onInit) {
        this.props.onInit()
      }
    });
    // c处理数据量大，卡死问题
    // if (this.table) {
    //   const table = ReactDOM.findDOMNode(this.table);
    //   const content = table.getElementsByClassName('ant-table-body')[0]

    //   const self = this;
    //   let status;
    //   content.addEventListener('scroll', function () {
    //     const max = Math.ceil(vsData.length / pageLength)
    //     const wrapHeight = parseInt(content.offsetHeight)
    //     const conHeight = parseInt(content.getElementsByTagName('table')[0].offsetHeight)
    //     if (vsData.length > 300) {
    //       const cur = this.scrollTop;
    //       let { vsPage, data } = self.state;
    //       if (cur < 5) {
    //         if (status !== 'TOP') {
    //           status = 'TOP'
    //           vsPage--
    //           if (vsPage < 1) {
    //             vsPage = 1
    //           }
    //           self.setState({ vsPage, data: vsData.slice(vsPage < 2 ? 0 : pageLength * (vsPage - 2), pageLength * vsPage > vsData.length ? vsData.length : pageLength * vsPage) }, () => {
    //             if (vsPage !== 1) {
    //               status = ''
    //               content.scrollTop = pageLength * 30 + cur
    //             }
    //           })
    //         }
    //       } else if (cur > conHeight - wrapHeight - 10) {
    //         if (status !== 'BOTTOM') {
    //           status = 'BOTTOM'
    //           vsPage++
    //           if (vsPage > max) {
    //             vsPage = max;
    //           }

    //           // content.scrollTop = cur
    //           self.setState({ vsPage, data: vsData.slice(pageLength * (vsPage - 2), pageLength * vsPage > vsData.length ? vsData.length : pageLength * vsPage) }, () => {
    //             if (vsPage !== max) {
    //               status = ''
    //               if (vsPage != 2) {
    //                 content.scrollTop = cur - pageLength * 30
    //               }
    //             }
    //           })
    //         }
    //       }
    //     }
    //   })
    // }
  }

  componentWillReceiveProps(newProps) {

    const { dataSource } = newProps;
    if (dataSource) {
      this.setState({ data: this.updateNum(this.sortData(dataSource)) })
    }

    this.getColumns(newProps)
  }

  getPageSizeOptionsInit() {
    const { pageSizeOptions } = this.state;
    const { pageSize } = this.props;

    const news = pageSizeOptions.filter(item => item != pageSize)

    news.push(`${pageSize}`)
    news.sort((a, b) => a - b)
    return news
  }

  loadDict = () => {
    const { dictType, columns, dictLinkPrefix, dictLink } = this.props;

    const pcodes = columns.reduce((r, c) => {
      if (c.dict) {
        r.push(c.dict)
      }
      return r
    }, [])
    const self = this;

    const urlsObj = {};
    columns.map(item => {
      if (item.dictLink) {
        urlsObj[item.dictLink] = urlsObj[item.dictLink] || { url: item.dictLink, busType: item.dictType, pcodes: [] }
        urlsObj[item.dictLink].pcodes.push(item.dict)
      }
    })


    // 对以前写的代码兼容（对于只有一个类型的数据字典情况）
    if (pcodes.length && dictLink) {
      let newPcodes = pcodes.map(item => `pcodes=${item}`)
      newPcodes = newPcodes.join('&');
      let url = `${dictLink}?${newPcodes}`;
      url = dictType ? `${url}&busType=${dictType}` : url;

      request(url, 'GET', {}).then(response => {
        if (response && response.code === 0) {
          const obj = {};
          response.data.map(item => {
            obj[item.dictCode] = item.list;
          })
          self.setState({ dictData: obj }, () => {
            this.getColumns()
          });
        }
      });
    } else if (Object.keys(urlsObj).length) {
      this.loadDicts(urlsObj)
    } else {
      this.getColumns()
    }
  }

  async loadDicts(objArr) {
    // const arr = Object.values(obj).map(item => {
    //   const { url, busType, pcodes } = item;
    //   let newPcodes = pcodes.map((itm) => {
    //     return `pcodes=${itm}`
    //   })
    //   newPcodes = newPcodes.join("&");
    //   let newurl = dictLink + "?" + newPcodes;
    //   newurl = busType ? newurl + "&busType=" + busType : url;
    //   return await request(newurl, 'GET', {})
    // })
    const arr = []
    for (let i = 0; i < Object.values(objArr).length; i++) {
      const item = Object.values(objArr)[i];
      const { url, busType, pcodes } = item;
      let newPcodes = pcodes.map(itm => `pcodes=${itm}`)
      newPcodes = newPcodes.join('&');
      let newurl = `${url}?${newPcodes}`;
      newurl = busType ? `${newurl}&busType=${busType}` : newurl;
      arr.push(await request(newurl, 'GET', {}))
    }

    const obj = {};
    arr.map(res => {
      if (res && res.code === 0) {
        const { data } = res;
        data.map(td => {
          obj[td.dictCode] = td.list;
        })
      }
    })
    this.setState({ dictData: obj }, () => {
      this.getColumns()
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

  async requestData({ pageSize, pageNo, param }) {
    const self = this;
    const { defaultParams } = this.props;
    this.setState({ loading: true })
    return new Promise((resolve, reject) => {
      const params = {
        limit: pageSize,
        page: pageNo,
        ...param,
        ...defaultParams,
      };
      if (self.props.link) {
        request(self.props.link + self.toParame(params), 'GET', {}).then(response => {
          self.setState({ loading: false })
          if (response && response.code === 0) {
            resolve(response.data);
          } else {
            reject(response)
          }
        });
      } else {
        const { dataSource } = this.props;
        resolve(dataSource);
      }
    });
  }

  // 删除行数据
  async rowDelete(record, callback, fail) {
    const { rowDelLink, frontCache } = this.props;
    if (frontCache) {
      const { data: dataSource } = this.state;
      const keys = dataSource.map(item => item.key);
      const idx = keys.indexOf(record.key)
      dataSource.splice(idx, 1);
      // 删除后序号会乱掉

      this.setState({ data: dataSource.map((item, index) => ({ ...item, index: index + 1 })), rowCheckableKeys: [] })
      callback && callback()
      return;
    }
    const { id } = record;
    const res = await request(`${rowDelLink}/${id}`, { method: 'delete' })
    if (res && res.code === 0) {
      message.success('操作成功')
      callback && callback()
      this.refresh('', '', false)
    } else {
      fail && fail()
    }
  }

  // 批量删除行数据
  async rowsDelete(record, callback, fail) {
    const { rowsDelLink, frontCache } = this.props;
    const { curPageRowCheckableData: rowCheckableData } = this.state;
    if (frontCache) {
      const { data: dataSource } = this.state;
      rowCheckableData.map(item => {
        const keys = dataSource.map(item => item.key);
        const idx = keys.indexOf(item.key)
        dataSource.splice(idx, 1);
      })
      this.setState({
        data: dataSource.map((item, index) => ({ ...item, index: index + 1 })),
        curPageRowCheckableData: [],
        curPageRowCheckableKeys: [],
        rowCheckableKeys: [],
        rowCheckableData: []
      })
      callback && callback()
      return;
    }
    const ids = rowCheckableData.map(item => `ids=${item.id}`)
    const res = await request(`${rowsDelLink}?${ids.join('&')}`, { method: 'delete' })
    if (res && res.code === 0) {
      message.success('操作成功')
      callback && callback()
      this.refresh('', '', false)
    } else if (res && res.code === 1) {
      callback && callback()
    } else {
      fail && fail()
    }
  }

  formatData(data) {
    return { ...data, key: data.key || data.id || GetUid(16), }
  }

  getTableData() {
    const { data } = this.state;
    return data;
  }
  getPagenationData() {
    const { pagination } = this.state;
    return pagination;
  }
  // 新增行数据
  rowAdd = async (data, onSeccess, onFail) => {
    // data可能有多条数据的情况
    const { rowAddLink, frontCache, defaultSortKey } = this.props;
    if (frontCache) {
      const { data: dataSource } = this.state;
      // 处理判断如果有相同数据不能存入行，这里只判断key值
      const checkHas = dt => {
        let has = false;
        if (dt.key) {
          has = dataSource.some(item => item.key === dt.key)
        }
        if (has) {
          return dt
        }
        return false
      }
      if ((data instanceof Array) && data.length) {
        const hasList = []; const
          noList = [];
        data.map(item => {
          const has = checkHas(item);
          if (has) {
            hasList.push(item);
          } else {
            noList.push(item);
          }
        })
        const self = this;
        if (hasList.length && noList.length) {
          Warning({
            title: '您选中的数据有部分数据已存在',
            content: '已存在的数据将会被忽略',
            onOk: () => {
              noList.map(item => {
                dataSource.push({ ...self.formatData(item), index: dataSource.length + 1 })
              })
              self.setState({ data: this.updateNum(this.sortData(dataSource)) })
              onSeccess && onSeccess(dataSource)
            },
          })
        } else if (!noList.length) {
          Warning({
            title: '您选中的数据已存在',
            content: '请重新选择',
          })
        } else if (!hasList.length) {
          noList.map(item => {
            dataSource.push({ ...self.formatData(item), index: dataSource.length + 1 })
          })

          self.setState({ data: this.updateNum(this.sortData(dataSource)) })
          onSeccess && onSeccess(dataSource)
        }
      } else {
        const has = checkHas(data)
        if (has) {
          message.error('该条数据已存在')
          return;
        }
        dataSource.push({ ...this.formatData(data), index: dataSource.length + 1 })


        self.setState({ data: this.updateNum(this.sortData(dataSource)) })
        onSeccess && onSeccess(data)
      }
    } else {
      const res = await request(`${rowAddLink}`, { method: 'POST', data })
      if (res && res.code === 0) {
        message.success('操作成功')
        onSeccess && onSeccess(res)
        this.refresh()
      } else {
        onFail && onFail()
      }
    }
  }
  sortData = (data) => {
    const { frontCache, defaultSortKey } = this.props;
    if (frontCache && defaultSortKey) {
      data.sort(function (a, b) {
        return a[defaultSortKey].localeCompare(b[defaultSortKey])
      })
    }
    return data;
  }
  updateNum(data) {
    return data.map((item, index) => {
      return { ...item, index: index + 1 }
    })
  }
  // 编辑行数据
  async rowEdit(data, onSeccess, onFail) {
    const { rowEditLink, frontCache } = this.props;
    if (frontCache) {
      const { data: dataSource } = this.state;
      const keys = dataSource.map(item => item.key);
      const idx = keys.indexOf(data.key)
      dataSource.splice(idx, 1, data);
      this.setState(dataSource)
      onSeccess && onSeccess(dataSource)
      return;
    }
    const res = await request(`${rowEditLink}`, { method: 'PUT', data })
    if (res && res.code === 0) {
      message.success('操作成功')
      onSeccess && onSeccess(res)
      this.refresh('', '', false)
    } else {
      onFail && onFail(res)
    }
  }


  /**
 * 刷新表格信息
 * @param  param 刷新表格的参数
 */
  refresh(param = {}, pagination, reloadPage, reloadParam) {
    const { pageSize, showPagination } = this.props;
    let newParam = {};
    if (!reloadParam) {
      newParam = { ...this.state.param, ...param };
    } else {
      newParam = { ...param }
    }
    const pager = { pageSize, ...this.state.pagination };
    const { beforeSetData, afterGetData } = this.props;
    const self = this;
    // 分页在编辑，删除时需要保持当前页
    if (pagination) {
      pager.current = pagination.current;
      pager.pageSize = pagination.pageSize;
    } else if (reloadPage === false) {

    } else {
      const { pageSize } = this.props;
      pager.current = 1;
      pager.pageSize = pager.pageSize || pageSize;
    }

    self.setState({
      pagination: pager,
      loading: true,
      param: { ...newParam },
    }, () => {
      const { pagination } = self.state;
      self.setState({ pagination });
    })
    let params = { param: newParam, };
    if (showPagination) {
      params = {
        ...params,
        pageSize: pager.pageSize,
        pageNo: pager.current,
      }
    }

    self.requestData(params)
      .then(data => {
        this.scrollToTop()
        const { pageNum, pageSize, total } = data
        const pagination = { pageNum, pageSize, total };
        const { rowCheckableData, rowCheckableKeys } = this.state;
        const { checkAll } = this.props;
        data = data || {};
        const arr = []
        const keysArr = []

        // 对数据库拉到的数据, 进行预处理
        let records = data.data;
        if (beforeSetData) {
          records = beforeSetData(data.data);
        }
        // 处理，初始化时如果有默认key,行数据会为空的情况

        records = records.map((item, index) => {
          const newItem = { ...item, id: item.id || item.key, key: item.key || item.id, index: index + 1 }
          if (checkAll) {
            arr.push(newItem)
            keysArr.push(item.id)
          } else if (rowCheckableKeys.indexOf(item.id) >= 0) {
            arr.push(newItem)
            keysArr.push(item.id)
          }
          return newItem;
        });

        // 数据请求完的回调
        if (afterGetData) {
          afterGetData(records, newParam, pagination)
        }

        if (showPagination) {

          if (data.total && Math.ceil(data.total / data.pageSize) < data.pageNum) {
            this.refresh('', { ...pagination, current: data.pageNum - 1 })
          }
        }

        vsData = records;
        // 初始状态下，checkAll状态失效

        const showData = records
        // records.length > 300 ? records.slice(0, pageLength) : records
        self.setState({
          loading: false,
          curPageRowCheckableKeys: keysArr,
          curPageRowCheckableData: arr,
          initialData: records,
          data: showData,
          modifiedRecords: [],
          pagination: {
            current: data.pageNum,
            pageSize: data.pageSize,
            total: data.total,
          },
        }, () => {
          if (checkAll) {
            this.rowCheckable(keysArr, arr)
          }

        });
      }).catch(error => {
        self.setState({
          loading: false,
        })
      });
  }

  setData = data => this.setState({ data })

  upSort = (record) => {
    const { sortLink } = this.props;
    const { data } = this.state
    const { id } = record;
    data.forEach((c, i) => {
      if (i > 0 && c.id === id) {
        const temp = c
        data[i] = data[i - 1]
        data[i - 1] = temp
      }
    })
    request(`${sortLink}`, {
      method: 'put',
      data,
    }).then(res => {
      if (res.success) {
        this.refresh()
      }
    })
  }

  downSort = (record) => {
    const { sortLink } = this.props;
    const { data } = this.state
    const { id } = record;
    const newData = [...data]
    newData.forEach((c, i) => {
      if (i < data.length - 1 && c.id === id) {
        const temp = data[i + 1]
        data[i + 1] = c
        data[i] = temp
      }
    })
    request(`${sortLink}`, {
      method: 'put',
      data,
    }).then(res => {
      if (res.success) {
        this.refresh()
      }
    })
  }

  // 得到列的信息
  getColumns(props) {
    let newProps;
    if (props) {
      newProps = props;
    } else {
      newProps = this.props;
    }
    const { mode, ellipsis, sortNo, fontSort, frontCache } = newProps;
    const columns = [...newProps.columns];

    // 每一行加上序号
    sortNo && columns.unshift({
      dataIndex: 'index',
      title: '序号',
      width: 50,
      fixed: 'left',
      render: (data, record) => {
        const { current, pageSize } = this.state.pagination
        return parseInt(data + (current - 1) * pageSize);
      },
    });

    fontSort && columns.splice(columns.length - 1, 0, {
      dataIndex: 'sort',
      title: '排序',
      width: 70,
      render: (text, record) => [
        <a
          onClick={() => this.upSort(record)}
        >
          <Icon type="arrow-up" />
        </a>,
        <Divider type="vertical" />,
        <a
          onClick={() => this.downSort(record)}
        >
          <Icon type="arrow-down" />
        </a>,
      ],
    })
    // 添加溢出隐藏
    if (ellipsis !== false) {
      columns.map(item => {
        item.ellipsis = true
      })
    }
    const { dictData } = this.state;

    const newColumns = columns.map(item => {
      if (item.dict) {
        const keys = item.dict;
        const { render } = item;
        const { dictCode = "dictCode" } = item;
        // delete item.dict;
        return {
          ...item,
          render: (text, record, index) => {
            const { dictData } = this.state;
            const dict = dictData[keys];
            if (dict) {
              const re = dict.reduce((r, c) => {
                if (c[dictCode] === text) {
                  r = c.dictName
                }
                return r
              }, '')

              if (render) {
                const t = render(re, record, index);
                return t || re
              }
              return re
            }
          },
        }
      }
      return item;
    });


    this.setState({
      columns: newColumns.map((col, index) => ({
        ...col,
        onHeaderCell: column => ({
          width: column.width,
          onResize: this.handleResize(index),
        }),
      })),
    })
    return newColumns;
  }

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  rowSelection(rowCheckableKeys) {
    return {
      columnWidth: 30,
      onChange: this.rowCheckable,
      selectedRowKeys: rowCheckableKeys,
      onSelectAll: this.rowSelectAll,
      onSelect: this.rowSelectOne,
      getCheckboxProps: record => {
        //
        if (this.props.reShowChecked) {
          return ({
            defaultChecked: this.state.rowCheckableKeys && this.state.rowCheckableKeys.includes(`${record.id}`),
          })
        }
      },
    }
  }

  onShowSizeChange(page, pageSize) {
    const { pagination } = this.state.pagination
    this.setState({ pagination: { ...pagination, page, pageSize } })
    this.refresh('', { current: 1, pageSize, pageSize });
  }

  paginationChange(page, pageSize) {
    const { pagination } = this.state.pagination
    this.setState({ pagination: { ...pagination, page, pageSize } })
    this.refresh('', { current: page, pageSize });
  }

  // 得到表格宽度
  getScrollWidth = () => {
    let scrollWidth = 80;
    const { columns } = this.props;
    columns.map(item => { scrollWidth += (item.width || 120) })
    return scrollWidth
  }

  clearData = () => {
    this.setState({
      rowCheckableKeys: [],
      rowCheckableData: [],
      rowSelectedKeys: [],
      rowSelectedData: [],
      curPageRowCheckableKeys: [],
      curPageRowCheckableData: [],
    })
  }

  clearAllData = () => {
    this.setState({
      rowCheckableKeys: [],
      rowCheckableData: [],
      rowSelectedKeys: [],
      rowSelectedData: [],
      curPageRowCheckableKeys: [],
      curPageRowCheckableData: [],
      data: [],
    })
  }

  rowCheckable = (rowCheckableKeys, selectedRows, type) => {
    const { onChange = () => { }, isAsync } = this.props;
    const allKeys = rowCheckableKeys;
    const allData = selectedRows;
    const { data, curPageRowCheckableData: oldSelectedRows, curPageRowCheckableKeys: oldRowCheckableKeys, rowCheckableKeys: oldAllKeys, rowCheckableData: oldAllData } = this.state;

    // 匹配当前页选中数据
    const curPageRowCheckableData = data.filter(item => rowCheckableKeys.indexOf(item.key || item.id) >= 0)

    const curPageRowCheckableKeys = curPageRowCheckableData.map(item => (item.key || item.id))
    // 获取当前勾选行数据

    let noHas;
    let has;
    // if (oldAllKeys.length > rowCheckableKeys.length) {
    //   // 取消
    //   noHas = oldAllData.filter(item => !selectedRows.some(itm => itm.id === item.id))
    // } else {
    //   // 勾选
    //   has = selectedRows.filter(item => !oldAllData.some(itm => itm.id === item.id))
    // }

    // if (oldAllKeys.length - rowCheckableKeys.length === 1) {
    //   // 取消某一行
    //   if (isAsync && type !== 'click') {
    //     this.rowClick(noHas[0], false, 'check')
    //   }
    // } else if (rowCheckableKeys.length - oldAllKeys.length === 1) {
    //   // 勾选某一行
    //   if (isAsync && type !== 'click') {
    //     this.rowClick(has[0], true, 'check')
    //   }
    // }
    this.setState({ rowCheckableKeys: allKeys, rowCheckableData: allData, curPageRowCheckableData, curPageRowCheckableKeys });
    onChange(curPageRowCheckableKeys, curPageRowCheckableData, allKeys, allData)
  }
  rowSelectAll = (selected, selectedRows, changeRows) => {
    const { onChange = () => { }, isAsync } = this.props;
    if (isAsync) {
      // 取消全部
      changeRows.map(item => {
        this.rowClick(item, selected, 'check')
      })
    }
  }
  rowSelectOne = (record, selected, selectedRows, nativeEvent) => {

    const { isAsync } = this.props;
    if (isAsync) {
      this.rowClick(record, selected, 'check')
    }
  }
  // bool 判断是否选中，当不存在时可以切换选
  rowClick(record, bool, type) {
    const { rowSelectedKeys } = this.state;
    const { rowSelectedMultiple, rowSelected = () => { }, isAsync } = this.props;
    const has = rowSelectedKeys.indexOf(record.key || record.id);
    let newRowSelectedKeys = []
    if (rowSelectedMultiple) {
      if (has >= 0 && bool !== true) {
        // 已存在，当可以多选时，可以取消状态
        rowSelectedKeys.splice(has, 1);
        newRowSelectedKeys = rowSelectedKeys;
      } else {
        newRowSelectedKeys = rowSelectedKeys;
        newRowSelectedKeys.push(record.id)
      }
    } else {
      newRowSelectedKeys = [record.id]
    }
    this.setState({ rowSelectedKeys: newRowSelectedKeys })
    if (!rowSelectedMultiple && has >= 0) {
      return;
    }
    let status;
    if (rowSelectedMultiple) {
      if (bool) {
        status = 'choose'
      } else if (bool === false) {
        status = 'cancel'
      } else {
        status = has >= 0 ? 'cancel' : 'choose'
      }
    } else {
      status = 'choose';
    }


    if (type === 'click' && isAsync) {
      const { rowCheckableKeys, rowCheckableData } = this.state;
      if (status === 'choose') {
        rowCheckableKeys.push(record.id)
        rowCheckableData.push(record)
        this.rowCheckable(rowCheckableKeys, rowCheckableData, type)
      } else {
        this.rowCheckable(
          rowCheckableKeys.filter(item => item != record.id),
          rowCheckableData.filter(item => item.id != record.id), type)
      }
    }

    rowSelected(record, newRowSelectedKeys[0], status)
  }
  render() {
    const { checkable, bordered, batchButton = [], headerButton = [], showPagination, scroll, rowSelectedMultiple, rowSelected = () => { }, rowDoubleSelected = () => { }, columns: columnsProps, onChange, frontCache, ...rest } = this.props;
    const { rowCheckableKeys, data, loading, columns, pagination, pageSizeOptions, curPageRowCheckableKeys } = this.state;
    const y = scroll && scroll.y


    // const paginationOptions = pagination ? pagination : {
    //   total: data.length,
    //   pageSize: 10,
    //   page: 1
    // }
    const newBatchButton = batchButton.map(item => React.cloneElement(item, { disabled: !(curPageRowCheckableKeys.length > 0) }))

    return (
      <div style={{ position: 'relative' }} className={style.tableWrap}>
        <ConfigProvider locale={zhCN}>
          {headerButton.length || newBatchButton.length ? <div className={style.titleWrap} style={{ display: 'flex' }}><>
            {
              headerButton.map((button, index) =>
                // button = React.cloneElement(button, { size: "small" })
                React.cloneElement(button, { key: index + 1 }),
              )
            }</>
            {
              newBatchButton && newBatchButton.length > 0 ?
                <>
                  {
                    newBatchButton.map((item, index) => React.cloneElement(item, { key: index + 1 }))
                  }</> :
                null
            }</div> : null}
          <Table
            ref={table => this.table = table}
            size="small"
            components={{
              header: {
                cell: ResizeableTitle,
              },
            }}
            columns={columns}
            loading={loading}
            bordered={bordered}
            onChange={(page, filters, sorter, extra) => {
              const { pagination, param } = this.state;
              const { frontCache } = this.props;
              if (!frontCache) {
                this.setState({ pagination: { ...pagination, current: 1 } }, () => { this.refresh({ ...param, sortName: sorter.field, orderType: sorter.order }, { ...pagination, current: 1 }) })
              } else {
                const { data } = this.state;
                if (data && data.length) {
                  const newData = this.updateNum(Sort(data, sorter.field, sorter.order));
                  this.setState({ data: newData })
                }
              }
            }}
            rowSelection={checkable ? this.rowSelection(rowCheckableKeys) : undefined}
            scroll={{
              y,
              x: this.getScrollWidth(),

            }}
            rowClassName={(record, index) => {
              const { rowSelectedKeys } = this.state;
              if (record.key && rowSelectedKeys.indexOf(record.key) >= 0) {
                return 'ClickRowStyle'
              } if (index % 2 === 1) {
                return 'RowDouble'
              }
            }}
            pagination={false}
            onRow={
              (record, index) => ({
                onClick: async event => {
                  this.rowClick(record, '', 'click')
                },
                onDoubleClick: async event => {
                  rowDoubleSelected(record)
                },
              })
            }
            {...rest}

            dataSource={data}

          />
          {
            !data || data.length === 0 ?
              null : frontCache ? null : showPagination ?
                (<div style={{ overflow: 'hidden', color: '#999', padding: '4px 8px 6px 10px', border: 'solid #ddd', borderWidth: '0 1px 1px 1px', opacity: this.props.loading ? 0.1 : 1, display: 'pagination.total' ? '' : 'none' }}>
                  <div style={{ float: 'left' }}>共<span style={{ margin: 5, color: 'black' }}>{pagination
                    .total}</span>条记录
              </div>
                  <div style={{ float: 'left', marginLeft: '20px' }}>第
                <span style={{ margin: 5 }}>{pagination
                      .current}/{Math.ceil(pagination
                        .total / pagination
                          .pageSize)}</span>
              页</div>
                  <div style={{
                    float: 'right',
                    display: Math.ceil(pagination
                      .total / pagination
                        .pageSize) > 1 ? '' : 'none',
                  }}>
                    <Button type="default" size="small" style={{ marginLeft: '10px' }}>确定</Button>
                  </div>
                  <div style={{ float: 'right' }}>
                    <Pagination
                      showQuickJumper
                      pageSizeOptions={pageSizeOptions}
                      onChange={this.paginationChange.bind(this)}
                      showSizeChanger
                      total={pagination.total}
                      pageSize={pagination.pageSize}
                      current={pagination.current}
                      onShowSizeChange={this.onShowSizeChange.bind(this)}
                      size="small"
                    />

                  </div>
                </div>)
                : null
          }
        </ConfigProvider>
      </div>
    )
  }
}
