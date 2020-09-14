import React from 'react'
import { Checkbox } from 'antd'

/**
 * 只有一个选项的复选框
 * @param value true 为选中， false 为不勾选
 */
export default class SingleCheckBoxExt extends React.Component {

    getValue = () => {
        const { value } = this.props;
        if (value === 1) {
            return ['1']
        }
        return [];
    }

    handleChange = (value) => {
        const { onChange, onBlur } = this.props;
        if (onChange) {
            if (value.length >= 1) {
                onChange(1)
            } else {
                onChange(0)
            }
        }
        if (onBlur) {
            onBlur();
        }
    }

    render() {
        return (
          <Checkbox.Group {...this.props} value={this.getValue()} onChange={this.handleChange}>
            <Checkbox value="1" />
          </Checkbox.Group>
        )
    }

}