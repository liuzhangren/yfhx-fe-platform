/*eslint-disable */
import React from 'react';
import { Card } from 'antd'

/**
 * 表单用容器card
 */
export default class FormCard extends React.Component {

    render() {
        return (
            <Card
                bordered
                size="small"
                type="inner"
                {...this.props}
            >{this.props.children}</Card>
        )
    }
}