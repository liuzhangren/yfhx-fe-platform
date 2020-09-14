/* eslint-disable */
import React, { Component } from 'react';
import { Slider, InputNumber, Row, Col } from 'antd';

export default class OptionCheckBox extends Component {
  static defaultProps = {
    value: 0
  };
  state = {
    inputValue: 0
  }
  componentDidMount() {

  }
  componentDidUpdate() { }

  formatter = (value) => {
    const { tipFormatter } = this.props
    return tipFormatter ? `${value}${tipFormatter}` : value;
  }

  render() {
    const { tipFormatter } = this.props
    return (
      <Row>
        <Col span={12}>
          <Slider
            {...this.props}
            tipFormatter={this.formatter}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            {...this.props}
          />
        </Col>
        <Col span={1}>{tipFormatter}</Col>
      </Row>
    );
  }
}


