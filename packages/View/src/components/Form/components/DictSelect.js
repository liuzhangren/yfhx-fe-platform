import React, { Component } from 'react'

import OptionSelect from './OptionSelect';

class DictSelect extends Component {
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
        return <OptionSelect options={options} {...this.props} />;
    }
}

export default DictSelect