/*eslint-disable*/
import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import {
  Row,
  Col,
  Form,
  message,
  Divider,
  Spin,
  Button
} from 'antd';
import moment from 'moment';
import {
  // Table as LinkTable,
  LinkQueryForm,
  Scard,
  SForm,
  Confirm,
  Modal,
} from 'view';

import Table from "@/components/Alink/SingleTable"
import SingleTableWrap from "@/components/Alink/SingleTable/SingleTableWrap"
import { RowDelete, RowsDelete, AddRow, TableModal, EditRow } from "@/components/Alink/Table/Table"
import LayoutTreeTable, { LayoutTable } from "@/components/Alink/LayoutTreeTable"

import styles from './index.less'




// import AuthorizationForm from '@/components/Form/AuthorizationForm';
const { TabPane } = Tabs;
class AdminForm extends Component {
  render () {
    const formItems = [
      {
        key: 'account',
        label: '账号',
        componentType: 'input',
        options: {
          rules: [{ required: true }],
        },
      },
      {
        key: 'userName',
        label: '姓名',
        componentType: 'input',
        options: {
          rules: [{ required: true }],
        },
      },
      {
        key: 'sex',
        label: '性别',
        componentType: 'optionSelect',//optionSelect
        props: {
          options: [{
            value: 1,
            label: "男"
          }, {
            value: 0,
            label: "女"
          }
          ]
        },
      },
      {
        key: 'birthday',
        label: '出生日期',
        componentType: 'datePicker',
        options: {
          rules: [{ required: true }],
        },
        props: {
          format: 'YYYY-MM-DD'
        }
      },
      {
        key: 'nation',
        label: '民族',
        componentType: 'input'
      }, {
        key: 'phone',
        label: '手机号',
        componentType: 'input',
        options: {
          rules: [{ pattern: /^[0|1]\d{10}$/, message: "请输入正确的手机号" }],
        },
      },
    ]
    const { onFormLoad } = this.props;
    return (
      <SForm
        ref={form => {
          onFormLoad(form);
        }}
        formItems={formItems}
      />
    );
  }
}

class AdminGrd extends Component {
  state = {
    manage: {
      disabled: true,
      visable: false,
      selectedRowKeys: [],
      selectedRows: [],
      pagination: {
        limit: 10,
        page: 1
      },
      searchVal: {}
    },
    record: undefined
  };

  componentDidMount () {
    this.forceUpdate();
    if (this.tb) {
      this.tb.refresh({ userType: 'PROJECT_ADMIN' })
    }
  }

  render () {
    const self = this;
    const { baseHeight, dispatch } = this.props;
    return (
      <LayoutTable>
        <SingleTableWrap>
          <LinkQueryForm
            formItems={[
              {
                key: 'account',
                label: '账号',
                componentType: 'input'
              },
              {
                key: 'userName',
                label: '姓名',
                componentType: 'input'
              },
            ]}
            verifySuccess={value => {
              self.setState({
                searchValue: {
                  ...value,
                }
              }, () => {
                this.tb.refresh({ ...value }, "", true)
              })
            }}
          />
          <Table
            ref={tb => this.tb = tb}
            link="/get/v1/pusers"
            rowDelLink="/delete/v1/puser"
            rowAddLink="/post/v1/admin-user"
            rowEditLink="/put/v1/puser"
            rowsDelLink="/delete/v1/pusers"
            columns={[
              {
                dataIndex: 'account',
                title: '账号',
                width: 150,
              },
              {
                dataIndex: 'userName',
                title: '姓名',
                width: 150,
              },
              {
                dataIndex: 'sex',
                title: '性别',
                width: 100,
                render: sex => {
                  return { 0: '女', 1: '男' }[sex]
                },
              },
              {
                dataIndex: 'birthday',
                title: '出生日期',
                width: 250,
                render: (text, record, index) => {
                  if (text == '' || text == null) {
                    return <div>{text}</div>;
                  }
                  return <div>{moment(text).format('YYYY-MM-DD')}</div>;
                },
              },
              {
                dataIndex: 'nation',
                title: '民族',
                width: 150,
              },
              {
                dataIndex: 'phone',
                title: '电话号码',
              },
              {
                dataIndex: 'operation',
                title: '操作',
                fixed: 'right',
                width: 170,
                render: (text, record, index) => {
                  return (
                    <div>
                      <EditRow
                        record={{
                          ...record,
                          birthday: moment(record.birthday),
                        }}
                        type={'UPDATE'}
                        modal={this.menuModal}
                      >
                        编辑
                        </EditRow>
                      <Divider type='vertical' />
                      <RowDelete table={this.tb} record={record} onCallback={() => { console.log("我是删除成功回调") }}>删除</RowDelete>
                    </div>
                  );
                },
              },
            ]}
            bordered
            isSpin
            headerButton={[
              <AddRow
                modal={this.menuModal}
                beforeShow={() => { }}
              >新增</AddRow>
            ]}
            batchButton={[
              <RowsDelete table={this.tb} onCallback={() => { console.log("我是批量删除回调") }}>批量删除</RowsDelete>,
            ]}
          />
          <TableModal
            ref={menuModal => { this.menuModal = menuModal; }}
            width={700}
            title="管理员信息"
            table={this.tb}
            bodyStyle={{ padding: '10px' }}
            onOk={(type, record) => {
              let data = "";
              this.form.validateFields((err, values) => {
                if (!err) {
                  const { birthday } = values
                  if (birthday) values.birthday = moment(values.birthday).format('YYYY-MM-DD')
                  if (type === "UPDATE") {
                    data = { ...record, ...values }
                  } else {
                    data = { ...values, resourceCatagory: 2 }
                  }
                }
              });
              return data;
            }}
            onShow={(record, type) => {
              if (type !== 'ADD' && record) {
                this.form.setFieldsValue({
                  ...record
                });
              }
            }}
          >
            <AdminForm onFormLoad={form => (this.form = form)} type={this.state.type} />
          </TableModal>
        </SingleTableWrap>
      </LayoutTable>

    );
  }
}
export default connect(({ global, loading, adminMng }) => ({
  baseHeight: global.contentHeight,
  loading,
  adminMng,
  proTableLoading: loading.effects['adminMng/getProjectData'],
  manTableLoading: loading.effects['adminMng/getManageData'],
}))(props => <AdminGrd {...props} />);
