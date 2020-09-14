
import React from 'react';
import { Modal, Icon } from 'antd';
import styles from './Smodal.less';
export default function (props) {
  props = props || {}
  let { title, content, okText = "确定", cancelText = '取消', className, icon = <Icon type="exclamation-circle" />, ...rest } = props;
  className = `${className} Modal_confirm`;
  const obj = {
    title, content, okText, cancelText, className, icon, ...rest
  }
  Modal.warning(obj);
}