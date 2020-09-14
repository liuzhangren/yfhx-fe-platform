/*eslint-disable */
import React from 'react';
import {
  Form,
  Spin,
  message
} from 'antd';
import {
  Table as LinkTable,
  Modal,
} from 'view';
import { connect } from 'dva';

@Form.create()

class ProjColumnModal extends React.Component {
  static defaultProps = {
    loading: false,
  };

  state = {
    type: 'ADD',
    visible: false,
    data: {},
  };
  componentDidMount () {
    const self = this;
    this.props.onInit(this);

  }

  handleUserCancel () {
    this.hide()
    // console.log('cancel')
  }

  handleUserOk () {
    const self = this;
    //校验是否勾选
    const rows = this.state.selectedRows;
    // 
    if (rows.length < 1) {
      message.error('请勾选数据');
      return;
    }
    //得到选中的那条数据??

    try {
      const confirm = self.props.confirm || function () { };
      if (self.state.type == "ADD") {
        confirm(
          {
            rows,
          },
          self.state.type
        );
      }
    } catch (e) { }


  }

  async hide () {
    await this.setState({
      visible: false,
      selectedRowKeys: [],
      selectedRows: []
    });
    // await console.log(this.state)
    await this.tb.clearData()
  }

  show (type, data) {
    const { dispatch } = this.props;
    this.setState(
      {
        visible: true,
        type: type,
        data,
        selectedRows: []
      },
      () => {
        // 加载项目信息
        dispatch({
          type: 'role/getUserAllData',
          payload: {
            flag: 'true', roleId: data, ceshi: '1',
            limit: 10,
            page: 1,
          }
        })
      }
    );
  }
  onShowSizeChange (current, pageSize) {
    const { dispatch } = this.props;
    this.setState({
      pagination: {
        current,
        pageSize
      }
    })
    dispatch({
      type: 'role/getUserAllData',
      payload: {
        limit: pageSize, page: 1
      }
    })
  }
  paginationChange (page, size) {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/getUserAllData',
      payload: {
        page,
        limit: size
      }
    })
  }
  onChange (selectedRowKeys, selectedRows) {
    if (selectedRowKeys.length > 0) {
      const keys = selectedRows.reduce((r, c) => {
        return [
          ...r,
          c.account
        ]
      }, [])
      this.setState({
        selectedRowKeys: keys,
        selectedRows: selectedRows
      })
    } else {
      this.setState({
        selectedRowKeys: []
      })
    }
  }
  render () {
    const { baseHeight } = this.props;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div>
        <Modal
          title={'新增项目'}
          visible={this.state.visible}
          onOk={this.handleUserOk.bind(this)}
          onCancel={this.handleUserCancel.bind(this)}
          forceRender
          width={900}
        >
          <LinkTable

            columns={[
              {
                dataIndex: 'projectName',
                title: '项目名称',
                width: 150,
              },

              {
                dataIndex: 'appScheme',
                title: '项目编号',
              },
            ]}
            bordered
            loading={this.props.loading.global}
            rowSelection={rowSelection}
            ref={(tb) => { this.tb = tb }}
            pagination={this.props.role.allProjPagination}
            onChange={this.onChange.bind(this)}
            clearData={() => { this.setState({ selectedRowKeys: [], selectedRows: [] }) }}
            dataSource={this.props.role.allProjectData}
            paginationChange={this.paginationChange.bind(this)}
            onShowSizeChange={this.onShowSizeChange.bind(this)}
            batchButton={[]}
          />
        </Modal>
      </div>
    );
  }
}

export default connect(({ role }) => ({
  role
}))(ProjColumnModal)