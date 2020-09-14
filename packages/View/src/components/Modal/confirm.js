
import React from 'react';
import { Modal, Icon } from 'antd';
import styles from './Smodal.less';
export default function (props, type) {
  props = props || {}
  let { title, content, okText = "确定", cancelText = '取消', className, icon = <Icon type="question-circle" />, ...rest } = props;
  className = `${className} Modal_confirm`;
  title = type ? type == 'many' ? '您确定要删除选中数据吗?' : '您确定要删除这条数据吗?' : title;
  content = type ? '删除后将无法恢复' : content;
  const obj = {
    title, content, okText, cancelText, className, icon, ...rest
  }
  Modal.confirm(obj);
}