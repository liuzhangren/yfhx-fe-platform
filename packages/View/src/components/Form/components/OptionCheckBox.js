/* eslint-disable */
import React, { Component } from 'react';
import { Checkbox } from 'antd';

export default class OptionCheckBox extends Component {

  static defaultProps = {
    options: [],
  };

  render() {
    const { options, value, onChange } = this.props;
    return (
      <Checkbox.Group
        value={value}
        onChange={onChange}
        onChange={value => {
          onChange(value);
        }}
        {...this.props}
      >
        {options.map(opt => {
          return <Checkbox value={opt.value}>{opt.label}</Checkbox>;
        })}
      </Checkbox.Group>
    );
  }
}


