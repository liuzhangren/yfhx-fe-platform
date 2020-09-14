
import React, { Component } from 'react';
import { Input, Modal, ConfigProvider } from 'antd';

import CronEditor from 'antd-cron-editor';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';

const { Search } = Input;

export default class CronGenerator extends Component {
  state = {
    visible: false,
  };

  handleChange = cronText => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(cronText)
    }
  };

  render() {
    const { value, onChange } = this.props;
    const { visible } = this.state;
    const locale = getLocale() === 'en-US' ? enUS : zhCN;
    return (
      <div>
        <Search
          value={value}
          style={{ width: 200 }}
          placeholder='请输入'
          enterButton='请选择'
          onSearch={() => {
            this.setState({ visible: true });
          }}
          onChange={val => {
            if (onChange) {
              onChange(val);
            }
          }}
        />
        <ConfigProvider locale={locale}>
          <Modal
            width={1200}
            height={900}
            title='选择图标'
            onOk={() => {
              this.setState({ visible: false })
            }}
            onCancel={() => {
              this.setState({ visible: false });
            }}
            visible={visible}
          >
            <CronEditor onChange={this.handleChange} value={value} />
          </Modal>
        </ConfigProvider>

      </div>
    );
  }




}
