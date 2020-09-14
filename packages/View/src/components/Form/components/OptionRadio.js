/* eslint-disable */
import React, { Component } from 'react';
import { Radio } from 'antd';

export default class OptionRadio extends Component {

  static defaultProps = {
    options: [],
  };

  render() {
    const { options, value, onChange } = this.props;
    return (
      <Radio.Group
        value={value}
        onChange={value => {
          onChange(value);
        }}
        {...this.props}
      >
        {options.map(opt => {
          return <Radio value={opt.value}>{opt.label}</Radio>;
        })}
      </Radio.Group>
    );
  }
}
