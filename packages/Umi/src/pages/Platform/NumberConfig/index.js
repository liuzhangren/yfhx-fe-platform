import React from 'react';
import { LinkQueryForm, SForm } from 'view';
import SingleTableWrap from '@/components/Alink/SingleTable/SingleTableWrap';
import SingleTable from '@/components/Alink/SingleTable';
import { RowDelete, RowsDelete, AddRow, TableModal, EditRow } from '@/components/Alink/Table/Table';
import { LayoutTable } from '@/components/Alink/LayoutTreeTable';
import { Divider } from 'antd';

export default class NumberConfig extends React.Component {
  state = {

  }

  componentDidMount() {
    this.tb.refresh()
  }

  render() {
    const formItems = [
      {
        key: 'moduleCode',
        label: '模块编码',
        props: {
          // disabled: true,
        },
        componentType: 'input',
        options: {
          rules: [{ required: true }, { min: 1, max: 32, message: '最大长度32个字符' }],
        },
      },
      {
        key: 'moduleName',
        label: '模块名称',
        props: {
          // disabled: true,
        },
        componentType: 'input',
        options: {
          rules: [{ required: true }, { min: 1, max: 32, message: '最大长度32个字符' }],
        },
      },
      {
        key: 'serialLength',
        label: '序列长度',
        props: {
          // disabled: true,
          min: 1,
          max: 99,
        },
        componentType: 'inputNumber',
        options: {
          rules: [{ required: true }],
        },
      },
      {
        key: 'serialReset',
        label: '序列号重置规则',
        props: {
          // disabled: true,
        },
        componentType: 'input',
        options: {
          rules: [{ required: true }, { min: 1, max: 32, message: '最大长度32个字符' }],
        },
      },
      {
        key: 'serialTemplate',
        label: '序列生成模板',
        props: {
          // disabled: true,
        },
        componentType: 'input',
        options: {
          rules: [{ required: true }, { min: 1, max: 32, message: '最大长度32个字符' }],
        },
      },
      {
        key: 'remark',
        label: '备注',
        componentType: 'textArea',
        placeholder: '备注信息',
        props: {
          autoSize: { minRows: 3, maxRows: 5 },
        },
        options: {
          rules: [{ required: false }],
        },
      },
    ]
    return (
      <LayoutTable>
        <SingleTableWrap>
          <LinkQueryForm
            formItems={[
              {
                key: 'moduleCode',
                label: '模块编码',
                componentType: 'input',
                placeholder: '生产线编号',
              },
              {
                key: 'moduleName',
                label: '模块名称',
                componentType: 'input',
                placeholder: '生产线名称',
              },
            ]}
            verifySuccess={value => {
              this.tb.refresh({ ...value }, '', true)
            }}
          />
          <SingleTable
            ref={tb => { this.tb = tb }}
            link="/v1/pserials"
            rowDelLink="/v1/pserial"
            rowAddLink="/v1/pserial"
            rowEditLink="/v1/pserial"
            rowsDelLink="/v1/pserials"
            onChange={this.onChange}
            headerButton={[
              <AddRow
                modal={this.menuModal}
                // record={this.props.user.currentUser}
                authrizetype="add"
                beforeShow={() => { }}
              >新增</AddRow>,
            ]}
            batchButton={[
              <RowsDelete table={this.tb} authrizetype="delete" onCallback={() => { console.log('我是批量删除回调') }}>批量删除</RowsDelete>,
            ]}
            columns={[
              {
                dataIndex: 'moduleCode',
                title: '模块编码',
                sorter: true,
              },
              {
                dataIndex: 'moduleName',
                sorter: true,
                title: '模块名称',
              },
              {
                dataIndex: 'serialLength',
                title: '序列长度',
                sorter: true,
              },
              {
                dataIndex: 'serialReset',
                title: '序列号重置规则',
                sorter: true,
              },
              {
                dataIndex: 'serialTemplate',
                title: '序列生成模板',
                sorter: true,
              },
              {
                dataIndex: 'remark',
                title: '备注',
              },
              {
                dataIndex: 'operation',
                title: '操作',
                fixed: 'right',
                width: 70,
                render: (text, record) => (
                  [
                    <EditRow record={{ ...record }} authrizetype="edit" type="UPDATE" modal={this.menuModal}> 编辑</EditRow>,
                    <Divider type="vertical" />,
                    <RowDelete table={this.tb} authrizetype="delete" record={record} onCallback={() => { console.log('我是删除成功回调') }}>删除</RowDelete>,
                  ]
                ),
              },
            ]}
          />
          <TableModal
            ref={menuModal => {
              this.menuModal = menuModal;
            }}
            width="80%"
            bodyStyle={{
              paddingTop: 24,
            }}
            title="编码配置"
            table={this.tb}
            onOk={(type, record) => {
              let data = '';
              this.form.validateFields((err, values) => {
                if (!err) {
                  if (type === 'UPDATE') {
                    data = { ...record, ...values }
                  } else {
                    data = { ...values }
                  }
                }
              });
              return data;
            }}
            onShow={record => {
              if (record) {
                setTimeout(() => {
                  this.form.setFieldsValue({
                    ...record,
                  });
                }, 100);
              }
            }}
          >
            <SForm
              ref={form => { this.form = form }}
              formItems={formItems}
              rowNum={2}
              layoutType={4}
            />
          </TableModal>
        </SingleTableWrap>
      </LayoutTable>
    )
  }
}
