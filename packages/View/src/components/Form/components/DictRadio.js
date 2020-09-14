/* eslint-disable */
import React, { Component } from 'react'

import OptionRadio from './OptionRadio';


class DictRadio extends Component {

  constructor(props) {
    super(props);
    const { dispatch, modelType, dictType } = this.props;
    dispatch({
      type: 'dict/getDictInfoByType',
      payload: { modelType, dictType }
    });
  }

  render () {
    const { modelType, dictType, dataSource, dispatch } = this.props;
    const options = dataSource[modelType] ? dataSource[modelType][dictType] : undefined
    return <OptionRadio options={options} {...this.props}></OptionRadio>;
  }
}

export default DictRadio