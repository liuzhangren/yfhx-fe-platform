import React, { Component } from 'react';
import { DatePicker } from 'antd';
import style from './yearPicker.less';
class YearPicker extends Component {

  state = {
    // value: '2020'
    isOpen: false,
  }

  render() {
    // console.log(this.props)
    return (     
      <DatePicker
        mode="year"
        onPanelChange={(e) => {
          this.props.onChange(e)
          this.setState({
            value: e,
            isOpen: false
          })
        }}
        onOpenChange={(e) => {
          this.setState({
            isOpen: e
          })
        }}
        open={this.state.isOpen}
        format="YYYY"
        value={this.state.value}
        // onChange={(value) => console.log(value)}
      />
    )
  }
}

export default YearPicker;
