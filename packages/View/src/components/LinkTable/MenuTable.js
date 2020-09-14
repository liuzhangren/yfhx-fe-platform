/* eslint-disable */
import React, { Component } from 'react';
import { Table, Alert, Icon, Row, Col, Modal, Typography, ConfigProvider, message, Form, Input, Popconfirm, Divider } from 'antd';

import { restfulApi } from '@/services/restful';

const Paragraph = Typography.Paragraph

const { confirm } = Modal;


/**
 * 获取后台表格的数据,自动连接生成表组件代码
 *
 *
 *
 * @param link     请求后台的地址
 * @param pageSize 请求后台的页面大小
 * @method refresh(parames)   刷新表格,如果参数表示表格附带的请求参数,如果为空则使用之前的参数进行查询
 * 
 */


export default class MenuTable extends Component {

  static defaultProps = {

  };

  state = {
    data: [],
    pagination: {},
    loading: false,
    param: {},
    selectedRowKeys: [], // 批量勾选的模式下,选中的
    selectedRows: [],
    editingKey: '', // 行编辑模式下正在编辑的行
    modifiedRecords: {}, // 单元格编辑模式下编辑过的行(记录)及数据
    changedData: [], //cellEdit 模式下更改后的所有记录
  };




  componentDidMount() {
    const { pageSize, mode } = this.props;

    this.setState({
      pagination: {
        pageSize: parseInt(pageSize, 0),
        current: 1,
      },
    });


  }

  toParame = (data) => {
    let param = '?';
    Object.keys(data).forEach(key => {
      if (data[key] != null && data[key] !== '' && data[key] !== undefined) {
        param += `${key}=${data[key]}&`;
      }
    })
    return param;
  }






  /**
   *
   * @param pageSize 显示页面大小
   * @param pageNo 显示的页码
   * @param param 调用接口参数
   */
  async requestData({ pageSize, pageNo, param }) {
    const self = this;
    const { defaultParams } = this.props;
    return new Promise((resolve, reject) => {
      const params = {
        size: pageSize,
        current: pageNo,
        ...param,
        ...defaultParams
      };
      restfulApi(self.props.link + self.toParame(params), 'GET', {}).then(response => {
        if (response && response.code === 0) {
          resolve(response.data);
        } else {
          reject(response)
        }
      });
    });
  }

  /**
   * isBatch 为true, 则为批处理模式,使用默认配置
   *         为false, 时则使用外部传入的props 
   */
  getRowSelection({ isBatch, self, selectedRowKeys }) {
    if (isBatch) {
      return {
        type: 'checkbox',
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          self.setState({
            selectedRowKeys,
            selectedRows,
          });
        },
      }
    }
    const { rowSelection } = this.props;
    return rowSelection
  }


  // 页面最大展示条数改变时的回调
  handleSizeChange(current, pageSize) {
    this.refresh({}, { current: 1, pageSize });
  }

  /**
   * 刷新表格信息
   * @param  param 刷新表格的参数
   */
  refresh(param, pagination) {
    const pager = { ...this.state.pagination };
    const { beforeSetData } = this.props;
    const self = this;

    pager.showSizeChanger = true;
    pager.onShowSizeChange = this.handleSizeChange.bind(self);
    pager.showQuickJumper = true;

    // 区分是手动触发的刷新,还是由用户点击的下一页,如果是由用户点击的,则获取用户改变额信息
    if (pagination) {
      pager.current = pagination.current;
      pager.pageSize = pagination.pageSize;
    } else {
      pager.current = 1;
      pager.pageSize = 10;
    }

    self.setState({
      pagination: pager,
      loading: true,
      param,
    });

    self
      .requestData({
        pageSize: pager.pageSize,
        pageNo: pager.current,
        param,
      })
      .then(data => {
        const pagination = { ...self.state.pagination };
        // 此处修改获取数据对应的总数
        data = data || {};
        //TODO 自动生成key 不使用数组序号
        let records = data.data.map((item, index) => {
          let newItem = { ...item, key: index + 1, index: index + 1 }
          return newItem;
        });

        // 对数据库拉到的数据, 进行预处理
        if (beforeSetData) {
          records = beforeSetData(records);
        }

        this.setState({ total: data.total });

        pagination.total = data.total;
        // // 跳页的时候取消编辑状态
        // console.log(records)
        self.setState({
          loading: false,
          // 此处修改对应的获取数据的结果集,
          initialData: records,
          data: records,
          modifiedRecords: [],
          pagination,
          selectedRowKeys: [],
        });
      }).catch((error) => {
        self.setState({
          loading: false
        })
      });
  }



  render() {
    return <Table bordered columns={this.props.columns} dataSource={this.state.data} />;
  }

}