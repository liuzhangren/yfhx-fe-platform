import React from 'react';

import { DatePicker } from 'antd';
const { RangePicker, MonthPicker } = DatePicker;
class ControlledRangePicker extends React.Component {
  state = {
    mode: ['month', 'month'],
    value: [],
  };

  handlePanelChange = (value, mode) => {
    this.setState({
      value,
      mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
    });
  };

  handleChange = value => {
    this.setState({ value });
  };

  render() {
    const { value, mode } = this.state;
    const { ...rest } = this.props;
    return (
      <RangePicker
        {...rest}
        placeholder={['开始月份', '结束月份']}
        format="YYYY-MM"
        value={value}
        mode={mode}
        onChange={this.handleChange}
        onPanelChange={this.handlePanelChange}
      />
    );
  }
}
export default ControlledRangePicker