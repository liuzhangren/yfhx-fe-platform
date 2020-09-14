import React from 'react';
import { Button } from 'antd';

import LinkComponent from './LinkComponent';

/**
 * 可以远程连接到后台初始化数据的Button
 */
export default class LinkButton extends LinkComponent{
    renderJSX(props){
        return <Button {...props} />
    }
}