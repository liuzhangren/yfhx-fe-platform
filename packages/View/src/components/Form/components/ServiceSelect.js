import React from 'react';
import OptionSelect from './OptionSelect';
// import { restfulApi } from '../../../services/restful';

export default class ServiceSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            options: [],
        };
    }


    // TODO 写个redux 用link 和  下拉框数据相关联做缓存
    // componentDidMount() {
    //     const { link, param } = this.props;
    //     const url = link || ''
    //     restfulApi(url || '', 'get', param).then(response => {
    //         if (response && response.code === 0) {
    //             const options = response.data;
    //             this.setState({ options });
    //         }
    //     });
    // }

    handleChange = value => {
        const { onChange, onBlur } = this.props;
        if (onChange) {
            onChange(value);
        }
        if(onBlur){
            onBlur();
        }
    };

    focus(){
        this.dom.focus()
    }   

    render() {
        const { value , ...restProps} = this.props;
        const { options } = this.state;
        return <OptionSelect {...restProps} ref={(dom)=>{ this.dom = dom}} value={value} options={options} onChange={this.handleChange} />;
    }
}