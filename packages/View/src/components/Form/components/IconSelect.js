/* eslint-disable */
import React, { Component } from 'react';
import { Input, Modal, Icon } from 'antd';

import Iconlib from '../../Iconlib/index'

const { Search } = Input;

export default class IconSelect extends Component {
  state = {
    visible: false,
  };

  render () {
    const { value, onChange, width, iconShow = false } = this.props;
    const { visible } = this.state;
    return (
      <div>
        <Search
          value={value}
          style={{ width: width }}
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
        {iconShow && <Icon type={value} style={{ fontSize: '30px', lineHeight: '30px', marginLeft: '10px', verticalAlign: 'middle' }} />}
        <Modal
          width='80%'
          height='65vh'
          title='选择图标'
          onCancel={() => {
            this.setState({ visible: false });
          }}
          footer={null}
          visible={visible}
        >
          <Iconlib
            onSelect={type => {
              this.setState({ visible: false });
              if (onChange) {
                onChange(type);
              }
            }}
          />
        </Modal>
      </div>
    );
  }
}
