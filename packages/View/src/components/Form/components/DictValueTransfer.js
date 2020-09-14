import React from 'react';


class DictValueTransfer extends React.Component {

    static defaultProps = {
        options: []
    }

    render() {
        const { value, modelType, dictType, dataSource, dispatch } = this.props;
        const options = dataSource[modelType] ? dataSource[modelType][dictType] : undefined;
        if (options === undefined) {
            dispatch({
                type: 'dict/getDictInfoByType',
                payload: { modelType, dictType }
            });
            return value;
        }
        const option = options.filter(opt => opt.value == value)
        if(option.length === 0){
            return value
        }
        return option[0].label;
    }
}

export default DictValueTransfer;