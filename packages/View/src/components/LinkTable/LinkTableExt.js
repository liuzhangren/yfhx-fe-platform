import React from 'react';
import { Modal, Card, Button  } from 'antd';
import { Table } from 'kotomi-ui';
import { restfulApi } from '../../../services/restful';

/**
 * 额外参数 
 * @param link 远程链接的link地址
 * @param defaultParams 默认参数
 */
export default class LinkTableExt extends React.Component {

    static defaultProps = {
        event:{}
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

    getColumns = () => {
        const { editingType, columns } = this.props;
        const newColumns = [...columns];
        newColumns.unshift({
            dataIndex: '$index',
            title: '#',
            width: 40,
        })
        if (editingType !== 'none') {
            newColumns.unshift({
                dataIndex: '$state',
            })
        }
        return newColumns;
    }
    
    static defaultProps = {
        event:{}
    }

    /**
     * 获取查询和重置按钮
     */
    static getQueryAndReset({queryClick,resetClick}){
        return (
            <>
              <Button
                style={{ marginRight: 10 }}
                type="primary"
                onClick={()=>{
                    if(queryClick){
                        queryClick()
                    }
                }}
              >查询
              </Button>
              <Button
                style={{ marginRight: 10 }}
                onClick={()=>{
                    if(resetClick){
                        resetClick()
                    }
                }}
              >重置
              </Button>
            </>
          )
    }

    /**
     *
     * @param pageSize 显示页面大小
     * @param
     */
    async requestData({ pageSize, pageNo, param }) {
        const self = this;
        const { defaultParams } = this.props;
        const params = {
            ...defaultParams,
            size: pageSize,
            current: pageNo,
            ...param,
        };
        const data = await restfulApi(self.props.link + self.toParame(params), 'GET', {})
        return data.data
    }


    render() {
        const { columns, event, defaultParams,title,extra, ...restProps } = this.props;
        return (
          <Card
            title={title}
            extra={extra}
            className="kotomi-link-table-card "
          >
            <Table
              defaultPageSize="50"
              theme="default"
              rowKey='key'
              loadData={async ({ page, pageSize, param }) => {
                            const datas = await this.requestData({
                                pageNo: page,
                                pageSize,
                                param: param || {}
                            })
                            const { records } = datas;
                            const newRecords = records.map((item, index) => { 
                                const newItem = { ...item };
                                newItem.key = index;
                                return newItem;
                            })
                            datas.records = newRecords;
                            const realDatas = datas || {
                                records: [],
                                total: 0
                            }
                            return {
                                dataSource: realDatas.records,
                                total: realDatas.total
                            }
                        }}
              columns={this.getColumns()}
              {...restProps}
              event={{
                        ...event,
                        onSave: async (data, type) => {
                            const { event: { onSave } } = this.props;
                            if (type === 'DELETE') {
                                Modal.confirm({
                                    title: '你确定要删除此项吗?',
                                    content: '删除后将无法恢复！',
                                    onOk: ()=>{onSave(data, type)}
                                });
                            } else {
                                onSave(data, type);
                            }
                        },
                        onRenderBodyRowCssStyle: (rowIndex)=>{
                            if(rowIndex%2 === 0){
                                return {
                                    backgroundColor: '#f9f9f9'
                                }
                            }
                            return {
                                backgroundColor: '#ffffff'
                            }
                        },
                        onRenderHeaderRowCssStyle:() => {
                            return {
                                backgroundColor: '#f2f2f2'
                            }
                        }
                    }}
            />
          </Card>
        )
    }
}
