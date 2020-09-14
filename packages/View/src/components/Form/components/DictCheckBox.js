/* eslint-disable */
import React, { Component } from 'react'

import OptionCheckBox from './OptionCheckBox';


class DictCheckBox extends Component {

    constructor(props){
        super(props);
        const { dispatch, modelType, dictType} = this.props;
        dispatch({
            type: 'dict/getDictInfoByType',
            payload: { modelType, dictType }
        });
    }

    render() {
        const { dataSource, modelType, dictType } = this.props;
        const options = dataSource[modelType] ? dataSource[modelType][dictType] : undefined;
        return <OptionCheckBox options={options} {...this.props}></OptionCheckBox>;
    }

}

export default DictCheckBox