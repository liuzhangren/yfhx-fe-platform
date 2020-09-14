import React from 'react';
import {
  Input
} from 'antd';

const { TextArea } = Input;


export default class TextAreaSecond extends React.Component {
  state = {
    no: 1,
    value: ''
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if(value) {
      this.setState({
        value,
        no: value.split('\n').length
      })
    }else {
      const { no } = this.state;
      this.setState({
        value: `${no}.`
      })
    }
  }

  pressEnter = e => {
    e.preventDefault();
    e.stopPropagation();
    const { no } = this.state
    this.setState({
      no: no+1,
      value: `${this.state.value}\n${no+1}.`
    })
  }

  onChange = e => {
    const { no } = this.state
    if(e.target.value.split('\n').length < no) {
      this.setState({
        no: no - 1
      })
    }
    this.setState({
      value: e.target.value
    })
  }

  render() {
    return (
      <TextArea
        onPressEnter={this.pressEnter}
        onChange={this.onChange}
        {...this.props}
        value={this.state.value}
      />
    )
  }
}