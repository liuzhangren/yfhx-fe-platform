import React from 'react';
import { Row, Col, Alert } from 'antd'


export default class TableAlertInfo extends React.Component {

  getMessage() {
    const { selectedLength, sumLength, onCancel, isShowExport, onExport, onExportBackEnd, queryShowExport } = this.props;

    return (
      <Row>
        <Col span={3}>
          已选择
          <span style={{ margin: 5, color: '#1890ff' }}>{selectedLength}</span>
          项
        </Col>
        <Col span={4}>
          本页总数据为
          <span style={{ margin: 5, color: 'black' }}>
            {sumLength}
            项
          </span>
        </Col>
        <Col span={2}>
          <a
            disabled={selectedLength === 0}
            style={{ marginLeft: 15, color: selectedLength === 0 ? '#ddd' : '#1890ff', fontWeight: 400 }}
            onClick={onCancel}
          >
            清除
          </a>
        </Col>
        <Col span={2}>
          <a style={{ display: isShowExport ? 'block' : 'none' }} onClick={onExport}>
            导出
          </a>
        </Col>
        <Col span={3}>
          <a style={{ display: queryShowExport ? 'block' : 'none' }} onClick={onExportBackEnd}>
            导出当前查询
          </a>
        </Col>
      </Row>
    )
  }

  render() {
    return (
      <Alert
        banner={true}
        type='info'
        message={this.getMessage()}
      />
    )
  }
}
